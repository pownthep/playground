<script lang="ts">
  import { onDestroy, onMount } from 'svelte';

  interface Time {
    hh: string;
    mm: string;
    ss: string;
  }

  // Props
  export let max: number,
    currentTime: number,
    progress: number = undefined,
    hideHoverTime: boolean = false,
    offset: number = 0,
    secondsPrefix: string = '',
    minutesPrefix: string = '',
    hideSeekTimes: boolean = false,
    limitTimeTooltipBySides: boolean = false,
    onChange: (currentTime) => void;

  // State
  let ready: boolean = false,
    trackWidth: number = 0,
    seekHoverPosition: number = 0,
    seeking: boolean,
    mobileSeeking: boolean;

  // Refs
  let track: HTMLDivElement;
  let hoverTime: HTMLDivElement;

  onMount(() => {
    setTrackWidthState();
    window.addEventListener('resize', setTrackWidthState);
    window.addEventListener('mousemove', handleSeeking);
    window.addEventListener('mouseup', mouseSeekingHandler);
    window.addEventListener('touchmove', handleTouchSeeking);
    window.addEventListener('touchend', mobileTouchSeekingHandler);
  });

  onDestroy(() => {
    window.removeEventListener('resize', setTrackWidthState);
    window.removeEventListener('mousemove', handleSeeking);
    window.removeEventListener('mouseup', mouseSeekingHandler);
    window.removeEventListener('touchmove', handleTouchSeeking);
    window.removeEventListener('touchend', mobileTouchSeekingHandler);
  });

  function handleTouchSeeking(event): void {
    let pageX: number = 0;

    for (let i = 0; i < event.changedTouches.length; i++) {
      pageX = event.changedTouches[i].pageX;
    }

    pageX = pageX < 0 ? 0 : pageX;

    if (mobileSeeking) {
      changeCurrentTimePosition(pageX);
    }
  }

  function handleSeeking(event: MouseEvent): void {
    if (seeking) {
      changeCurrentTimePosition(event.pageX);
    }
  }

  function changeCurrentTimePosition(pageX: number): void {
    if (!track) return;
    let position: number = pageX - track.getBoundingClientRect().left;
    position = position < 0 ? 0 : position;
    position = position > trackWidth ? trackWidth : position;

    seekHoverPosition = position;

    let percent: number = (position * 100) / trackWidth;
    let time: number = +(percent * (max / 100)).toFixed(0);

    onChange(time);
  }

  function setTrackWidthState(): void {
    if (track) {
      trackWidth = track.offsetWidth;
    }
  }

  function handleTrackHover(clear: boolean, e): void {
    let position: number = e.pageX - track.getBoundingClientRect().left;

    if (clear) {
      position = 0;
    }

    seekHoverPosition = position;
  }

  function getPositionStyle(time: number): string {
    let position: number = (time * 100) / max;

    return `transform: scaleX(${position / 100});`;
  }

  function getThumbHandlerPosition(currentTimePos: number): string {
    let position: number = trackWidth / (max / currentTimePos);

    return `transform: translateX(${position}px);`;
  }

  function getSeekHoverPosition(currentSeekHoverPosition: number): string {
    let position: number = (currentSeekHoverPosition * 100) / trackWidth;

    return `transform: scaleX(${position / 100});`;
  }

  function getHoverTimePosition(currentSeekHoverPosition: number): string {
    let position: number = 0;

    if (hoverTime) {
      position = currentSeekHoverPosition - hoverTime.offsetWidth / 2;

      if (limitTimeTooltipBySides) {
        if (position < 0) {
          position = 0;
        } else if (position + hoverTime.offsetWidth > trackWidth) {
          position = trackWidth - hoverTime.offsetWidth;
        }
      }
    }

    return `transform: translateX(${position}px);`;
  }

  function secondsToTime(seconds: number): Time {
    seconds = Math.round(seconds + offset);

    let hours: number = Math.floor(seconds / 3600);
    let divirsForMinutes: number = seconds % 3600;
    let minutes: number = Math.floor(divirsForMinutes / 60);
    let sec: number = Math.ceil(divirsForMinutes % 60);

    return {
      hh: hours.toString(),
      mm: minutes < 10 ? '0' + minutes : minutes.toString(),
      ss: sec < 10 ? '0' + sec : sec.toString()
    };
  }

  function getHoverTime(currentSeekHoverPosition: number): string {
    let percent: number = (currentSeekHoverPosition * 100) / trackWidth;
    let time: number = Math.floor(+(percent * (max / 100)));
    let times: Time = secondsToTime(time);

    if (max + offset < 60) {
      return secondsPrefix + times.ss;
    } else if (max + offset < 3600) {
      return minutesPrefix + times.mm + ':' + times.ss;
    } else {
      return times.hh + ':' + times.mm + ':' + times.ss;
    }
  }

  function mouseSeekingHandler(event: MouseEvent): void {
    setSeeking(false, event);
  }

  function setSeeking(state: boolean, event: MouseEvent): void {
    event.preventDefault();

    handleSeeking(event);
    seeking = state;

    seekHoverPosition = !state ? 0 : seekHoverPosition;
  }

  function mobileTouchSeekingHandler(): void {
    setMobileSeeking(false);
  }

  function setMobileSeeking(state: boolean): void {
    mobileSeeking = state;
    seekHoverPosition = !state ? 0 : seekHoverPosition;
  }

  $: isThumbActive = seekHoverPosition > 0 || seeking;
  $: hoverTimePosition = getHoverTimePosition(seekHoverPosition);
  $: hoverTimeFormat = getHoverTime(seekHoverPosition);
  // $: thumbHandlerPosition = getThumbHandlerPosition(currentTime);
  $: bufferedPosition = getPositionStyle(progress ?? currentTime);
  $: seekPosition = getSeekHoverPosition(seekHoverPosition);
  $: connectPosition = getPositionStyle(currentTime);
