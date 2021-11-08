import { useEffect, useState } from "preact/hooks";
import { render, h } from "preact";
import PubSub from "@pownthep/pubsub/lib/es/electron/renderer";
import { Data } from "./interface";
import { DL_STATE, Progress, useDownload, useDownloadHLS, useDownloadSingle } from "./download.hook";
import "./download-dialoag.scss";
import "../../components/Theme/dark.scss";
import { ipcRenderer } from "electron";
import path from "path";
import { CrossIcon, DownloadIcon, FileOpenIcon, FolderIcon, PauseIcon } from "../../components/Icons";
import { ProgressBar } from "../../components/Progressbar";
import { DownloadSpeed } from "../../components/DownloadSpeed";
import { DownloadTimer } from "../../components/DownloadTimer";
import { GradientBorderContainer } from "../../components/Containers";
import { IconButton } from "../../components/IconButton";
import {
  TitlebarCloseBtn,
  TitlebarContainer,
  TitlebarMaximizeBtn,
  TitlebarMinimizeBtn,
} from "../../components/Titlebar";

/** @jsx h */
const startTime = new Date().getTime();

const StatusText = {
  idle: "Download",
  started: "Pause",
  paused: "Resume",
  appending: "Pause",
  finished: "Open",
};

const ProgressText = {
  idle: "",
  started: "Downloading",
  paused: "Paused",
  appending: "Appending files",
  finished: "Done",
};

interface IDownloadInfo {
  sum: number;
  time: number;
  speed: number;
  progress: number;
}

type DownloadInfoGetter = () => IDownloadInfo;

type IDownloadState = { [key: string]: DownloadInfoGetter };

const getData = () => {
  const arg = process.argv.find((arg) => arg.includes("data="));
  const base64: any = arg?.split("data=")[1];
  if (base64) return JSON.parse(Buffer.from(base64, "base64").toString("utf-8"));
  else return null;
};

const defaultData = {
  fileName: "Untitled",
  concurrency: 8,
  fileSize: 1_000_000_000,
  headers: {},
  savedFolder: "",
  url: "",
  mime: "",
};

const THRESH_HOLD = 200_000_000;

const hlsType = ["application/x-mpegurl", "application/vnd.apple.mpegurl"];

