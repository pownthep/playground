import Paper from "@mui/material/Paper";
import React, { CSSProperties, memo } from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import memoize from "memoize-one";
import { FixedSizeList as List, areEqual } from "react-window";
import { Episode } from "@/interface";
import { getThumbnail } from "@/api";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import prettyBytes from "pretty-bytes";
import { useRecoilState } from "recoil";
import { playerState } from "@/store";
import Skeleton from "@mui/material/Skeleton";

interface Props {
  episodes: Episode[];
  showTitle: string;
}

interface RowProps {
  data: {
    episodes: Episode[];
    showTitle: string;
    width: number;
  };
  index: number;
  style: CSSProperties;
}

const Row = memo(({ data, index, style }: RowProps) => {
  const { episodes, showTitle, width } = data;
  const thumbnail = getThumbnail(episodes[index].id);
  const name = episodes[index].name;
  const [currentEp, setEpisode] = useRecoilState(playerState);

  return (
    <div
      style={style}
      onClick={() => {
        setEpisode({
          showTitle: showTitle,
          episodeTitle: name,
          fullscreen: false,
          episodeId: episodes[index].id,
          timePos: 0,
          episodeSize: episodes[index].size,
        });
      }}
    >
      <Paper
        sx={{
          borderRadius: "5px",
          overflow: "hidden",
          height: "180px",
          width: "100%",
          background: `url("${getThumbnail(episodes[index].id, width)}")`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          cursor: "pointer",
        }}
        elevation={0}
      >
        <Stack direction="row" spacing={5}>
          <Typography
            variant="subtitle2"
            component="div"
            noWrap={true}
            sx={{
              height: "40px",
              backdropFilter: "blur(8px)",
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "#19223194",
              paddingLeft: "20px",
              paddingRight: "20px",
            }}
          >
            {name}
          </Typography>
        </Stack>
      </Paper>
    </div>
  );
}, areEqual);

const createEpisodesData = memoize((episodes, showTitle, width) => ({
  episodes,
  showTitle,
  width,
}));

export default memo(function ListEpisodes({ episodes, showTitle }: Props) {
  return (
    <Paper
      sx={{
        width: "100%",
        height: `calc(100vh - ${28 + 48}px)`,
        bgcolor: "background.default",
        padding: "10px",
        overflow: "auto",
        borderRadius: "0px",
      }}
      elevation={1}
    >
      <AutoSizer>
        {({ height, width }) => {
          return (
            <List
              height={height}
              itemCount={episodes.length}
              itemData={createEpisodesData(episodes, showTitle, width)}
              itemSize={190}
              width={width}
            >
              {Row}
            </List>
          );
        }}
      </AutoSizer>
    </Paper>
  );
});
