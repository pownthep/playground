import "../css/titlebar.css";
import React from "react";
interface Props {
  onClick: () => void;
}

export default function BtnWinClose({ onClick }: Props) {
  return (
    <button className="titlebar-btn titlebar-btn-close" onClick={onClick}>
      <svg aria-hidden="true" version="1.1" width="10" height="10">
        <path d="M 0,0 0,0.7 4.3,5 0,9.3 0,10 0.7,10 5,5.7 9.3,10 10,10 10,9.3 5.7,5 10,0.7 10,0 9.3,0 5,4.3 0.7,0 Z" />
      </svg>
    </button>
  );
}
