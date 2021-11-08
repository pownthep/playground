import "../css/titlebar.css";
import React from "react";
interface Props {
  onClick: () => void;
  isMaximized: boolean;
}

export default function BtnWinMaximize({ onClick, isMaximized }: Props) {
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
