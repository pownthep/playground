import React, { FC } from 'react'
import { Link, useLocation } from 'wouter'
import HomeRoundedIcon from '@mui/icons-material/HomeRounded'
import NewReleasesRoundedIcon from '@mui/icons-material/NewReleasesRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import BottomNavigation from '@mui/material/BottomNavigation'
import BottomNavigationAction from '@mui/material/BottomNavigationAction'
import Paper from '@mui/material/Paper'

const Header: FC = () => {
  const [value, setValue] = React.useState('home')
  const [, setLocation] = useLocation()

  return (
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: '56px' }} elevation={3}>
      <BottomNavigation
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue)
        }}
      >
        <BottomNavigationAction label='Home' value='home' icon={<HomeRoundedIcon />} onClick={() => setLocation('/')} />
        <BottomNavigationAction
          label='Latest'
          value='latest'
          icon={<NewReleasesRoundedIcon />}
          onClick={() => setLocation('/latest')}
        />
        <BottomNavigationAction
          label='Search'
          value='search'
          icon={<SearchRoundedIcon />}
          onClick={() => setLocation('/search')}
        />
      </BottomNavigation>
    </Paper>
  )
}

export default Header
