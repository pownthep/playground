import React, { memo } from 'react';
import IconButton from '@mui/material/IconButton';
import ClosedCaptionRoundedIcon from '@mui/icons-material/ClosedCaptionRounded';

type Props = {
  cycleSubtitleTrack: () => void;
  color?: string;
};

function SubtitleBtn({ cycleSubtitleTrack, color }: Props) {
  return (
    <IconButton aria-label='cycle subtitle track' onClick={cycleSubtitleTrack}>
      <ClosedCaptionRoundedIcon style={{ color: color ? color : 'inherit' }} />
    </IconButton>
  );
}

export default memo(SubtitleBtn);
