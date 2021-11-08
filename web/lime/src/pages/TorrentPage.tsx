import React, { memo, useEffect, useMemo, useState } from "react";
import Stack from "@mui/material/Stack";
import { InputSearch } from "@/components";
import IconTorrent from "@/components/IconTorrent";
import { debounce } from "lodash";
import ListTorrent from "@/components/ListTorrent";
import { pubSub } from "@/platform/electron";
// import WSClient from "@pownthep/pubsub/src/ws/client";

export interface TorrentSearchResult {
  title: string;
  magnetUri: string;
  size: string;
  date: string;
  seeds: string;
  leechs: string;
  completed: string;
}

export default memo(function TorrentPage() {
  const [query, setQuery] = useState("");
  const [torrents, setTorrents] = useState<TorrentSearchResult[]>([]);

  const changeHandler = (v: string) => {
    setTorrents([]);
    setQuery(v);
    console.log("Search for torrent: ", v);
  };

  const debouncedChangeHandler = useMemo(() => debounce(changeHandler, 800), []);

  useEffect(() => {
    pubSub<TorrentSearchResult[]>("/background/torrent/search", query).then((results) => {
      console.log(results);
      setTorrents(results);
    });
    return () => {};
  }, [query]);

  return (
    <Stack spacing={1}>
      <InputSearch onChange={debouncedChangeHandler} placeholder="Search Torrent" icon={<IconTorrent />} path="/" />
      <ListTorrent torrents={torrents} />
    </Stack>
  );
});
