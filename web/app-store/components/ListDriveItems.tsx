import Paper from "@mui/material/Paper";
import React, { CSSProperties, memo } from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import memoize from "memoize-one";
import { FixedSizeList as List, areEqual } from "react-window";
import { DriveInfo } from "../interface";
import { ImagePoster } from ".";

interface Props {
  driveItems: DriveInfo[];
  setEpisode: Function;
  highlightId: number;
  setHightlight: (id: number) => void;
}

interface RowProps {
  data: {
    driveItems: DriveInfo[];
  };
  index: number;
  style: CSSProperties;
}

const createDriveItemsData = memoize((driveItems) => ({
  driveItems,
}));

export default function ListDriveItems({
  driveItems,
  setEpisode,
  highlightId,
  setHightlight,
}: Props) {
  const driveItemsData = createDriveItemsData(driveItems);
  const itemPerRow = 6;
  const rowCount = Math.ceil(driveItems.length / itemPerRow);
  let itemWidth = 150;
  let itemHeight = 200;

  const Row = ({ data, index, style }: RowProps) => {
    const { driveItems } = data;
    let start = index * itemPerRow;
    let end = start + itemPerRow;
    let currentItems = driveItems.slice(start, end);

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
          {currentItems.map(({ id, name, thumbnailLink, size }, index) => (
            <ImagePoster
              width={itemWidth}
              height={itemHeight}
              image={thumbnailLink}
              name={name}
              highlightId={highlightId}
              setHighlight={setHightlight}
              onClick={() =>
                setEpisode({
                  showTitle: "Google Drive",
                  episodeTitle: name,
                  fullscreen: false,
                  episodeId: id,
                  timePos: 0,
                  episodeSize: Number(size),
                })
              }
              id={id as any}
              key={id}
              showTitle={true}
              index={index}
            />
          ))}
        </div>
      </div>
    );
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
          itemWidth = (width - 10 * (itemPerRow - 1)) / itemPerRow;
          itemHeight = (itemWidth / 16) * 9;
          return (
            <List
              height={height}
              itemCount={rowCount}
              itemData={driveItemsData}
              itemSize={itemHeight + 10}
              width={width}
            >
              {Row}
            </List>
          );
        }}
      </AutoSizer>
    </Paper>
  );
}
