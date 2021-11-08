import React, { memo, useCallback } from 'react'
import Typography from '@mui/material/Typography'
import Skeleton from '@mui/material/Skeleton'

type Props = {
  image: string
  name: string
  onClick: (id: string) => void
  id: string
  width: number
  height: number
  showTitle?: boolean
  index: number
}

function Poster({ image, name, onClick, id, width, height, showTitle, index }: Props) {
  const handleClick = useCallback(() => {
    onClick(id)
  }, [id, onClick])

  return (
    <div className={`poster-container`} onClick={handleClick}>
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
        <div className={`poster-overlay`}></div>
        {name && (
          <Typography variant='caption' display='absolute' className='poster-title' noWrap={true}>
            {name}
          </Typography>
        )}
        <div className='poster-chapter'>{id.split('chapter-')[1]}</div>
        <img className='poster-image' src={image} alt={name} />
      </div>
    </div>
  )
}

export default memo(Poster)
