<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { MPV } from "../enum/Mpv";
  import {
    duration,
    filePath,
    fullscreen,
    muted,
    pause,
    pip,
    seeking,
    time,
    toggleFullscreen,
    togglePipMode,
    tracks,
    volume,
  } from "../stores/player";
  import type { Socket } from "socket.io-client";
  import IPCClient from "@pownthep/pubsub/src/electron/window";

  export const cycleSubtitle = () => _keypress("j"),
    cycleAudioTrack = () => _keypress("#"),
    emitTime = (currentTime: number) => {
      if (socket?.connected) socket.emit("seek", { value: currentTime });
      else setTime(currentTime);
    },
    emitPause = async (isPause: boolean) => {
      if (socket?.connected) socket.emit("togglePause", { value: isPause });
      else setPause(isPause);
    },
    setTime = (currentTime: number) => _property(MPV.TIME_POS, currentTime),
    setPause = (isPause: boolean) => _property(MPV.PAUSE, isPause),
    setVolume = (vol: number) => {
      _property(MPV.VOL, vol);
      volume.set(vol);
    },
    setMuted = (isMuted: boolean) => {
      if (isMuted) _property(MPV.VOL, $volume);
      else _property(MPV.VOL, 0);
      muted.set(!isMuted);
    },
    setFile = (filePath: string) => _loadFile(filePath);

  export let socket: Socket = null;

  let node: any;
  const properties = [MPV.PAUSE, MPV.TIME_POS, MPV.DURATION, MPV.EOF, MPV.ASPECT, MPV.SEEKING];

  onMount(() => {
    document.addEventListener("keydown", _handleKeyDown, false);
  });

  onDestroy(() => {
    document.removeEventListener("keydown", _handleKeyDown, false);
  });

  async function _onReady() {
    properties.forEach(_observe);
    _property("hwdec", "auto");
    _property("pause", $pause);
  }
  function _onPropertyChange(name: string, value: any) {
    switch (name) {
      case MPV.PAUSE:
        if ($pause !== value) pause.set(value);
        break;
      case MPV.TIME_POS:
        time.set(value);
        break;
      case MPV.DURATION:
        duration.set(value);
        emitPause(false);
        break;
      case MPV.EOF:
        _property(MPV.TIME_POS, 0);
        break;
      case MPV.ASPECT:
        IPCClient.publish("window/set-aspect-ratio", value);
        break;
      case MPV.TRACKS:
        tracks.set(value);
        break;
      case MPV.SEEKING:
        seeking.set(value);
        break;
      default:
        console.log(name, value);
        break;
    }
  }

  function _postData(type: string, data: any) {
    if (node) node.postMessage({ type, data });
  }

  function _handleMessage(event: any) {
    const msg = event.data;
    const { type, data } = msg;
    if (type === "property_change") {
      const { name, value } = data;
      _onPropertyChange(name, value);
    } else if (type === "ready") {
      _onReady();
    } else console.log(event);
  }

  function _property(name: string, value: any) {
    _postData("set_property", { name, value });
  }

  function _command(cmd: string, ...args) {
    args = args.map((arg) => arg.toString());
    _postData("command", [cmd].concat(args));
  }

  function _observe(name: string) {
    _postData("observe_property", name);
  }

  function _keypress(key: string) {
    _command("keypress", key);
  }

  async function _loadFile(pathText: string) {
    seeking.set(true);
    filePath.update(() => pathText);
    if (pathText.includes("magnet:?")) {
      // IPCClient.publish('torrent/add', pathText);
      // let videoFileIndex;
      // window.addEventListener('message', async ({ data: { cmd, output } }) => {
      //   if (cmd === 'torrent-add') {
      //     videoFileIndex = output.findIndex(
      //       ({ name }) => name.includes('mp4') || name.includes('mkv')
      //     );
      //     _command('loadfile', ``);
      //     IPCClient.publish('torrent-stream', pathText);
      //   } else if (cmd === 'torrent-stream') {
      //     console.log(`http://localhost:${output}/${videoFileIndex}`);
      //     _command('loadfile', `http://localhost:${output}/${videoFileIndex}`);
      //   }
      // });
    } else _command("loadfile", pathText);
  }

  function _handleKeyDown({ key, ctrlKey }: KeyboardEvent) {
    switch (key) {
      case " ":
        emitPause(!$pause);
        break;
      case "f":
        toggleFullscreen($fullscreen);
        break;
      case "p":
        togglePipMode($pip);
        break;
      case "m":
        setMuted($muted);
        break;
      case "v": {
        if (ctrlKey) {
          navigator.clipboard.readText().then((text) => _loadFile(text));
        }
        break;
      }
      default:
        break;
    }
  }

  $: show = $filePath.length > 0;
</script>

<embed
  bind:this={node}
  type="application/x-mpvjs"
  class="default"
  on:message={_handleMessage}
/>

<style>
  .default {
    display: block;
    width: 100vw;
    height: 100vh;
  }
</style>
