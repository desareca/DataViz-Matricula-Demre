<script>
  import { createEventDispatcher } from 'svelte';
  import { drawTernaryChartPoints } from '$lib/charts/ternaryChart/ternaryChartUtils';

  export let width;
  export let height;
  export let margin;
  export let colorParticular;
  export let colorSubvencionado;
  export let colorPublico;
  export let colGrayText;
  export let posLabel;
  export let showTicks;
  export let filteredData;
  export let message=false;
  export let messageContent="hola";
  export let posMessageX="50%";
  export let posMessageY="75%";
  export let colGrayBorder="#FFFFFF";


  let TernaryChart;
  const dispatch = createEventDispatcher();

  function handlePointClick(d) {
    dispatch('pointClick', d);
    //console.log(d.university);
  }
  
    $: if (TernaryChart) {

      drawTernaryChartPoints(
      filteredData,
      TernaryChart, 
      width, height, margin, colGrayText,
      colorParticular, colorSubvencionado, colorPublico, 
      posLabel, showTicks, 
      handlePointClick 
      );
    };

  export let customStyle = '';

</script>
  
<style>
  .container-ternario {
    width: 100%;
    max-width: 800px;
    height: auto;
    aspect-ratio: 800 / 680;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
    position: relative; /* Hace que la posición absoluta del span sea relativa a este contenedor */
    font-family: var(--serif);
  }
  .ternario {
    width: 100%;
    max-width: 800px;
    height: auto;
    aspect-ratio: 800 / 680;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
    border: 0px solid #ff6347;
  }
  
  @media (max-width: 600px) {
    .ternario {
      max-width: 100%;
    }
    .container-ternario {
      max-width: 100%;
    }
  }

  .ternary-message {
    width: 55%;
    height: auto;
    position: absolute; /* Posicionamiento absoluto dentro del contenedor relativo */
    transform: translate(-50%, -50%); /* Ajuste fino para centrar exactamente */
    background-color: white;
    padding: 5px;
    text-align: left;
    z-index: 10;
    font-family: var(--serif);
    font-size: 18px;
  }
</style>

<div class="container-ternario">
  <svg
    bind:this={TernaryChart} 
    class='ternario' 
    style="{customStyle}" 
    viewBox="0 0 800 720"
    preserveAspectRatio="xMidYMid meet">
  </svg>
  {#if message}
    <span class="ternary-message" style="top: {posMessageY}; left: {posMessageX}; border:  2px solid {colGrayBorder}; color: {colGrayText};">
      {messageContent}
    </span>
  {/if}
  
</div>
  

