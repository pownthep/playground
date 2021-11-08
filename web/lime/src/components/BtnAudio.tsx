import React from 'react';
import IconButton from '@mui/material/IconButton';
import AudiotrackRoundedIcon from '@mui/icons-material/AudiotrackRounded';

type Props = {
  cycleAudioTrack: () => void;
  color?: string;
};

function AudioBtn({ cycleAudioTrack, color }: Props) {
  return (
    <IconButton aria-label='cycle audio track' onClick={cycleAudioTrack}>
      <AudiotrackRoundedIcon style={{ color: color ? color : 'inherit' }} />
    </IconButton>
  );
}

export default React.memo(AudioBtn);
