import React, { memo } from "react";
import IconButton from "@mui/material/IconButton";
import AspectRatioRoundedIcon from "@mui/icons-material/AspectRatioRounded";
import FullscreenExitRoundedIcon from "@mui/icons-material/FullscreenExitRounded";

type Props = {
  fullscreen: boolean;
  onClick: () => void;
  color?: string;
};

function FullscreenBtn({ fullscreen, onClick, color }: Props) {
  const style = { color: color ? color : "inherit" };

  const Button = (fullscreen: boolean) => {
    return fullscreen ? (
      <FullscreenExitRoundedIcon style={style} />
    ) : (
      <AspectRatioRoundedIcon style={style} />
    );
  };

  return (
    <div>
      <IconButton aria-label="toggle fullscreen mode" onClick={onClick}>
        {Button(fullscreen)}
      </IconButton>
    </div>
  );
}

export default memo(FullscreenBtn);
