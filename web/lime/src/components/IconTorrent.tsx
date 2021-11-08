import React, { memo } from 'react';
import TorrentIcon from '@/icons/icons8-utorrent-64.png';

export default memo(function IconTorrent() {
  return <img src={TorrentIcon} alt='Torrent icon' width='24' height='24' />;
});
