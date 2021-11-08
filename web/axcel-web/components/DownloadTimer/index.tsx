import { h } from "preact";
import { TimelapseIcon } from "../Icons";
import "./index.scss";

/** @jsx h */
export function DownloadTimer({ time }: { time: number }) {
  return (
    <div className="download-timer-container">
      <TimelapseIcon />
      <div className="download-timer-label">{msToTime(time)}</div>
    </div>
  );
}

function msToTime(ms: number) {
  if (ms === 0) return "Done";
  let seconds = Math.round(ms / 1000);
  let minutes = Math.round(ms / (1000 * 60));
  let hours = Math.round(ms / (1000 * 60 * 60));
  let days = Math.round(ms / (1000 * 60 * 60 * 24));
  if (seconds < 60) return seconds + " Sec";
  else if (minutes < 60) return minutes + " Min";
  else if (hours < 24) return hours + " Hrs";
  else return days + " Days";
}
