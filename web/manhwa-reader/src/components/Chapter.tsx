import { useManhwaChapters } from '@/hooks'
import React, { memo, useState } from 'react'
import { useLocation } from 'wouter'

export default memo(function Chapter() {
  const params = new URLSearchParams(window.location.search)
  const latestChapter = params.get('latestChapter')
  const manhwa = params.get('manhwa')
  const { list } = useManhwaChapters(manhwa ?? '')

  const [current, setCurrent] = useState(latestChapter ?? '')
  const [, setLocation] = useLocation()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChapter = (e: any) => {
    setLocation(`/chapter?latestChapter=${e.target.value}&manhwa=${manhwa}`)
    setCurrent(e.target.value)
  }

  return (
    <div style={{ marginTop: 0, textAlign: 'center' }}>
      <select
        onChange={handleChapter}
        defaultValue={current}
        style={{
          position: 'fixed',
          bottom: 65,
          zIndex: 10000000,
          right: 10,
          background: '#303030',
          color: '#fff',
          fontSize: '1.2rem',
          padding: 6,
          borderRadius: 4,
          fontWeight: 'bold',
          border: 'none',
          boxShadow: 'rgba(255, 255, 255, 0.08) 0px 4px 12px'
        }}
      >
        {list.map((chapter, index) => {
          return (
            <option key={chapter.url ?? '' + index} value={chapter.url as any}>
              {chapter.title}
            </option>
          )
        })}
      </select>
      <iframe
        title='manhwa18cc'
        src={current}
        sandbox='allow-same-origin'
        style={{
          width: '100%',
          height: 'calc(100vh - 48px)',
          border: 'none',
        }}
      ></iframe>
    </div>
  )
})
