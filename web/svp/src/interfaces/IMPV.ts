import type { Writable } from 'svelte/store';

export interface IMPV {
    pause: Writable<boolean>;
    fullscreen: Writable<boolean>;
    muted: Writable<boolean>;
    pip: Writable<boolean>;
    volume: Writable<number>;
}