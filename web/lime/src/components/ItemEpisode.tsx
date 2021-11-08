import React, { memo } from 'react';
import { Episode } from '../interface';
import IconButton from '@mui/material/IconButton';
import prettyBytes from 'pretty-bytes';
import CloudDownloadRoundedIcon from '@mui/icons-material/CloudDownloadRounded';
import PlayCircleFilledRoundedIcon from '@mui/icons-material/PlayCircleFilledRounded';
import { getThumbnail, downloadFile } from '../api';
import { useRecoilValue } from 'recoil';
import { playerState } from '@/store';
import { makeStyles } from '@mui/styles';

type Props = {
  episode: Episode;
  onClick: (
    showTitle: string,
    episodeTitle: string,
    episodeId: string,
    timePos: number,
    fullscreen: boolean,
    episodeSize: number
  ) => void;
  showTitle: string;
  index: number;
};

const useStyles = makeStyles((theme: any) => ({
  episode: {
    height: 90,
    width: 'calc(100% - 110px)',
    display: 'grid',
    gridTemplateColumns: '160px 2fr repeat(3, 1fr)',
    '&:hover': {
      background: theme.palette.action.hover
    },
    marginLeft: 60,
    marginRight: 50,
    borderRadius: 8,
    overflow: 'hidden',
    background:
      theme.palette.type === 'light' ? 'white' : 'rgba(255,255,255, 0.02)'
  },
  thumbnail: {
    width: 160,
    height: 90,
    objectFit: 'cover'
  },
  marginAuto: {
    marginRight: 'auto'
  },
  centered: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10
  },
  end: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  start: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: 30,
    paddingRight: 30,
    overflow: 'hidden'
  }
}));

function EpisodeItem({ episode, onClick, showTitle, index }: Props) {
  const classes = useStyles();
  const state = useRecoilValue(playerState);

  return (
    <div
      className={classes.episode}
      style={{
        background:
          state.episodeId === episode.id
            ? 'linear-gradient(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%)'
            : ''
      }}
    >
      {/* <p className={classes.start}>{index}</p> */}
      <img
        src={getThumbnail(episode.id)}
        alt='thumbnail'
        className={classes.thumbnail}
      />
      <h3 className={classes.start}>{episode.name}</h3>
      <h4 className={classes.centered}>{showTitle}</h4>
      <h5 className={classes.centered}>{prettyBytes(Number(episode.size))}</h5>
      <div className={classes.end}>
        <IconButton
          onClick={() =>
            onClick(showTitle, episode.name, episode.id, 0, false, episode.size)
          }
        >
          <PlayCircleFilledRoundedIcon />
        </IconButton>
        <IconButton
          onClick={() => downloadFile(episode.name, episode.size, episode.id)}
        >
          <CloudDownloadRoundedIcon />
        </IconButton>
      </div>
    </div>
  );
}

export default memo(EpisodeItem);
