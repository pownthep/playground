import React from 'react';
import { useRecoilState } from 'recoil';
import { themeState } from '@/store';
import Brightness4RoundedIcon from '@mui/icons-material/Brightness4Rounded';
import Brightness7RoundedIcon from '@mui/icons-material/Brightness7Rounded';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

function DarkmodeBtn() {
  const [theme, setTheme] = useRecoilState(themeState);

  const Button = () => {
    return theme?.palette?.mode === 'light' ? (
      <Brightness4RoundedIcon />
    ) : (
      <Brightness7RoundedIcon />
    );
  };

  return (
    <ListItem
      style={{ margin: 5, borderRadius: 4, width: 'auto' }}
      button
      onClick={() => {
        setTheme((old: any) => ({
          palette: {
            ...old.palette,
            type: old?.palette?.mode === 'light' ? 'dark' : 'light'
          }
        }));
      }}
    >
      <ListItemIcon>{Button()}</ListItemIcon>
      <ListItemText
        primary={theme?.palette?.mode === 'light' ? 'Dark Mode' : 'Light Mode'}
      />
    </ListItem>
  );
}

export default DarkmodeBtn;
