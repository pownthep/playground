<div class="titlebar" />
<div class="title-btn-container">
  <slot />
</div>

<style>
  .titlebar {
    position: fixed;
    width: calc(100% - 144px);
    top: 0px;
    left: 0px;
    height: 24px;
    background: rgba(0, 0, 0, 0);
    -webkit-app-region: drag;
    z-index: var(--zTop);
    cursor: move;
  }
  .title-btn-container {
    position: fixed;
    width: 144px;
    top: 0px;
    left: calc(100% - 144px);
    height: 24px;
    z-index: var(--zTop);
    cursor: move;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
