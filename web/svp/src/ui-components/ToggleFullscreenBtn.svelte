<script lang="ts">
  import OpenFullscreenIcon from '../assets/open_in_full_white_24dp.svelte';
  import CloseFullscreenIcon from '../assets/close_fullscreen_white_24dp.svelte';
  import IconButton from './IconButton.svelte';

  export let isFullscreen: boolean,
    toggleFullscreen: (fullscreen: boolean) => void;

  const onClick = () => toggleFullscreen(isFullscreen);

  // $: icon = isFullscreen ? CloseFullscreenIcon : OpenFullscreenIcon;
  $: tooltip = isFullscreen ? 'Exit (f)' : 'Fullscreen (f)';
</script>

<IconButton {onClick} {tooltip}>
  <!-- <img src={icon} alt={tooltip} /> -->
  {#if isFullscreen}
    <CloseFullscreenIcon />
  {:else}
    <OpenFullscreenIcon />
  {/if}
</IconButton>
