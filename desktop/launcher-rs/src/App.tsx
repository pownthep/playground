import { useState } from "react";
import "./App.css";
import AppIcon from "./assets/rocket-icon.png";
import Ipc from "@pownthep/pubsub/lib/tauri/client";

interface App {
  url: string;
  hostname: string;
}

function App() {
  const [apps, setApps] = useState<App[]>([]);
  const [text, setText] = useState<string>("");

  const handleChange = (e: any) => setText(e.target.value);

  Ipc.publish("googleoauth/sign-in", "hello");

  const onKeyDown = (event: any) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (apps.length > 0) {
        Ipc.publish("open_app", apps);
        setApps([]);
        setText("");
      }
    } else if (event.key === "Tab") {
      try {
        const app = new URL(text);
        setApps((old) => [
          ...old,
          {
            url: app.href,
            hostname:
              app.port ||
              app.hostname.split(".")[0].split("-")[0].toUpperCase(),
          },
        ]);
        setText("");
      } catch (error: any) {
        setText(error.message);
      }
    } else if (event.key === "Backspace") {
      if (apps.length > 0) {
        setApps((oldApps) => {
          const newApps = [...oldApps];
          newApps.pop();
          return [...newApps];
        });
      }
    }
  };
  return (
    <div className="container">
      <div className="searchbar-container">
        <img
          src={AppIcon}
          alt="search icon"
          className="search-icon"
          spellCheck="false"
        />
        {apps.map(({ hostname, url }) => (
          <div className="tag" key={url}>
            {hostname.toUpperCase()}
          </div>
        ))}

        <input
          type="text"
          className="search-input"
          placeholder="Type App Name or URL"
          onKeyDown={onKeyDown}
          value={text}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}

export default App;
