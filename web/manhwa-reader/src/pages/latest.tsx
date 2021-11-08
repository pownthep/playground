import List from '@/components/List'
import { useManhwaLatest } from '@/hooks'
import React from 'react'

export default function LatestPage() {
  const { list, loadMore, loading } = useManhwaLatest(1)

  return <List manhwas={list} loadMore={loadMore} isLoading={loading} />
}
