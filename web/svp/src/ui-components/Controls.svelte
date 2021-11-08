<div class="controls-container">
  <slot />
</div>

<style>
  .controls-container {
    width: 100%;
    height: var(--controls-height);
    position: fixed;
    bottom: 0px;
    left: 0px;
    z-index: var(--zTop);
    padding-left: 2rem;
    padding-right: 2rem;
    box-sizing: border-box;
  }
</style>
