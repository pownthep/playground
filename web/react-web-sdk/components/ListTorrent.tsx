import React, { useState } from "react";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import PlayCircleRoundedIcon from "@mui/icons-material/PlayCircleRounded";
import Grow from "@mui/material/Grow";
import CircularProgress from "@mui/material/CircularProgress";
import MP4Icon from "../icons/icons8-file-47.png";
import MKVIcon from "../icons/icons8-mkv-48.png";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import ArrowDropUpRoundedIcon from "@mui/icons-material/ArrowDropUpRounded";
import ArrowDropDownRoundedIcon from "@mui/icons-material/ArrowDropDownRounded";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { TorrentSearchResult } from "../interface";
import PubSub from "@pownthep/pubsub/lib/electron/window";

interface Props {
  torrents: TorrentSearchResult[];
  setEpisode: Function;
}

interface TorrentFile {
  name: string;
  size: number;
  infoHash: string;
}

interface TorrentAddResponse {
  infoHash: string;
  files: TorrentFile[];
  port: number;
}

export default function ListTorrent({ torrents, setEpisode }: Props) {
  const [selected, setSelected] = useState("");
  const isVideo = ({ name }: TorrentFile) =>
    name.includes("mkv") || name.includes("mp4");

  const handleClick = async (id: string, name: string) => {
    const { infoHash, files, port } = await PubSub.pubSub<TorrentAddResponse>(
      "torrent/add",
      id
    );
    const videoIndex = files.findIndex(isVideo);
    console.log(videoIndex, port);
    if (videoIndex !== -1) {
      setEpisode({
        episodeId: id,
        episodeSize: 1000,
        episodeTitle: name,
        fullscreen: false,
        showTitle: "Streaming Torrent",
        timePos: 0,
        url: `http://localhost:${port}/${videoIndex}`,
      });
      console.log(`http://localhost:${port}/${videoIndex}`);
    }
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
        overflow: "auto",
      }}
      elevation={1}
    >
      {torrents.length > 0 ? (
        <List dense={false}>
          {torrents.map(({ title, magnetUri, size, seeds, leechs }, index) => {
            return (
              <Grow in={true} timeout={300 + 50 * index} key={magnetUri}>
                <ListItem
                  disablePadding
                  sx={{
                    borderRadius: "15px",
                    overflow: "hidden",
                  }}
                >
                  <ListItemButton
                    onClick={() => setSelected(magnetUri)}
                    selected={magnetUri === selected}
                  >
                    <ListItemIcon>
                      <img
                        src={title.includes("mkv") ? MKVIcon : MP4Icon}
                        alt="File Icon"
                        height="24"
                      />
                    </ListItemIcon>
                    <ListItemText primary={title} secondary={size} />
                    <Stack direction="row" spacing={1}>
                      <Chip
                        sx={{ width: "150px" }}
                        size="small"
                        label={"Seeders: " + seeds}
                        color="success"
                        icon={<ArrowDropUpRoundedIcon />}
                      />
                      <Chip
                        sx={{ width: "150px" }}
                        size="small"
                        label={"Leechers: " + leechs}
                        color="error"
                        icon={<ArrowDropDownRoundedIcon />}
                      />
                    </Stack>
                    <Tooltip title="Stream Torrent" placement="top">
                      <IconButton
                        aria-label="play"
                        onClick={() => handleClick(magnetUri, title)}
                      >
                        <PlayCircleRoundedIcon />
                      </IconButton>
                    </Tooltip>
                  </ListItemButton>
                </ListItem>
              </Grow>
            );
          })}
        </List>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "inherit",
            width: "100%",
          }}
        >
          <CircularProgress
            size={24}
            thickness={6}
            sx={{
              color: "white",
            }}
          />
        </div>
      )}
    </Paper>
  );
}
