<script lang="ts">
  import CloseBtn from './CloseBtn.svelte';
  import HideBtn from './HideBtn.svelte';
  import MaxMinBtn from './MaxMinBtn.svelte';
  import Titlebar from './Titlebar.svelte';

  export let fullscreen: boolean;
  export let pip: boolean;

  // your script goes here
</script>

{#if !fullscreen}
  <Titlebar>
    {#if !pip}
      <HideBtn />
      <MaxMinBtn />
      <CloseBtn />
    {/if}
  </Titlebar>
{/if}
