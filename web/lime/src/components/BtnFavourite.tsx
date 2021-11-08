import React, { memo, useCallback } from 'react';
import IconButton from '@mui/material/IconButton';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';

type Props = {
  favourited: boolean;
  addToFavourites: () => void;
};

function FavouriteBtn({ favourited, addToFavourites }: Props) {
  const handleClick = useCallback(() => {
    () => addToFavourites();
  }, []);

  const Button = (favourited: boolean) => {
    return favourited ? <FavoriteRoundedIcon /> : <FavoriteBorderRoundedIcon />;
  };

  return (
    <IconButton aria-label='Add to favourites' onClick={handleClick}>
      {Button(favourited)}
    </IconButton>
  );
}

export default memo(FavouriteBtn);
