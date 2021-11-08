import React from "react";
import prettyBytes from "pretty-bytes";
import { ArrowDownIcon, FileIcon } from "@radix-ui/react-icons";

export function LabelDownloadSpeed({
  downloadSpeed,
  sum,
  fileSize,
}: {
  downloadSpeed: number;
  sum: number;
  fileSize: number;
}) {
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
      <div style={{ width: 170, textAlign: "center" }}>
        {prettyBytes(sum)} / {prettyBytes(fileSize)}
      </div>
      <ArrowDownIcon style={{ height: 24, width: 24 }} />
      <div style={{ width: 120, textAlign: "center" }}>{prettyBytes(downloadSpeed) + " / s"}</div>
    </div>
  );
}

export default LabelDownloadSpeed;
