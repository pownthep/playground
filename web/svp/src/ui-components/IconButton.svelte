<script lang="ts">
  export let onClick: () => void;
  export let tooltip: boolean | string = false;
</script>

<button class="icon-btn" on:click={onClick} data-tooltip={tooltip}>
  <slot />
</button>

<style>
  .icon-btn {
    border: none;
    background: none;
    cursor: pointer;
    font-family: var(--font-family);
    font-weight: 500;
    margin: 0px;
  }

  .icon-btn:focus {
    outline: none;
  }

  [data-tooltip] {
    position: relative;
    z-index: var(--zTop);
    display: block;
  }

  [data-tooltip]:before,
  [data-tooltip]:after {
    visibility: hidden;
    opacity: 0;
    pointer-events: none;
    transition: 0.2s ease-out;
    transform: translate(-50%, 5px);
  }

  [data-tooltip]:before {
    position: absolute;
    bottom: 100%;
    left: 50%;
    border-radius: 5px;
    padding: 5px;
    background-color: rgb(255, 255, 255);
    color: rgb(29, 29, 29);
    content: attr(data-tooltip);
    text-align: center;
    font-size: 0.7rem;
    line-height: 1.2;
    transition: 0.2s ease-out;
    font-weight: bold;
  }

  [data-tooltip]:after {
    position: absolute;
    bottom: 100%;
    left: 50%;
    width: 0;
    content: ' ';
    font-size: 0;
    line-height: 0;
  }

  [data-tooltip]:hover:before,
  [data-tooltip]:hover:after {
    visibility: visible;
    opacity: 1;
    transform: translate(-40%, 0);
  }
  [data-tooltip='false']:hover:before,
  [data-tooltip='false']:hover:after {
    visibility: hidden;
    opacity: 0;
  }
</style>
