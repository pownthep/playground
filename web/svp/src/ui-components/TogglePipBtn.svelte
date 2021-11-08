<script lang="ts">
  import IconButton from './IconButton.svelte';
  import PipIcon from '../assets/picture_in_picture_white_24dp.svelte';

  export let isPip: boolean, togglePip: (flag: boolean) => void;

  const onClick = () => togglePip(isPip);
  $: tooltip = isPip ? 'Exit (p)' : 'PiP (p)';
</script>

<IconButton {onClick} {tooltip}>
  <!-- <img src={PipIcon} alt={tooltip} /> -->
  <PipIcon />
</IconButton>
