import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { showsState } from '../store';
import { getCatalogue } from '../api';

const useShows = () => {
  const [shows, setShows] = useRecoilState(showsState);
  useEffect(() => {
    getCatalogue()
      .then((data) => setShows(data))
      .catch();
    return () => {};
  }, []);
  return shows;
};

export default useShows;
