import React, { useEffect, useState } from 'react';
import { getAnilistInfo } from '../api';
import { AnimeMetadata } from '../interface';

const useAnilist = (title: string) => {
  const [mounted, setMounted] = useState(true);
  const [result, setResult] = useState<AnimeMetadata | null>(null);
  useEffect(() => {
    getAnilistInfo(title).then(
      (info) => mounted && setResult(info?.data?.Page?.media?.[0])
    );
    return () => {
      setMounted(false);
    };
  }, [title]);
  return result;
};

export default useAnilist;
