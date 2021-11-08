import { app, App } from "electron";
import { is } from "electron-util";
import path from "path";

export const isDev: boolean = is.development;
export const DEV_URL: string = "http://localhost:9080";

export const getHTMLPath = (app: App, page: string, options: string = "") => {
  return path.join(app.getAppPath(), `${page}.html?${options}`);
};

export const getExtraResources = (app: App) => {
  return path
    .join(app.getAppPath(), "extraResources")
    .replace("dist\\main\\", "")
    .replace("dist/main/", "")
    .replace("app.asar/", "")
    .replace("app.asar\\", "");
};

const trustedURLs = ["https://svp-sigma.vercel.app", "https://lime-alpha.vercel.app", "http://localhost", ".html"];

export const isTrusted = (url: string) => {
  return !!trustedURLs.find((trustedURL) => url.includes(trustedURL));
};

export function getUrl(page: string, options: string = "") {
  return isDev ? `${DEV_URL}/${page}.html?${options}` : getHTMLPath(app, page, options);
}

export const Ok = (result: any) => {
  return { isSuccess: true, output: result };
};

export const Err = (err: any) => {
  return { isSuccess: true, output: err };
};
