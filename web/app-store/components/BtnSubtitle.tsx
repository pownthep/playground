import React, { memo } from "react";
import IconButton from "@mui/material/IconButton";
import ClosedCaptionRoundedIcon from "@mui/icons-material/ClosedCaptionRounded";

type Props = {
  onClick: () => void;
  color?: string;
};

function SubtitleBtn({ onClick, color }: Props) {
  return (
    <IconButton aria-label="cycle subtitle track" onClick={onClick}>
      <ClosedCaptionRoundedIcon style={{ color: color ? color : "inherit" }} />
    </IconButton>
  );
}

export default memo(SubtitleBtn);
