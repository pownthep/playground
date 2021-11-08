import React from "react";
import { Paper } from "@mui/material";
import Player, { Props as PlayerProps } from "./VideoPlayer";

interface Props {
  playerProps: PlayerProps;
}

export default function PlayerBar({ playerProps }: Props) {
  return (
    <Paper
      elevation={0}
      sx={{
        position: "fixed",
        bottom: "0px",
        left: "0px",
        height: "90px",
        width: "100%",
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        zIndex: 10000,
        borderRadius: "0px",
      }}
    >
      <Player {...playerProps} />
    </Paper>
  );
}
