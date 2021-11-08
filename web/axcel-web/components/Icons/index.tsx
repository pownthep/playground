import { h } from "preact";

/** @jsx h */

interface IconProps {
  style?: React.CSSProperties;
}

export const DownloadIcon = ({ style }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    enable-background="new 0 0 24 24"
    height="24px"
    viewBox="0 0 24 24"
    width="24px"
    fill="#FFFFFF"
    style={style}
  >
    <g>
      <rect fill="none" height="24" width="24" />
    </g>
    <g>
      <path d="M16.59,9H15V4c0-0.55-0.45-1-1-1h-4C9.45,3,9,3.45,9,4v5H7.41c-0.89,0-1.34,1.08-0.71,1.71l4.59,4.59 c0.39,0.39,1.02,0.39,1.41,0l4.59-4.59C17.92,10.08,17.48,9,16.59,9z M5,19c0,0.55,0.45,1,1,1h12c0.55,0,1-0.45,1-1s-0.45-1-1-1H6 C5.45,18,5,18.45,5,19z" />
    </g>
  </svg>
);

export const TimelapseIcon = ({ style }: IconProps) => (
  <svg style={style} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#FFFFFF">
    <path d="M0 0h24v24H0V0z" fill="none" />
    <path d="M16.24 7.76C15.07 6.59 13.54 6 12 6v6l-4.24 4.24c2.34 2.34 6.14 2.34 8.49 0 2.34-2.34 2.34-6.14-.01-8.48zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
  </svg>
);

export const PauseIcon = ({ style }: IconProps) => (
  <svg style={style} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#FFFFFF">
    <path d="M8 19c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2s-2 .9-2 2v10c0 1.1.9 2 2 2zm6-12v10c0 1.1.9 2 2 2s2-.9 2-2V7c0-1.1-.9-2-2-2s-2 .9-2 2z" />
  </svg>
);

export const CrossIcon = ({ style }: IconProps) => (
  <svg style={style} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#FFFFFF">
    <path d="M0 0h24v24H0V0z" fill="none" />
    <path d="M18.3 5.71c-.39-.39-1.02-.39-1.41 0L12 10.59 7.11 5.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L10.59 12 5.7 16.89c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 13.41l4.89 4.89c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z" />
  </svg>
);

export const FileOpenIcon = ({ style }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    enable-background="new 0 0 24 24"
    height="24px"
    viewBox="0 0 24 24"
    width="24px"
    fill="#FFFFFF"
    style={style}
  >
    <g>
      <rect fill="none" height="24" width="24" />
    </g>
    <g>
      <path d="M13.17,2H6C4.9,2,4,2.9,4,4v16c0,1.1,0.9,2,2,2h9v-6c0-1.1,0.9-2,2-2h3V8.83c0-0.53-0.21-1.04-0.59-1.41l-4.83-4.83 C14.21,2.21,13.7,2,13.17,2z M13,8V3.5L18.5,9H14C13.45,9,13,8.55,13,8z M22.66,17c0,0.55-0.45,1-1,1h-1.24l2.24,2.24 c0.39,0.39,0.39,1.02,0,1.41l0,0c-0.39,0.39-1.02,0.39-1.41,0L19,19.41l0,1.24c0,0.55-0.45,1-1,1c-0.55,0-1-0.45-1-1V17 c0-0.55,0.45-1,1-1h3.66C22.21,16,22.66,16.45,22.66,17z" />
    </g>
  </svg>
);

export const FolderIcon = ({ style }: IconProps) => (
  <svg style={style} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#FFFFFF">
    <path d="M0 0h24v24H0V0z" fill="none" />
    <path d="M10.59 4.59C10.21 4.21 9.7 4 9.17 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-1.41-1.41z" />
  </svg>
);

export const SpeedIcon = ({ style }: IconProps) => (
  <svg style={style} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#FFFFFF">
    <path d="M0 0h24v24H0z" fill="none" />
    <path d="M19.46 10a1 1 0 0 0-.07 1 7.55 7.55 0 0 1 .52 1.81 8 8 0 0 1-.69 4.73 1 1 0 0 1-.89.53H5.68a1 1 0 0 1-.89-.54A8 8 0 0 1 13 6.06a7.69 7.69 0 0 1 2.11.56 1 1 0 0 0 1-.07 1 1 0 0 0-.17-1.76A10 10 0 0 0 3.35 19a2 2 0 0 0 1.72 1h13.85a2 2 0 0 0 1.74-1 10 10 0 0 0 .55-8.89 1 1 0 0 0-1.75-.11z" />
    <path d="M10.59 12.59a2 2 0 0 0 2.83 2.83l5.66-8.49z" />
  </svg>
);
