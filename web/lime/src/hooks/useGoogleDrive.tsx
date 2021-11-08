import { useEffect, useState } from 'react';
import { SetterOrUpdater, useRecoilState } from 'recoil';
import { driveState, googleOAuthRefreshToken } from '@/store';
import { getMyDriveItem, searchDrive } from '@/api';
import { DriveInfo } from '@/interface';

interface GoogleDriveHook {
  drive: DriveInfo[];
  setQuery: any;
  isLoading: boolean;
}

export interface GoogleOAuthResponse {
  accessToken: string;
  refreshToken?: string;
}

const useGoogleDrive = (): GoogleDriveHook => {
  const [drive, setDrive] = useRecoilState(driveState);
  const [query, setQuery] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [refreshToken, setRefreshToken] = useRecoilState(googleOAuthRefreshToken);

  useEffect(() => {
    if (!refreshToken) return;
    setLoading(true);
    if (!!query)
      searchDrive(query, refreshToken).then((items) => {
        setDrive(items);
        setLoading(false);
      });
    else
      getMyDriveItem(refreshToken).then((items) => {
        setDrive(items);
        setLoading(false);
      });
    return () => {};
  }, [query, refreshToken]);

  return { drive, setQuery, isLoading};
};

export default useGoogleDrive;
