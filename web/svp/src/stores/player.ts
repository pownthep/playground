import { writable } from 'svelte/store';

export const pause = writable(true);
export const fullscreen = writable(false);
export const muted = writable(false);
export const pip = writable(false);
export const volume = writable(50);
export const filePath = writable<string>('');
export const time = writable(0);
export const duration = writable<number | null>(null);
export const tracks = writable<any[]>([]);
export const seeking = writable<boolean>(false);

export const toggleFullscreen = (isFullscreen: boolean) => {
  try {
    if (isFullscreen) {
      document?.exitFullscreen();
    } else {
      document?.documentElement?.requestFullscreen();
    }
    fullscreen.set(!isFullscreen);
  } catch (error) {
    console.error(error);
  }
};

export const togglePipMode = (isPip: boolean) => {
  pip.set(!isPip);
};
