import "../css/titlebar.css";
import React from "react";
interface Props {
  onClick: () => void;
}

export default function BtnWinMinimize({ onClick }: Props) {
  return (
    <button className="titlebar-btn titlebar-btn-minimize" onClick={onClick}>
      <svg aria-hidden="true" version="1.1" width="10" height="10">
        <path d="M 0,5 10,5 10,6 0,6 Z" />
      </svg>
    </button>
  );
}
