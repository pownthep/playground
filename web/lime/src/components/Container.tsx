import React from 'react';
import { platform } from '@/platform/electron';
import Paper from '@mui/material/Paper';

export default function Container({ children }: any) {
  return (
    <Paper
      sx={{
        width: '100%',
        height: `100vh`,
        overflow: 'auto'
      }}
      elevation={0}
    >
      {children}
    </Paper>
  );
}
