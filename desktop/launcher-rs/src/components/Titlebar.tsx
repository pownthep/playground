import React from 'react';
import { appWindow } from '@tauri-apps/api/window';

export default function Titlebar() {
  const maximize = async () =>
    (await appWindow.isMaximized())
      ? appWindow.unmaximize()
      : appWindow.maximize();

  const minimize = () => appWindow.minimize();
  const close = () => appWindow.close();

  return (
    <div data-tauri-drag-region className='titlebar'>
      <div className='titlebar-button' onClick={minimize}>
        <img
          src='https://api.iconify.design/mdi:window-minimize.svg'
          alt='minimize'
        />
      </div>
      <div className='titlebar-button' onClick={maximize}>
        <img
          src='https://api.iconify.design/mdi:window-maximize.svg'
          alt='maximize'
        />
      </div>
      <div className='titlebar-button' id='titlebar-close' onClick={close}>
        <img src='https://api.iconify.design/mdi:close.svg' alt='close' />
      </div>
    </div>
  );
}
