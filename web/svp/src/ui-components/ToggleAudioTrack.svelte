<script lang="ts">
  import AudioIconOn from '../assets/audiotrack_white_24dp.svelte';
  import AudioIconOff from '../assets/music_off_white_24dp.svelte';
  import IconButton from './IconButton.svelte';

  export let toggleAudioTrack: () => void = () => {};
</script>

<IconButton onClick={toggleAudioTrack} tooltip={'Cycle audio'}>
  <AudioIconOn />
</IconButton>
