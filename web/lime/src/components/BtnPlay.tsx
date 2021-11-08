import React, { memo } from 'react';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import PauseRoundedIcon from '@mui/icons-material/PauseRounded';
import IconButton from '@mui/material/IconButton';

type Props = {
  pause: boolean;
  togglePause: () => void;
  size?: number;
  color?: string;
};

function PlayBtn({ pause, togglePause, size, color }: Props) {
  const style = {
    fontSize: size ? size : 'inherit',
    color: color ? color : 'inherit'
  };

  const Button = (pause: boolean) => {
    return pause ? (
      <PlayArrowRoundedIcon style={style} />
    ) : (
      <PauseRoundedIcon style={style} />
    );
  };

  return (
    <IconButton aria-label='toggle pause' onClick={togglePause}>
      {Button(pause)}
    </IconButton>
  );
}
export default memo(PlayBtn);