</script>

<div class="ui-video-seek-slider">
  <div
    class={isThumbActive ? 'track active' : 'track'}
    bind:this={track}
    on:mousemove={(e) => handleTrackHover(false, e)}
    on:mouseleave={(e) => handleTrackHover(true, e)}
    on:mousedown={(e) => setSeeking(true, e)}
    on:touchstart={() => setMobileSeeking(true)}
  >
    <div class="main">
      <div class="buffered" style={bufferedPosition} />
      <div class="seek-hover" style={seekPosition} />
      <div class="connect" style={connectPosition} />
    </div>
  </div>

  {#if !hideHoverTime}
    <div
      bind:this={hoverTime}
      class={isThumbActive ? 'hover-time active' : 'hover-time'}
      style={hoverTimePosition}
    >
      {hoverTimeFormat}
    </div>
  {/if}

  <!-- <div
    class={isThumbActive ? 'thumb active' : 'thumb'}
    style={thumbHandlerPosition}
  >
    <div class="handler" />
  </div> -->
</div>

<style>
  .ui-video-seek-slider {
    position: relative;
  }
  .ui-video-seek-slider:focus {
    outline: none;
  }
  .track {
    padding: 10px 0;
    cursor: pointer;
    outline: none;
  }
  .track:focus {
    border: 0;
    outline: none;
  }
  .main {
    width: 100%;
    height: 4px;
    background-color: rgba(255, 255, 255, 0.2);
    position: absolute;
    left: 0;
    top: 8.5px;
    overflow: hidden;
    transition: transform 0.4s;
    outline: none;
    border-radius: 120px;
  }
  .main:focus {
    border: 0;
    outline: none;
  }
  .buffered {
    position: absolute;
    background-color: rgba(255, 255, 255, 0.3);
    width: 100%;
    height: 100%;
    transform: scaleX(0.8);
    z-index: 2;
    transform-origin: 0 0;
    transition: 0.5s transform;
    border-radius: 120px;
  }
  .seek-hover {
    position: absolute;
    background-color: rgba(255, 255, 255, 0.5);
    width: 100%;
    height: 100%;
    z-index: 1;
    transform: scaleX(0.6);
    transform-origin: 0 0;
    opacity: 0;
    transition: opacity 0.4s;
    border-radius: 120px;
  }
  .connect {
    position: absolute;
    background-color: white;
    width: 100%;
    height: 100%;
    z-index: 3;
    left: 0;
    transform: scaleX(0.13);
    transform-origin: 0 0;
    border-radius: 120px;
  }
  .track.active .main {
    /* transform: scaleY(2);
    border-radius: 240px; */
  }
  .thumb {
    pointer-events: none;
    position: absolute;
    width: 12px;
    height: 12px;
    left: -6px;
    top: 4px;
    z-index: 4;
    transform: translateX(100px);
  }
  .thumb .handler {
    transition: transform 0.2s;
    border-radius: 100%;
    width: 100%;
    height: 100%;
    background-color: white;
    opacity: 0;
    transform: scale(0.4);
  }
  .thumb.active .handler {
    opacity: 1;
    transform: scale(1);
  }
  .hover-time {
    position: absolute;
    background-color: hsl(0, 0%, 100%);
    line-height: 18px;
    font-size: 14px;
    font-weight: bold;
    color: rgb(32, 32, 32);
    top: -30px;
    left: 0;
    padding: 5px 10px;
    border-radius: 5px;
    opacity: 0;
    transform: translateX(150px);
    pointer-events: none;
  }
  .hover-time.active {
    opacity: 1;
  }
  .ui-video-seek-slider:hover .track .main .seek-hover {
    opacity: 1;
  }
</style>
