<script lang="ts">
  export let truncate: boolean = false;
  export let msg: string = '';
</script>

<div class="default {truncate ? 'truncate' : ''}">
  {msg}
</div>

<style>
  .default {
    color: rgb(255, 255, 255);
    text-align: center;
    font-size: 0.8rem;
    line-height: 1.2;
    font-weight: bold;
    margin-left: 1rem;
  }

  .truncate {
    max-width: 20ch;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
