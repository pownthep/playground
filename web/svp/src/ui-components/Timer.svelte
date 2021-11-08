<script lang="ts">
  import { toHHMMSS } from '../utils/time';
  import Label from './Label.svelte';

  export let time: number;

  // your script goes here
</script>

<Label msg={toHHMMSS(time)} />
