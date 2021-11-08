import React, { memo } from "react";
import IconButton from "@mui/material/IconButton";
import PictureInPictureAltRoundedIcon from "@mui/icons-material/PictureInPictureAltRounded";

type Props = {
  onClick: () => void;
  color?: string;
};

function ThreatreModeBtn({ onClick, color }: Props) {
  const style = { color: color ? color : "inherit" };

  const Button = () => {
    return <PictureInPictureAltRoundedIcon style={style} />;
  };

  return (
    <div>
      <IconButton aria-label="toggle threatre mode" onClick={onClick}>
        {Button()}
      </IconButton>
    </div>
  );
}

export default memo(ThreatreModeBtn);
