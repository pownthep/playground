import React, { memo } from "react";
import VolumeDownRoundedIcon from "@mui/icons-material/VolumeDownRounded";
import VolumeOffRoundedIcon from "@mui/icons-material/VolumeOffRounded";
import VolumeUpRoundedIcon from "@mui/icons-material/VolumeUpRounded";
import IconButton from "@mui/material/IconButton";
import Slider from "@mui/material/Slider";

type Props = {
  value: number;
  onVolumeChanged: (value: number) => void;
  color?: string;
};

function VolumeCtrl({ value, onVolumeChanged, color }: Props) {
  const toggleMute = (e: any) => {
    if (value > 0) onVolumeChanged(0);
    else onVolumeChanged(50);
  };

  const handleSlider = (e: any, value: any) => {
    onVolumeChanged(value);
  };

  const style = {
    color: color ? color : "inherit",
  };

  const button = (value: number) => {
    if (value === 0) return <VolumeOffRoundedIcon style={style} />;
    else if (value > 0 && value < 75)
      return <VolumeDownRoundedIcon style={style} />;
    else return <VolumeUpRoundedIcon style={style} />;
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: 130,
      }}
    >
      <IconButton aria-label="toggle mute" onClick={toggleMute}>
        {button(value)}
      </IconButton>
      <Slider
        value={value}
        onChange={handleSlider}
        aria-labelledby="discrete-slider-custom"
        step={1}
        sx={{
          color: "#fff",
          "& .MuiSlider-track": {
            border: "none",
          },
          "& .MuiSlider-thumb": {
            width: 18,
            height: 18,
            backgroundColor: "#fff",
            "&:before": {
              boxShadow: "0 4px 8px rgba(0,0,0,0.4)",
            },
            "&:hover, &.Mui-focusVisible, &.Mui-active": {
              boxShadow: "none",
            },
          },
        }}
      />
    </div>
  );
}

export default memo(VolumeCtrl);
