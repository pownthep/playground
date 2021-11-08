import { Manhwa } from '@/hooks'
import { Stack, Typography } from '@mui/material'
import React from 'react'
import { useLocation } from 'wouter'
import Button from '@mui/material/Button'
import LoadingButton from '@mui/lab/LoadingButton'

interface Props {
  manhwas: Manhwa[]
  loadMore: () => void
  isLoading?: boolean | null
}
export default function List({ manhwas, loadMore, isLoading }: Props) {
  const [, setLocation] = useLocation()

  const handleClickOpen = (chapterUrl: string, mahwaUrl: string) => {
    setLocation(`/chapter?latestChapter=${chapterUrl}&manhwa=${mahwaUrl}`)
  }

  return (
    <div
      style={{
        width: 'calc(100vw - 20px)',
        height: `calc(100vh - 160px)`,
        margin: '10px',
        overflow: 'auto',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        columnGap: '10px',
        rowGap: '10px',
        boxSizing: 'border-box'
      }}
    >
      {manhwas.map((manhwa, index) => (
        <Stack key={manhwa.img + index}>
          <Typography
            variant='caption'
            noWrap={true}
            sx={{ width: '6rem', background: manhwa.title.toLowerCase().includes('raw') ? '#cc26267e' : '#26cc347f' }}
            align='center'
            fontWeight='bold'
          >
            {manhwa.title.toLowerCase().includes('raw') ? 'RAW' : 'ENG'}
          </Typography>
          <img
            src={manhwa.img}
            alt='thumbnail'
            style={{ width: '6rem', height: '8rem' }}
            onClick={() => {
              handleClickOpen(`${manhwa.baseUrl}${manhwa.latestChapter}`, `${manhwa.baseUrl}${manhwa.manhwaUrl}`)
            }}
          />
          <Typography
            variant='caption'
            noWrap={true}
            sx={{ width: '6rem', background: 'rgba(0,0,0,0.5)' }}
            align='center'
            fontWeight='bold'
          >
            {manhwa.title}
            <br />
            Chapter: {manhwa.latestChapter.split('chapter-')[1]}
          </Typography>
        </Stack>
      ))}
      {typeof isLoading === 'boolean' && (
        <LoadingButton variant='outlined' onClick={loadMore} loading={isLoading}>
          Load more
        </LoadingButton>
      )}
    </div>
  )
}
