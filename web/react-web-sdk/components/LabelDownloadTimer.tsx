import { LapTimerIcon } from "@radix-ui/react-icons";
import React from "react";

export default function LabelDownloadTimer({ time }: { time: number }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin: 4,
        columnGap: 4,
        fontSize: 15,
      }}
    >
      <LapTimerIcon style={{ height: 24, width: 24 }} />
      <div style={{ width: 120, textAlign: "center" }}>{msToTime(time)}</div>
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
