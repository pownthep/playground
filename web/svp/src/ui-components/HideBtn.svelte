<script lang="ts">
  import TitlebarButton from './TitlebarButton.svelte';
  import HideIcon from '../assets/hide.svelte';
  // import IPCClient from '@pownthep/pubsub/src/electron/window';
  const handleClick = () => {};
</script>

<TitlebarButton {handleClick} hoverColor="grey">
  <!-- <img src={hideIcon} alt="hide" height="12" width="12" /> -->
  <HideIcon />
</TitlebarButton>
