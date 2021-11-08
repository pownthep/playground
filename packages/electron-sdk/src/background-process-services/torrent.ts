import getPort from "get-port";
import WebTorrent from "webtorrent";
import type { Torrent } from "webtorrent";
import Scraper from "../scraper";
import pubSub from "@pownthep/pubsub/src/electron/renderer";

export const Ok = (result: any) => {
  return { isSuccess: true, output: result };
};

export const Err = (err: any) => {
  return { isSuccess: true, output: err };
};

export const startService = () => {
  pubSub.init();
  if (WebTorrent.WEBRTC_SUPPORT) console.log("WebRTC supported");

  const enum CHANNEL {
    ADD = "/background/torrent/add",
    SEARCH = "/background/torrent/search",
    DONE = "/background/torrent/done",
    DOWNLOAD = "/background/torrent/download",
    ERROR = "/background/torrent/error",
  }

  const client = new WebTorrent();
  client.addListener("error", onClientError);
  let server: any;

  pubSub.subscribe(CHANNEL.ADD, ({ output }) => {
    handleAddTorrent(output);
  });
  pubSub.subscribe(CHANNEL.SEARCH, ({ output }) => {
    handleSearchTorrent(output);
  });

  function handleSearchTorrent(q: string) {
    Scraper.search(q)
      .then((results) => {
        pubSub.publish(CHANNEL.SEARCH, Ok(results));
      })
      .catch((err) => pubSub.publish(CHANNEL.SEARCH, Err(err)));
  }

  function handleAddTorrent(torrentId: string) {
    const existingTorrent = client.get(torrentId);
    if (existingTorrent) onAddTorrent(existingTorrent);
    else client.add(torrentId, (torrent) => onAddTorrent(torrent));
  }

  function registerTorrentEvents(torrent: Torrent) {
    torrent.on("done", () => {
      pubSub.publish(CHANNEL.DONE, Ok({ infoHash: torrent.infoHash }));
    });
    torrent.on("download", (byte: number) => {
      pubSub.publish(
        CHANNEL.DOWNLOAD,
        Ok({
          infoHash: torrent.infoHash,
          downloaded: torrent.downloaded,
          speed: torrent.downloadSpeed,
          total: torrent.length,
          timeRemaining: torrent.timeRemaining,
        })
      );
    });
    torrent.on("error", (err) => {
      pubSub.publish(
        CHANNEL.ERROR,
        Err({
          infoHash: torrent.infoHash,
          error: err,
        })
      );
    });
  }

  async function onAddTorrent(torrent: Torrent) {
    try {
      if (server) server.close();
      const files = torrent.files.map((f) => ({
        name: f.name,
        size: f.length,
        infoHash: torrent.infoHash,
      }));
      const port = await getPort({ port: [8000, 8001, 8002, 8003, 8004] });
      server = torrent.createServer();
      server.listen(port);
      pubSub.publish(
        CHANNEL.ADD,
        Ok({
          files,
          infoHash: torrent.infoHash,
          port,
        })
      );
    } catch (err) {
      pubSub.publish(CHANNEL.ADD, Err(err));
    }
  }

  function onClientError(error: any) {
    pubSub.publish(CHANNEL.ERROR, Err(error));
  }
};
