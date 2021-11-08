import List from '@/components/List'
import { useManhwaSearch } from '@/hooks'
import React, { useMemo } from 'react'
import { Stack } from '@mui/material'
import { debounce } from 'lodash'
import TextField from '@mui/material/TextField'

export default function SearchPage() {
  const { list, setQuery } = useManhwaSearch('')

  const changeHandler = (v: string) => {
    console.log('Searching: ', v)
    setQuery(v)
  }

  const debouncedChangeHandler = useMemo(() => debounce(changeHandler, 800), [])

  return (
    <>
      <Stack>
        <TextField
          id='filled-basic'
          label='Search'
          variant='filled'
          onChange={e => debouncedChangeHandler(e.target.value)}
        />
        <List manhwas={list} loadMore={() => {}} isLoading={null} />
      </Stack>
    </>
  )
}
