<script>
  import { createEventDispatcher } from 'svelte';
  
  export let selectedYear; // Puede ser un año específico o 'All'
  export let years;

  export let sliderColor = "#E54026";
  let sliderBg = sliderColor + "55";
  
  const dispatch = createEventDispatcher();
  const yearsInt = years.map(year => parseInt(year));
  const maxYear = Math.max(...yearsInt);
  const minYear = Math.min(...yearsInt);
  export let defaultValue = "All";
  
  let allSelected = selectedYear === 'All';
  
  function handleInput(event) {
    selectedYear = event.target.value;
    allSelected = false;
    dispatch('changeYear', { year: selectedYear });
  }

  function handleDoubleClick() {
    selectedYear = defaultValue;
    dispatch('changeYear', { year: selectedYear });
  }
  
</script>
  
<div class="slider-container">
  <input
    type="range"
    class="slider"
    min={minYear}
    max={maxYear}
    bind:value={selectedYear}
    on:input={handleInput}
    on:dblclick={handleDoubleClick}
    style="background: {sliderBg}; --slider-thumb-color: {sliderColor};"
  />
</div>
  
<style>
  /* Contenedor responsivo: ocupa 100% del ancho pero con un max-width definido */
  .slider-container {
    width: 90%;
    max-width: 600px;
    margin: auto;
  }
  
  /* El slider se adapta al ancho del contenedor */
  .slider {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 5px;
    background: var(--slider-bg);
    outline: none;
    opacity: 0.5;
    transition: opacity 0.2s;
  }
  
  .slider:hover {
    opacity: 1;
  }
  
  /* Estilos para el "thumb" del slider en Webkit */
  .slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 5vw;
    height: 2.5vw;
    max-width: 50px;
    max-height: 25px;
    border-radius: 2.5vw;
    background: var(--slider-thumb-color);
    cursor: pointer;
  }
  
  /* Estilos para el "thumb" en Firefox */
  .slider::-moz-range-thumb {
    width: 5vw;
    height: 2.5vw;
    max-width: 50px;
    max-height: 25px;
    border-radius: 2.5vw;
    background: var(--slider-thumb-color);
    cursor: pointer;
  }
  
  /* Ajustes para pantallas pequeñas */
  @media (max-width: 600px) {
    .slider-container {
      max-width: 90%;
    }
    .slider::-webkit-slider-thumb,
    .slider::-moz-range-thumb {
      width: 40px;
      height: 20px;
    }
  }
</style>
