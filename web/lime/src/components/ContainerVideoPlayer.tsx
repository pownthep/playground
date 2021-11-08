import React from 'react';
import { Paper } from '@mui/material';
import Player from './VideoPlayer';
import { useRecoilValue } from 'recoil';
import { playerState } from '@/store';
import { useRecoilState } from 'recoil';
import { googleOAuthRefreshToken } from '@/store';

export type PlayerState = {
  showTitle: string;
  episodeTitle: string;
  fullscreen: boolean;
  episodeId: string;
  timePos: number;
  episodeSize: number;
  url?: string;
};

export default function PlayerBar() {
  const state = useRecoilValue<PlayerState | null>(playerState);
  const [refreshToken, setRefreshToken] = useRecoilState(
    googleOAuthRefreshToken
  );

  return (
    <div>
      {state && (
        <Paper
          elevation={0}
          sx={{
            position: 'fixed',
            bottom: '0px',
            left: '0px',
            height: '90px',
            width: '100%',
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            zIndex: 10000,
            borderRadius: '0px'
          }}
        >
          <Player
            showTitle={state.showTitle}
            episodeTitle={state.episodeTitle}
            fullscreen={state.fullscreen}
            episodeId={state.episodeId}
            timePos={state.timePos}
            episodeSize={state.episodeSize}
            url={state.url}
            refreshToken={refreshToken}
          />
        </Paper>
      )}
    </div>
  );
}
