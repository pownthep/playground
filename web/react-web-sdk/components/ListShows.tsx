import React, { CSSProperties, memo } from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import memoize from "memoize-one";
import { FixedSizeList as List, areEqual } from "react-window";
import { Show } from "../interface";
import { ImagePoster } from ".";
import Paper from "@mui/material/Paper";
import DialogShow from "./DialogShow";

const createShowData = memoize((shows) => ({
  shows,
}));

interface Props {
  shows: Show[];
  highlightId: number;
  setHightlight: (id: number) => void;
  setEpisode: Function;
}

interface RowProps {
  data: {
    shows: Show[];
  };
  index: number;
  style: CSSProperties;
}

export default memo(function ListShows({
  shows,
  highlightId,
  setHightlight,
  setEpisode,
}: Props) {
  const showPerRow = 10;
  const rowCount = Math.ceil(shows.length / showPerRow);
  const showsData = createShowData(shows);
  let itemWidth = 150;
  let itemHeight = 200;

  const Row = memo(({ data, index, style }: RowProps) => {
    // Data passed to List as "itemData" is available as props.data
    const { shows } = data;
    let start = index * showPerRow;
    let end = start + showPerRow;
    let currentShows = shows.slice(start, end);

    return (
      <div style={style}>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            columnGap: "10px",
          }}
        >
          {currentShows.map(({ id, name, poster }, index) => (
            <ImagePoster
              highlightId={highlightId}
              setHighlight={setHightlight}
              width={itemWidth}
              height={itemHeight}
              image={poster}
              name={name}
              onClick={handleClickOpen}
              id={id}
              key={id}
              index={index}
            />
          ))}
        </div>
      </div>
    );
  }, areEqual);

  const [open, setOpen] = React.useState(false);
  const [showId, setShowId] = React.useState(-1);

  const handleClickOpen = (id: number) => {
    setShowId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setShowId(-1);
  };

  return (
    <Paper
      sx={{
        width: "100%",
        height: `calc(100vh - 190px)`,
        marginTop: 12,
        bgcolor: "background.paper",
        padding: "10px",
        borderRadius: "15px",
      }}
      elevation={1}
    >
      <AutoSizer>
        {({ height, width }) => {
          itemWidth = (width - 10 * (showPerRow - 1)) / showPerRow;
          itemHeight = itemWidth * 1.5;
          return (
            <List
              height={height}
              itemCount={rowCount}
              itemData={showsData}
              itemSize={itemHeight + 10}
              width={width}
            >
              {Row}
            </List>
          );
        }}
      </AutoSizer>
      <DialogShow
        open={open}
        onClose={handleClose}
        show={shows.find(({ id }) => id === showId)}
        setEpisode={setEpisode}
      />
    </Paper>
  );
});
