import React, { memo, useMemo } from 'react';
import Stack from '@mui/material/Stack';
import { InputSearch } from '@/components';
import IconGoogleDrive from '@/components/IconGoogleDrive';
import useGoogleDrive from '@/hooks/useGoogleDrive';
import ListDriveItems from '@/components/ListDriveItems';
import { debounce } from 'lodash';

export default memo(function DrivePage() {
  const { drive, setQuery, isLoading } = useGoogleDrive();

  const changeHandler = (v: string) => {
    setQuery(v);
  };

  const debouncedChangeHandler = useMemo(
    () => debounce(changeHandler, 800),
    []
  );

  return (
    <Stack spacing={1}>
      <InputSearch
        onChange={debouncedChangeHandler}
        placeholder='Search Google Drive'
        icon={<IconGoogleDrive />}
        path='/torrent'
        isLoading={isLoading}
      />
      {drive && (
        <ListDriveItems
          driveItems={drive}
        />
      )}
    </Stack>
  );
});
