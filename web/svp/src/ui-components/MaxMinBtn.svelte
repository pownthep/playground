<script lang="ts">
  import TitlebarButton from './TitlebarButton.svelte';
  import MaximizeIcon from '../assets/maximize.svelte';
  import MinimizeIcon from '../assets/minimize.svelte';

  let isMaximize: boolean = false;

  async function onClick() {
    isMaximize = !isMaximize;
  }
</script>

<TitlebarButton handleClick={onClick} hoverColor="grey">
  {#if isMaximize}
    <MinimizeIcon />
  {:else}
    <MaximizeIcon />
  {/if}
</TitlebarButton>
