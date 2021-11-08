<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  export let duration: number = 2000;
  export let setIsActive: (isActive: boolean) => void;
  let timeoutID: number;

  onMount(() => {
    document.addEventListener('mousemove', resetTimer, false);
    document.addEventListener('mousedown', resetTimer, false);
    document.addEventListener('keypress', resetTimer, false);
    document.addEventListener('DOMMouseScroll', resetTimer, false);
    document.addEventListener('mousewheel', resetTimer, false);
    document.addEventListener('touchmove', resetTimer, false);
    document.addEventListener('MSPointerMove', resetTimer, false);

    startTimer();
  });

  onDestroy(() => {
    document.removeEventListener('mousemove', resetTimer, false);
    document.removeEventListener('mousedown', resetTimer, false);
    document.removeEventListener('keypress', resetTimer, false);
    document.removeEventListener('DOMMouseScroll', resetTimer, false);
    document.removeEventListener('mousewheel', resetTimer, false);
    document.removeEventListener('touchmove', resetTimer, false);
    document.removeEventListener('MSPointerMove', resetTimer, false);
  });

  function startTimer() {
    timeoutID = window.setTimeout(goInactive, duration);
  }

  function resetTimer(e) {
    window.clearTimeout(timeoutID);
    goActive();
  }

  function goInactive() {
    setIsActive(false);
  }

  function goActive() {
    setIsActive(true);
    startTimer();
  }
</script>

<div class="hidden" />

<style>
  .hidden {
    display: none;
  }
</style>
