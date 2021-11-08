import { useManhwaChapters } from '@/hooks'
import React from 'react'

export default function ListChapters() {
  const currentManhwa = window.location.search.split('url=')[1]
  const { list, loading } = useManhwaChapters(currentManhwa)

  return (
    <div className='chapter-list'>
      {list.map(chapter => (
        <div key={chapter.url} className='chapter-item'>{chapter.title}</div>
      ))}
    </div>
  )
}
