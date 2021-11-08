<script lang="ts">
  import TitlebarButton from './TitlebarButton.svelte';
  import CloseIcon from '../assets/close.svelte';

  function closeWindow() {
    window.close();
  }
</script>

<TitlebarButton handleClick={closeWindow} hoverColor="#DC143C">
  <CloseIcon />
</TitlebarButton>
