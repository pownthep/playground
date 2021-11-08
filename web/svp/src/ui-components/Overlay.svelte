<script lang="ts">
  export let pause: boolean;
  export let emitPause: (isPause) => void;
  const onClick = () => {
    emitPause(!pause);
  };
</script>

<div on:click={onClick} class="overlay" />

<style>
  .overlay {
    position: fixed;
    z-index: var(--zMid);
    height: 100vh;
    width: 100vw;
    background: var(--overlay-bg);
    top: 0px;
    left: 0px;
  }
</style>
