<script lang="ts">
  import SubIconOn from '../assets/subtitles_white_24dp.svelte';
  import IconButton from './IconButton.svelte';

  export let toggleSubtitle: () => void = () => {};
</script>

<IconButton onClick={toggleSubtitle} tooltip={'Cycle subtitle'}>
  <SubIconOn />
</IconButton>
