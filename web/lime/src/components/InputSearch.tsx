import React, { ChangeEvent, memo, useState } from 'react';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import IconGoogleDrive from './IconGoogleDrive';
import LiveTvRoundedIcon from '@mui/icons-material/LiveTvRounded';
import IconLime from './IconLime';
import { useHistory } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';

interface Props {
  onChange: (v: string) => void;
  placeholder: string;
  icon: any;
  path: string;
  isLoading?: boolean;
}

export default memo(function InputSearch({
  onChange,
  placeholder,
  icon,
  path,
  isLoading
}: Props) {
  const [focused, setFocused] = useState(false);
  const [query, setQuery] = useState<string | null | undefined>('');

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | undefined
  ) => {
    setQuery(e?.target.value);
    onChange(e?.target.value ?? '');
  };

  const handleFocus = () => setFocused(true);
  const handleBlur = () => setFocused(false);
  const handleClear = () => {
    setQuery('');
    onChange('');
  };

  let history = useHistory();

  const handleClick = () => history.push(path);

  return (
    <Paper
      elevation={focused ? 8 : 0}
      sx={{
        p: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        marginTop: '6px',
        transition: 'box-shadow 500ms ease',
        borderRadius: 3
      }}
    >
      <IconButton
        sx={{ p: '10px' }}
        aria-label={placeholder}
        onClick={handleClick}
      >
        {icon}
      </IconButton>
      <InputBase
        sx={{ ml: 1, flex: 1, fontWeight: 450 }}
        placeholder={placeholder}
        inputProps={{ 'aria-label': placeholder }}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleChange}
        value={query}
      />
      {!!query && (
        <IconButton
          sx={{ p: '10px' }}
          aria-label='directions'
          onClick={handleClear}
          disabled={isLoading}
        >
          {isLoading ? (
            <CircularProgress
              size={24}
              thickness={6}
              sx={{
                color: 'white'
              }}
            />
          ) : (
            <ClearRoundedIcon />
          )}
        </IconButton>
      )}
    </Paper>
  );
});
