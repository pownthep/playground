import "./popup.scss";
import { render, h } from "preact";
import { useEffect, useState } from "preact/hooks";
import PubSubXT from "@pownthep/pubsub/lib/es/chrome-extension";
import prettyBytes from "pretty-bytes";
import { hls_parser, isMasterPlaylist } from "./hls-parser";
import { DLM } from "./dlm";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import ReactPlayer from "react-player";

dayjs.extend(relativeTime);

export interface MediaSources {
  url: string;
  size: number;
  name: string;
  mimeType: string;
  time: number;
}

/** @jsx h */
function App() {
  const [data, setData] = useState<MediaSources[]>([]);
  const [tab, setTab] = useState<string>("Active tab");
  const [tabId, setTabId] = useState<string>("");

  const setup = async () => {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const activeTab = tabs[0];
    if (activeTab && activeTab.id && activeTab.id !== -1 && activeTab.url && activeTab.url.includes("http")) {
      const key = `${activeTab.id}`;
      setTabId(key);
      const cache = await chrome.storage.local.get(key);
      const data = cache[key];
      console.log(data);
      if (data) parse_data(data);
      update_title(activeTab);
    }
  };

  const parse_data = (sourceData: any) => {
    Object.entries(sourceData).forEach(async (curr: any) => {
      const [url, info] = curr;
      if (info.mimeType.includes("mpegurl")) {
        const res = await fetch(url);
        const text = await res.text();
        if (isMasterPlaylist(text)) {
          const playlist = hls_parser(text, sourceData).map((variant) => ({
            url: variant.url,
            size: Number(variant["BANDWIDTH"]) / 8,
            mimeType: info.mimeType,
            name: variant["RESOLUTION"],
            time: info.time,
          }));
          return setData((prev) => [...prev, ...playlist]);
        }
      } else {
        return setData((prev) => [...prev, { url, ...info, size: Number(info.size ?? 0) }]);
      }
    });
  };

  const update_title = (tab: chrome.tabs.Tab) => {
    if (tab.title?.includes("http")) {
      setTab(tab.title?.split("/").pop() ?? "Active tab");
    } else setTab(tab.title ?? "Active tab");
  };

  useEffect(() => {
    setup();
    return () => {};
  }, []);

  return (
    <div className="popup-container">
      <h2 className="popup-title">{tab}</h2>
      <div className="action-btn-container">
        <IconButton
          icon={<RefreshIcon />}
          label={`Refresh`}
          onClick={() => {
            setData([]);
            setup();
          }}
        />
        <IconButton
          icon={<ClearAllIcon />}
          label={`Clear`}
          onClick={() => {
            chrome.storage.local.clear().then(() => {
              setData([]);
            });
          }}
        />
      </div>
      {data.map((info) => (
        <div key={info.url} className="video-item">
          <IconButton
            icon={<DownloadedIcon />}
            label={`${prettyBytes(info.size)}, ${info.name}, ${info.mimeType}, ${dayjs(info.time).fromNow()}`}
            onClick={() => {
              DLM.download(info.url, `${tab}`, Number(info.size) ?? 0, info.mimeType);
            }}
          />
        </div>
      ))}
    </div>
  );
}

export function IconButton({
  label,
  icon,
  onClick,
  disabled,
  active,
}: {
  disabled?: boolean;
  label: string;
  icon: any;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <div className={`icon-btn ${disabled && "icon-btn-disabled"} ${active && "icon-btn-active"}`} onClick={onClick}>
      <div className="icon-icon">{icon}</div>
      <div className="icon-label">{label}</div>
    </div>
  );
}

export const ClearAllIcon = ({ style }: any) => (
  <svg style={style} xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="#FFFFFF">
    <path d="M0 0h24v24H0V0z" fill="none" />
    <path d="M6 13h12c.55 0 1-.45 1-1s-.45-1-1-1H6c-.55 0-1 .45-1 1s.45 1 1 1zm-2 4h12c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1zm3-9c0 .55.45 1 1 1h12c.55 0 1-.45 1-1s-.45-1-1-1H8c-.55 0-1 .45-1 1z" />
  </svg>
);

export const DownloadedIcon = ({ style }: any) => (
  <svg style={style} xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="#FFFFFF">
    <g>
      <rect fill="none" height="24" width="24" />
    </g>
    <g>
      <path d="M12,2C6.49,2,2,6.49,2,12s4.49,10,10,10s10-4.49,10-10S17.51,2,12,2z M11,10V7c0-0.55,0.45-1,1-1h0c0.55,0,1,0.45,1,1v3 h1.79c0.45,0,0.67,0.54,0.35,0.85l-2.79,2.79c-0.2,0.2-0.51,0.2-0.71,0l-2.79-2.79C8.54,10.54,8.76,10,9.21,10H11z M16,17H8 c-0.55,0-1-0.45-1-1v0c0-0.55,0.45-1,1-1h8c0.55,0,1,0.45,1,1v0C17,16.55,16.55,17,16,17z" />
    </g>
  </svg>
);

export const RefreshIcon = ({ style }: any) => (
  <svg style={style} xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="#FFFFFF">
    <path d="M0 0h24v24H0V0z" fill="none" />
    <path d="M17.65 6.35c-1.63-1.63-3.94-2.57-6.48-2.31-3.67.37-6.69 3.35-7.1 7.02C3.52 15.91 7.27 20 12 20c3.19 0 5.93-1.87 7.21-4.56.32-.67-.16-1.44-.9-1.44-.37 0-.72.2-.88.53-1.13 2.43-3.84 3.97-6.8 3.31-2.22-.49-4.01-2.3-4.48-4.52C5.31 9.44 8.26 6 12 6c1.66 0 3.14.69 4.22 1.78l-1.51 1.51c-.63.63-.19 1.71.7 1.71H19c.55 0 1-.45 1-1V6.41c0-.89-1.08-1.34-1.71-.71l-.64.65z" />
  </svg>
);

render(<App />, document.getElementById("root")!);
