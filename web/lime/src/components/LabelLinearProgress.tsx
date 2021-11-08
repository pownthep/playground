import React, { memo } from 'react';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

type Props = {
  progress: number;
};

function LinearProgressWithLabel({ progress }: Props) {
  return (
    <Box display='flex' alignItems='center'>
      <Box width='100%' mr={1}>
        <LinearProgress variant='determinate' value={progress} />
      </Box>
      <Box minWidth={35}>
        <Typography variant='body2' color='textSecondary'>{`${Math.round(
          progress
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

export default memo(LinearProgressWithLabel);
