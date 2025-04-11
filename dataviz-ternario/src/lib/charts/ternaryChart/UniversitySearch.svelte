<script>
  import { createEventDispatcher } from 'svelte';
  
  let searchText = '';
 
  const dispatch = createEventDispatcher();

  function handleInput() {
    dispatch('search', { searchText });
  }

</script>

<div class="search-container">
  <input
    type="text"
    placeholder="Buscar universidad..."
    bind:value={searchText}
    on:input={handleInput} />
</div>

<style>
  .search-container {
    width: 90%;
    max-width: 600px;
    margin: auto;
    padding: 0.5rem;
    font-family: var(--serif);
  }
  input {
    width: 100%;
    padding: 0.5rem;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
</style>
