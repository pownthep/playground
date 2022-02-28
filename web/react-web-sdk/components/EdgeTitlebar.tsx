import React, { memo } from "react";

export default memo(function EdgeTitlebar() {
  return (
    <div data-tauri-drag-region className="titlebar">
      <div className="titlebar-button" id="titlebar-minimize">
        <svg
          version="1.1"
          aria-hidden="true"
          width="10"
          height="10"
          fill="#fff"
        >
          <path d="M 0,5 10,5 10,6 0,6 Z" />
        </svg>
      </div>
      <div className="titlebar-button" id="titlebar-maximize">
        {true ? (
          <svg
            version="1.1"
            aria-hidden="true"
            width="10"
            height="10"
            fill="#fff"
          >
            <path d="m 2,1e-5 0,2 -2,0 0,8 8,0 0,-2 2,0 0,-8 z m 1,1 6,0 0,6 -1,0 0,-5 -5,0 z m -2,2 6,0 0,6 -6,0 z" />
          </svg>
        ) : (
          <svg
            version="1.1"
            aria-hidden="true"
            width="10"
            height="10"
            fill="#fff"
          >
            <path d="M 0,0 0,10 10,10 10,0 Z M 1,1 9,1 9,9 1,9 Z" />
          </svg>
        )}
      </div>
      <div className="titlebar-button" id="titlebar-close">
        <svg
          aria-hidden="true"
          version="1.1"
          width="10"
          height="10"
          fill="#fff"
        >
          <path d="M 0,0 0,0.7 4.3,5 0,9.3 0,10 0.7,10 5,5.7 9.3,10 10,10 10,9.3 5.7,5 10,0.7 10,0 9.3,0 5,4.3 0.7,0 Z" />
        </svg>
      </div>
    </div>
  );
});
