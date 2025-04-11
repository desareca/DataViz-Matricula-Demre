<script>

  // Función para generar barras apiladas
  function barChart3StackedSumm(
    d, selectedYear,
    colGrayText, colorPublico, colorParticular, colorSubvencionado,
    width=200, height=20, posA=-20, posC=23, posB=-20,
    opacityBg="FF", font_size=12, widthMin = 5/100
    ) {
    const pos_title = -50;
    const gray = "#888888";
    const gray2 = "#B2B2B2";
    //console.log((d.A + d.B + d.C)* 100);

    const bar3Stacked = `
        <div style="background: ${isNaN(d.A)? gray2: colorParticular+opacityBg}; width: ${isNaN(d.A)? 99/3: d.A * 99}%; height: auto; display: flex; align-items: center; justify-content: center; color: black; font-size: 12px; position: relative;">
          <span style="font-weight: bold; font-size: ${font_size}px; position: absolute; center: ${posA}px; color: ${isNaN(d.A)? gray2:colGrayText};">
            ${isNaN(d.A)? "":d.A<widthMin?"":(d.A * 100).toFixed(0)+"%"}
          </span>
        </div>
        <div style="background: white; width: ${0.5}%; height: 100%; display: flex; align-items: center; justify-content: center; color: black; font-size: 12px; position: relative;"></div>
        <div style="background: ${isNaN(d.B)? gray2: colorPublico+opacityBg}; width: ${isNaN(d.C)? 99/3: d.C * 99}%; height: 100%; display: flex; align-items: center; justify-content: center; color: black; font-size: 12px; position: relative;">
          <span style="font-weight: bold; font-size: ${font_size}px; position: absolute; center: ${posC}px; color: ${isNaN(d.C)? gray2:colGrayText};">
            ${isNaN(d.C)? "":d.C<widthMin?"":(d.C * 100).toFixed(0)+"%"}
          </span>
        </div>
        <div style="background: white; width: ${0.5}%; height: 100%; display: flex; align-items: center; justify-content: center; color: black; font-size: 12px; position: relative;"></div>
        <div style="background: ${isNaN(d.B)? gray2: colorSubvencionado+opacityBg}; width: ${isNaN(d.B)? 99/3: (1 - d.A - d.C) * 99}%; height: 100%; display: flex; align-items: center; justify-content: center; color: black; font-size: 12px; position: relative;">
          <span style="font-weight: bold; font-size: ${font_size}px; position: absolute; center: ${posB}px; color: ${isNaN(d.B)? gray2:colGrayText};">
            ${isNaN(d.B)? "":d.B<widthMin?"":((1 - d.A - d.C) * 100).toFixed(0)+"%"}
          </span>
        </div>`;

    return `
      <div style="background: #ddd; width: ${width}px; height: ${height}px; position: relative; display: flex; border: 0px solid #999; border-radius: 0px; transform: translateY(-100%)", background: #0000>
        <span style="font-weight: bold; font-size: ${font_size}px; position: absolute; color: ${colGrayText}; margin-top: ${pos_title}px; margin-bottom: 10px">
          ${d.university} </br>
          ${selectedYear==="All" ? '' : 'Año: '+selectedYear+ ' | '} Estudiantes: ${d?.size?.toFixed(0)}
        </span>
        ${isNaN(d.A)? "": bar3Stacked}
      </div>
    `;
  }
  
  export let colGrayText = '#3a545f';
  export let colorPublico = '#D6B165';
  export let colorParticular = '#DD6D6D';
  export let colorSubvencionado = '#00969E';
  export let width = 200;
  export let height = 20;
  export let posA = -20;
  export let posC = 23;
  export let posB = -20;
  export let opacityBg = "88";
  export let fontSize = 10;

  export let calculateAverages;
  export let selectedYear;

  $: htmlContent = barChart3StackedSumm(
    calculateAverages,
    selectedYear,
    colGrayText,
    colorPublico,
    colorParticular,
    colorSubvencionado,
    width,
    height,
    posA,
    posC,
    posB,
    opacityBg,
    fontSize
  );

</script>
  
<div class="summary-results">
  {@html htmlContent}
</div>


<style>
  .summary-results {
    width: 90%;
    max-width: 540px;
    height: auto;
    aspect-ratio: 600 / 20;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 3px;
    border: 0px solid #ff6347;
    font-family: var(--serif);
  }

  @media (max-width: 540px) {
    .summary-results {
      max-width: 90%;
    }
  }
</style>