<script lang="ts">
  import MuteIcon from '../assets/volume_mute_white_24dp.svelte';
  import VolumeDownIcon from '../assets/volume_down_white_24dp.svelte';
  import VolumeUpIcon from '../assets/volume_up_white_24dp.svelte';
  import VolumeOffIcon from '../assets/volume_off_white_24dp.svelte';
  import IconButton from './IconButton.svelte';

  export let volume: number,
    isMuted: boolean,
    setVolume: (vol: number) => void,
    setMuted: (muted: boolean) => void;

  function getIcon(currentVolume: number, muted: boolean) {
    if (muted) return VolumeOffIcon;
    if (currentVolume === 0) return MuteIcon;
    if (currentVolume < 40) return VolumeDownIcon;
    else return VolumeUpIcon;
  }

  function handleChange(event: any) {
    event.preventDefault();
    setVolume(Number(event.target.value));
  }

  function toggleMute() {
    setMuted(isMuted);
  }

  // $: icon = getIcon(volume, isMuted);
  $: tooltip = isMuted ? 'Unmute (m)' : 'Mute (m)';
</script>

<div class="volume-ctrl-container">
  <IconButton onClick={toggleMute} {tooltip}>
    <!-- <img src={icon} alt="mute" id="icon" /> -->
    {#if isMuted}
      <VolumeOffIcon />
    {:else if volume === 0}
      <MuteIcon />
    {:else if volume < 40}
      <VolumeDownIcon />
    {:else}
      <VolumeUpIcon />
    {/if}
  </IconButton>
  <input
    type="range"
    min="0"
    max="100"
    step="1"
    value={volume}
    on:change={handleChange}
  />
</div>

<style>
  input[type='range'] {
    -webkit-appearance: none;
    width: 80px;
    border-radius: 1000px;
    transition: width 200ms ease-in-out;
    cursor: pointer;
  }

  input[type='range']:focus {
    outline: none;
  }

  input[type='range']::-webkit-slider-runnable-track {
    background: rgb(255, 255, 255);
    height: 4px;
    border-radius: 1000px;
  }

  input[type='range']::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: 12px;
    width: 12px;
    background: rgb(255, 255, 255);
    margin-top: -4px;
    border-radius: 50%;
  }

  .volume-ctrl-container {
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
