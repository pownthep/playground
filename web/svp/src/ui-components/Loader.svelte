<script lang="ts">
  import { Pulse } from 'svelte-loading-spinners';
</script>

<div class="loading-container">
  <Pulse size="60" color="#fcba03" unit="px" duration="1s" />
</div>

<style>
  .loading-container {
    position: fixed;
    width: 500px;
    height: 200px;
    top: 50%;
    left: 50%;
    margin-top: -100px; /* Negative half of height. */
    margin-left: -250px; /* Negative half of width. */
    z-index: 10000;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
