import React from "react";
import Paper from "@mui/material/Paper";

interface Props {
  platform: NodeJS.Platform;
  children: JSX.Element;
}

export default function Container({ children, platform }: Props) {
  return (
    <Paper
      sx={{
        width: "100%",
        height: `calc(100vh - ${platform === "win32" ? "28px" : "24px"})`,
        overflow: "auto",
      }}
      elevation={0}
    >
      {children}
    </Paper>
  );
}
