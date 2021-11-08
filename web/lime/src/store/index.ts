import { PlayerState } from '@/components/ContainerVideoPlayer';
import { atom } from 'recoil';
import { DriveInfo, Show } from '@/interface';
import { ThemeOptions } from '@mui/material';
import { recoilPersist } from 'recoil-persist'

const { persistAtom } = recoilPersist()

export const showsState = atom<Show[]>({
  key: 'showsState',
  default: [],
});

export const playerState = atom<PlayerState>({
  key: 'playerState',
  default: {
    showTitle: '',
    episodeTitle: '',
    fullscreen: false,
    episodeId: '',
    timePos: 0,
    episodeSize: 0,
  },
});

export const themeState = atom<ThemeOptions>({
  key: 'themeState',
  default: {
    palette: {
      mode: 'dark'
    }
  },
});

export const navState = atom({
  key: 'navState',
  default: '',
});

export const playerNode = atom({
  key: 'miniplayer',
  default: null,
});

export const servicePort = atom({
  key: 'servicePort',
  default: 8000,
});

export const searchValueState = atom<string>({
  key: 'searchValue',
  default: '',
});

export const highlightedItem = atom<number | null>({
  key: 'highlightedItem',
  default: null,
});

export const driveState = atom<DriveInfo[]>({
  key: 'driveItems',
  default: [],
});

export const googleOAuthRefreshToken = atom<string>({
  key: 'googleOAuthRefreshToken',
  default: '',
  effects_UNSTABLE: [persistAtom]
});
