import { h } from "preact";
import "./index.scss";

/** @jsx h */
interface TitlebarContainerProps {
  children: JSX.Element[];
  platform: NodeJS.Platform;
}

export function TitlebarContainer({ children, platform }: TitlebarContainerProps) {
  return <div className={`titlebar-container titlebar-${platform}`}>{children}</div>;
}

interface TitlebarCloseBtnProps {
  onClick: () => void;
}

export function TitlebarCloseBtn({ onClick }: TitlebarCloseBtnProps) {
  return (
    <button className="titlebar-btn titlebar-btn-close" onClick={onClick}>
      <svg aria-hidden="true" version="1.1" width="10" height="10">
        <path d="M 0,0 0,0.7 4.3,5 0,9.3 0,10 0.7,10 5,5.7 9.3,10 10,10 10,9.3 5.7,5 10,0.7 10,0 9.3,0 5,4.3 0.7,0 Z" />
      </svg>
    </button>
  );
}

interface TitlebarMaximizeBtnProps {
  onClick: () => void;
  isMaximized: boolean;
}

export function TitlebarMaximizeBtn({ onClick, isMaximized }: TitlebarMaximizeBtnProps) {
  return (
    <button className="titlebar-btn titlebar-btn-maximize" onClick={onClick}>
      {isMaximized ? (
        <svg version="1.1" aria-hidden="true" width="10" height="10">
          <path d="m 2,1e-5 0,2 -2,0 0,8 8,0 0,-2 2,0 0,-8 z m 1,1 6,0 0,6 -1,0 0,-5 -5,0 z m -2,2 6,0 0,6 -6,0 z" />
        </svg>
      ) : (
        <svg version="1.1" aria-hidden="true" width="10" height="10">
          <path d="M 0,0 0,10 10,10 10,0 Z M 1,1 9,1 9,9 1,9 Z" />
        </svg>
      )}
    </button>
  );
}

interface TitlebarMinimizeBtnProps {
  onClick: () => void;
}

export function TitlebarMinimizeBtn({ onClick }: TitlebarMinimizeBtnProps) {
  return (
    <button className="titlebar-btn titlebar-btn-minimize" onClick={onClick}>
      <svg aria-hidden="true" version="1.1" width="10" height="10">
        <path d="M 0,5 10,5 10,6 0,6 Z" />
      </svg>
    </button>
  );
}
