import React, { memo, useCallback, useMemo, useState } from 'react';
import { useRecoilState } from 'recoil';
import { highlightedItem } from '@/store';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';

type Props = {
  image: string;
  name: string;
  onClick: (id: number) => void;
  id: number;
  width: number;
  height: number;
  showTitle?: boolean;
  index: number;
};

function Poster({
  image,
  name,
  onClick,
  id,
  width,
  height,
  showTitle,
  index
}: Props) {
  const handleClick = useCallback(() => {
    onClick(id);
    setId(null);
  }, [id]);
  const [highlightId, setId] = useRecoilState(highlightedItem);

  return (
    <div
      className={`poster-container`}
      onClick={handleClick}
      onMouseEnter={() => setId(id)}
      onMouseLeave={() => setId(null)}
    >
      <div
        style={{
          width: `${width}px`,
          height: `${height}px`,
          cursor: 'pointer',
          overflow: 'hidden'
        }}
      >
        <Skeleton
          variant='rectangular'
          sx={{
            position: 'absolute',
            width: '100%',
            height: 'inherit'
          }}
        />
        <div
          className={`poster-overlay ${
            highlightId && highlightId !== id && 'poster-overlay-hover'
          }`}
        ></div>
        {(showTitle || highlightId === id) && (
          <Typography
            variant='caption'
            display='absolute'
            className='poster-title'
          >
            {name}
          </Typography>
        )}
        <img className='poster-image' src={image} alt={name} />
      </div>
    </div>
  );
}

export default memo(Poster);
