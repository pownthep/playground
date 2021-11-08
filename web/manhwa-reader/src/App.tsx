import React from 'react'
import { styled } from '@mui/material'
import Header from '@/header'
import { Route } from 'wouter'
import Chapter from '@/components/Chapter'
import HomePage from './pages'
import LatestPage from './pages/latest'
import SearchPage from './pages/search'
import ListChapters from './components/ListChapters'

const App: React.FC = () => {
  return (
    <Root>
      <Header />
      <Route path='/chapter'>
        <Chapter />
      </Route>
      <Route path='/chapters'>
        <ListChapters />
      </Route>
      <Route path='/latest'>
        <LatestPage />
      </Route>
      <Route path='/search'>
        <SearchPage />
      </Route>
      <Route path='/'>
        <HomePage />
      </Route>
    </Root>
  )
}

const Root = styled('div')`
  width: 100%;
  & a {
    text-decoration: none;
    color: ${({ theme: { palette } }) => palette.primary.main};
  }
`

export default App
