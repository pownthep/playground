<script lang="ts">
  import IconButton from './IconButton.svelte';
  import PlayIcon from '../assets/play_arrow_white_24dp.svelte';
  import PauseIcon from '../assets/pause_white_24dp.svelte';

  export let pause: boolean;
  export let emitPause: (isPause) => void;
  const onClick = () => {
    emitPause(!pause);
  };

  $: tooltip = pause ? 'Play (Spacebar)' : 'Pause (Spacebar)';
  // $: Icon = pause ? PlayIcon : PauseIcon;
</script>

<IconButton {onClick} {tooltip}>
  <!-- <img src={icon} alt={tooltip} /> -->
  {#if pause}
    <PlayIcon />
  {:else}
    <PauseIcon />
  {/if}
</IconButton>