function App() {
  const [data, setData] = useState<Data>(getData() ?? defaultData);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isOpen, setOpen] = useState(false);

  const getDownloader = (data: Data) => {
    if (hlsType.includes(data.mime.toLowerCase())) {
      return useDownloadHLS(data, setData);
    } else if (data.fileSize < THRESH_HOLD) return useDownloadSingle(data);
    else {
      return useDownload(data);
    }
  };

  const download = getDownloader(data);

  useEffect(() => {
    PubSub.subscribe("/main/tab-service/on-maximize", () => setIsMaximized(true));
    PubSub.subscribe("/main/tab-service/on-unmaximize", () => setIsMaximized(false));
    return () => {};
  }, []);

  const minimize = () => PubSub.publish("/main/window/minimize");
  const maximize = () => PubSub.publish("/main/window/toggle-maximize");

  const getSeconds = () => {
    return (new Date().getTime() + 1 - startTime) / 1000;
  };

  const getSum = () => Object.values(download.downloadProgress).reduce((prev, curr) => (prev += curr.sum), 0);

  const InitialState: IDownloadInfo = {
    sum: 0,
    time: 1,
    speed: 0,
    progress: 0,
  };

  const FinalState: IDownloadInfo = {
    sum: data.fileSize,
    time: 0,
    speed: 0,
    progress: 100,
  };

  const toggleDetail = () => {
    if (isOpen) {
      ipcRenderer.invoke("close-detail");
      setOpen(false);
    } else {
      ipcRenderer.invoke("open-detail");
      setOpen(true);
    }
  };

  const DownloadState: IDownloadState = {
    [DL_STATE.IDLE]: () => ({
      ...InitialState,
    }),
    [DL_STATE.STARTED]: () => {
      const sum = getSum();
      const speed = sum / getSeconds();
      const time = data.fileSize === 0 ? 1 : (data.fileSize / speed) * 1000;
      const progress = data.fileSize === 0 ? 1 : Math.round((sum / data.fileSize) * 100);
      return {
        sum,
        speed,
        time,
        progress,
      };
    },
    [DL_STATE.APPENDING]: () => ({
      ...FinalState,
      progress: download.appendProgress,
    }),
    [DL_STATE.PAUSED]: () => {
      const sum = getSum();
      return {
        ...InitialState,
        sum,
        progress: data.fileSize === 0 ? 1 : Math.round((sum / data.fileSize) * 100),
      };
    },
    [DL_STATE.FINISHED]: () => ({ ...FinalState }),
  };

  const ButtonCallback = {
    [DL_STATE.IDLE]: download.start,
    [DL_STATE.STARTED]: download.pause,
    [DL_STATE.PAUSED]: download.start,
    [DL_STATE.FINISHED]: () => openFile(),
    [DL_STATE.APPENDING]: () => {},
  };

  const ButtonIcon = {
    [DL_STATE.IDLE]: <DownloadIcon />,
    [DL_STATE.STARTED]: <PauseIcon />,
    [DL_STATE.PAUSED]: <DownloadIcon />,
    [DL_STATE.APPENDING]: <CrossIcon />,
    [DL_STATE.FINISHED]: <FileOpenIcon />,
  };

  const selectFolder = () => {
    ipcRenderer
      .invoke("/main/window/folder/select", path.join(data.savedFolder, data.fileName))
      .then((selectedFolder) => {
        setData((prev) => ({
          ...prev,
          savedFolder: path.dirname(selectedFolder),
          fileName: path.basename(selectedFolder),
        }));
      });
  };

  const openFile = () => {
    ipcRenderer.invoke("/main/window/open/file", path.join(data.savedFolder, data.fileName));
    window.parent.close();
  };

  const renderDownloadProgress = () => {
    const { progress, speed, sum, time } = DownloadState[download.state]();

    return (
      <div className="fragment">
        <div className="download-dialog-overall-progress-container">
          <DownloadSpeed sum={sum} downloadSpeed={speed} fileSize={data.fileSize} />
          <DownloadTimer time={time} />
        </div>
        <div className="center">
          <ProgressBar height={30} progress={progress} label={ProgressText[download.state]} />
        </div>
        <div className="download-dialog-button-container">
          <IconButton
            disabled={download.state !== DL_STATE.IDLE}
            onClick={selectFolder}
            label={"Browse"}
            icon={<FolderIcon style={{ height: 18, width: 18 }} />}
          />
          <IconButton
            onClick={ButtonCallback[download.state]}
            label={StatusText[download.state]}
            icon={ButtonIcon[download.state]}
            disabled={download.state === DL_STATE.APPENDING}
          />
          <IconButton
            disabled={download.state !== DL_STATE.IDLE}
            onClick={() => window.parent.close()}
            label={"Cancel"}
            icon={<CrossIcon style={{ height: 18, width: 18 }} />}
          />
        </div>
      </div>
    );
  };

  const renderThreadProgress = (downloadProgress: { [key: number]: Progress }) => (
    <details open={isOpen} onClick={toggleDetail}>
      <summary>Parts </summary>
      {Object.entries(downloadProgress).map(([key, progress]) => (
        <div style={{ margin: 5 }} key={key}>
          <ProgressBar style={{ width: "100%" }} height={18} progress={progress.percentage} />
        </div>
      ))}
    </details>
  );

  const renderFileName = () => <h2 className="download-dialog-filename">{data.fileName}</h2>;

  return (
    <GradientBorderContainer>
      <TitlebarContainer platform={process.platform}>
        <TitlebarMinimizeBtn onClick={minimize} />
        <TitlebarMaximizeBtn isMaximized={isMaximized} onClick={maximize} />
        <TitlebarCloseBtn onClick={window.parent.close} />
      </TitlebarContainer>
      <div className="download-dialog-container">
        <div className="download-dialog-progress-container">
          {renderFileName()}
          {renderDownloadProgress()}
        </div>
      </div>
      <a href={data.url} download={data.fileName} hidden={true} id="download"></a>
    </GradientBorderContainer>
  );
}

render(<App />, document.getElementById("root") as any);
