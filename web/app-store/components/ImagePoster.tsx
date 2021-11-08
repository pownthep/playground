import React from "react";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import "../css/poster-image.css";

type Props = {
  image: string;
  name: string;
  onClick: (id: number) => void;
  id: number;
  width: number;
  height: number;
  showTitle?: boolean;
  index: number;
  setHighlight: Function;
  highlightId: number;
};

function Poster({
  image,
  name,
  onClick,
  id,
  width,
  height,
  showTitle,
  setHighlight,
  highlightId,
}: Props) {
  const handleClick = () => {
    onClick(id);
    setHighlight(null);
  };

  return (
    <div
      className={`poster-container`}
      onClick={handleClick}
      onMouseEnter={() => setHighlight(id)}
      onMouseLeave={() => setHighlight(null)}
    >
      <div
        style={{
          width: `${width}px`,
          height: `${height}px`,
          cursor: "pointer",
          overflow: "hidden",
        }}
      >
        <Skeleton
          variant="rectangular"
          sx={{
            position: "absolute",
            width: "100%",
            height: "inherit",
          }}
        />
        <div
          className={`poster-overlay ${
            highlightId && highlightId !== id && "poster-overlay-hover"
          }`}
        ></div>
        {(showTitle || highlightId === id) && (
          <Typography
            variant="caption"
            display="absolute"
            className="poster-title"
          >
            {name}
          </Typography>
        )}
        <img className="poster-image" src={image} alt={name} />
      </div>
    </div>
  );
}

export default Poster;
