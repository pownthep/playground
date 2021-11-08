import { h } from "preact";
import "./index.scss";
import prettyBytes from "pretty-bytes";
import { SpeedIcon } from "../Icons";

/** @jsx h */

export function DownloadSpeed({
  downloadSpeed,
  sum,
  fileSize,
}: {
  downloadSpeed: number;
  sum: number;
  fileSize: number;
}) {
  return (
    <div className="download-speed-container">
      <div className="total-downloaded">
        {prettyBytes(sum)} / {prettyBytes(fileSize)}
      </div>
      <SpeedIcon />
      <div className="download-speed">{prettyBytes(downloadSpeed) + " / s"}</div>
    </div>
  );
}
