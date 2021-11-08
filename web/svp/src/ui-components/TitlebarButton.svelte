<script lang="ts">
  export let hoverColor: string = 'hsla(0, 0%, 0%, 0.1);';
  export let handleClick: () => void = () => {};
</script>

<button
  class="titlebar-btn"
  style="--hover-color: {hoverColor}"
  on:click={handleClick}
>
  <slot />
</button>

<style>
  .titlebar-btn {
    border: none;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    height: 24px;
    width: 48px;
    cursor: pointer;
    z-index: var(--zTop);
  }
  .titlebar-btn:hover {
    background: var(--hover-color);
  }
  .titlebar-btn:focus {
    border: none;
    outline: none;
  }
</style>
