<script lang="ts">
  import Player from "./ui-components/Mpv.svelte";
  import Overlay from "./ui-components/Overlay.svelte";
  import Seekbar from "./ui-components/Seekbar.svelte";
  import Controls from "./ui-components/Controls.svelte";
  import ToggleFullscreenBtn from "./ui-components/ToggleFullscreenBtn.svelte";
  import PlayPauseBtn from "./ui-components/PlayPauseBtn.svelte";
  import Idle from "./ui-components/Idle.svelte";
  import { fade } from "svelte/transition";
  import TogglePipBtn from "./ui-components/TogglePipBtn.svelte";
  import VolumeSlider from "./ui-components/VolumeSlider.svelte";
  import Label from "./ui-components/Label.svelte";
  import File from "./ui-components/File.svelte";
  import { io, Socket } from "socket.io-client";
  import ToggleSubtitle from "./ui-components/ToggleSubtitle.svelte";
  import ToggleAudioTrack from "./ui-components/ToggleAudioTrack.svelte";
  import { onMount } from "svelte";
  import AppTitlebar from "./ui-components/AppTitlebar.svelte";
  import Timer from "./ui-components/Timer.svelte";
  import {
    duration,
    fullscreen,
    muted,
    pause,
    pip,
    seeking,
    time,
    toggleFullscreen,
    togglePipMode,
    volume,
  } from "./stores/player";
  import { writable } from "svelte/store";
  import Loader from "./ui-components/Loader.svelte";

  let player: Player;
  let idle: Idle;
  let socket: Socket;
  let isConnected: boolean = false;
  const isActive = writable(false);

  onMount(async () => {
    socket = io("http://pownthep.3bbddns.com:36370");
    socket.on("pause", (isPause: boolean) => {
      player.setPause(isPause);
    });
    socket.on("seek", (timePos: number) => {
      player.setTime(timePos);
    });
    socket.on("connect", () => {
      isConnected = true;
    });
    socket.on("disconnect", () => {
      isConnected = false;
    });
  });
</script>

<main class={$isActive ? "show-pointer" : "hide-pointer"}>
  <!-- <AppTitlebar fullscreen={$fullscreen} pip={$pip} /> -->
  <Player bind:this={player} {socket} />
  {#if $seeking}
    <Loader />
  {/if}
  {#if $isActive && player}
    <div in:fade out:fade>
      <Controls>
        <div class="seekbar-container">
          <Seekbar currentTime={$time} max={$duration} limitTimeTooltipBySides={true} onChange={player.emitTime} />
        </div>
        <div class="controls-btn-container">
          <PlayPauseBtn pause={$pause} emitPause={player.emitPause} />
          <VolumeSlider isMuted={$muted} volume={$volume} setMuted={player.setMuted} setVolume={player.setVolume} />
          <Timer time={$time} />
          <Label msg={isConnected ? "CONNECTED" : "DISCONNECTED"} />
          <div class="space" />
          <ToggleAudioTrack toggleAudioTrack={player.cycleAudioTrack} />
          <ToggleSubtitle toggleSubtitle={player.cycleSubtitle} />
          <File setFile={player.setFile} />
          <TogglePipBtn isPip={$pip} togglePip={togglePipMode} />
          <ToggleFullscreenBtn isFullscreen={$fullscreen} {toggleFullscreen} />
        </div>
      </Controls>
      <!-- <Overlay pause={$pause} emitPause={player.emitPause} /> -->
    </div>
  {/if}
  <Idle duration={1500} bind:this={idle} setIsActive={isActive.set} />
</main>

<style>
  @import url("https://rsms.me/inter/inter.css");

  :root {
    --zTop: 10;
    --zMid: 9;
    --zLow: 8;
    --controls-height: 60px;
    --overlay-bg: linear-gradient(to top, rgb(0, 0, 0, 0.9), rgba(0, 0, 0, 0));
    --font-family: "Inter", sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell,
      "Open Sans", "Helvetica Neue", sans-serif;
    font-size: 16px;
  }

  :global(body) {
    margin: 0px;
    padding: 0px;
    height: 100vh;
    width: 100vw;
    background: transparent;
    font-family: var(--font-family);
  }

  .seekbar-container {
    width: 100%;
    margin: 0 auto;
    z-index: var(--zTop);
  }

  .controls-btn-container {
    width: 100%;
    height: 40px;
    display: flex;
    align-items: center;
    z-index: var(--zTop);
  }

  .hide-pointer {
    cursor: none;
  }

  .show-pointer {
    cursor: default;
  }

  .space {
    margin: 0 auto;
  }
</style>
