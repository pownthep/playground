import List from '@/components/List'
import { useManhwaList } from '@/hooks'
import React from 'react'

export default function HomePage() {
  const { list, loadMore, loading } = useManhwaList(1, 'trending')

  return <List manhwas={list} loadMore={loadMore} isLoading={loading} />
}
