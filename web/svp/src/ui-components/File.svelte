<script lang="ts">
  import IconButton from './IconButton.svelte';
  import FileIcon from '../assets/folder_open_white_24dp.svelte';
  import { onMount } from 'svelte';

  export let setFile: (filePath: string) => void;
  const tooltip = 'Open media';
  const onClick = () => {
    fileSelector.click();
  };

  let fileSelector: any;

  onMount(() => {
    fileSelector.addEventListener('change', (e: any) => {
      const { path } = e.target.files[0];
      if (path) {
        setFile(path);
      }
    });
  });
</script>

<IconButton {onClick} {tooltip}>
  <!-- <img src={FileIcon} alt={tooltip} /> -->
  <FileIcon />
</IconButton>
<input type="file" style="display: none;" bind:this={fileSelector} />
