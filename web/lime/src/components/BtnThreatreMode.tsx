import React, { memo } from 'react';
import IconButton from '@mui/material/IconButton';
import PictureInPictureAltRoundedIcon from '@mui/icons-material/PictureInPictureAltRounded';

type Props = {
  toggleThreatreMode: () => void;
  color?: string;
};

function ThreatreModeBtn({ toggleThreatreMode, color }: Props) {
  const handleClick = () => toggleThreatreMode();

  const style = { color: color ? color : 'inherit' };

  const Button = () => {
    return <PictureInPictureAltRoundedIcon style={style} />;
  };

  return (
    <div>
      <IconButton aria-label='toggle threatre mode' onClick={handleClick}>
        {Button()}
      </IconButton>
    </div>
  );
}

export default memo(ThreatreModeBtn);
