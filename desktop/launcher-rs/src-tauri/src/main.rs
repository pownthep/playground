#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use actix_web::{web, App, HttpRequest, HttpServer, Responder};
use linemux::MuxedLines;
use serde::{Deserialize, Serialize};
use serde_json;
use std::default::Default;
use std::path::PathBuf;
use tauri::{WindowBuilder, WindowUrl};
use yup_oauth2::{InstalledFlowAuthenticator, InstalledFlowReturnMethod};

// the payload type must implement `Serialize`.
// for global events, it also must implement `Clone`.
#[derive(Clone, serde::Serialize)]
struct Payload {
  data: String,
}

#[derive(Serialize, Deserialize)]
struct WebApp {
  url: String,
  hostname: String,
}

#[tauri::command]
async fn publish(
  window: tauri::Window,
  app_handle: tauri::AppHandle,
  channel: String,
  data: String,
) {
  match channel.as_str() {
    "open_app" => {
      let web_apps: Vec<WebApp> = serde_json::from_str(data.as_str()).unwrap_or([].into());
      for web_app in web_apps.into_iter() {
        let WebApp { url, hostname } = web_app;
        app_handle
          .create_window(
            &url,
            WindowUrl::App(PathBuf::from(&url)),
            |window_builder, webview_attributes| {
              (window_builder.title(hostname), webview_attributes)
            },
          )
          .expect(format!("could not open web app: {:#?}", &url).as_str())
      }
    }
    _ => println!("channel: {:#?} data: {:#?}", channel, data),
  }
  window
    .emit_others(format!("/subscribe/{}", channel).as_str(), data)
    .expect("could not emit message to other windows");
}

fn main() {
  std::thread::spawn(|| server());
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![publish])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

#[derive(Deserialize)]
struct Info {
  code: String,
}

async fn code(info: web::Query<Info>) -> impl Responder {
  println!("{:#?}", info.code);
  format!("{:#?}", info.code)
}

#[actix_web::main]
async fn server() -> std::io::Result<()> {
  HttpServer::new(|| App::new().route("/", web::get().to(code)))
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}

#[tokio::main]
async fn watch_file() -> std::io::Result<()> {
  let mut lines = MuxedLines::new()?;

  // Register some files to be tailed, whether they currently exist or not.
  lines
    .add_file("C:/Users/PL/Desktop/hack-settings.json")
    .await?;

  // Wait for `Line` event, which contains the line captured for a given
  // source path.
  while let Ok(Some(line)) = lines.next_line().await {
    println!("line: {}", line.line());
  }

  Ok(())
}
