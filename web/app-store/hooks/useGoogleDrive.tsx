import { useEffect, useState } from "react";
import { getMyDriveItem, searchDrive } from "../api/google_drive";
import { DriveInfo } from "../interface";
import { recoilPersist } from "recoil-persist";
import { atom, useRecoilState } from "recoil";

const { persistAtom } = recoilPersist();

interface GoogleDriveHook {
  drive: DriveInfo[];
  setQuery: any;
  isLoading: boolean;
}

export interface GoogleOAuthResponse {
  accessToken: string;
  refreshToken?: string;
}

export const googleOAuthRefreshToken = atom<string>({
  key: "googleOAuthRefreshToken",
  default: "",
  effects_UNSTABLE: [persistAtom],
});

const useGoogleDrive = (): GoogleDriveHook => {
  const [drive, setDrive] = useState<DriveInfo[]>([]);
  const [query, setQuery] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [refreshToken, setRefreshToken] = useRecoilState(
    googleOAuthRefreshToken
  );

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

  return { drive, setQuery, isLoading };
};

export default useGoogleDrive;
