<script>
  import { Col, Row } from '@sveltestrap/sveltestrap';
  import TernaryChartPoints from '$lib/charts/ternaryChart/TernaryChartPoints.svelte';
  import Slider from '$lib/charts/ternaryChart/Slider.svelte';
  import SummaryResults from '$lib/charts/ternaryChart/SummaryResults.svelte';
  import { getGroupedData } from '$lib/charts/ternaryChart/ternaryChartUtils';
  import UniversitySearch from '$lib/charts/ternaryChart/UniversitySearch.svelte';

  let width = 800;
  let height = width - 40;
  let margin = 80;
  let colorParticular = "#DD6D6D";
  let colorSubvencionado = "#00969E";
  let colorPublico = "#E0B165";
  let colGrayText = "#3A545F";
  let colGrayLine = "#3A545F33";
  let colGrayBorder = "#3A545F55";
  let posLabel=[
    [0, 0], // Particular Subvencionado
    [0, -0], // Particular Pagado 
    [0, 0]  // Público
  ];
  let showTicks = true;

  export let data;
  let years = data.years;
  
  function handleYearChange(event) {
    selectedYear = event.detail.year;
  }

  function handleYearChangeLine(event) {
    selectedYearLine = event.detail.year;
  }

  // Graficos
  // Puntos
  let selectedYear = 'All';
  let selectedUniversity = 'All';
  let searchText = '';

  function handlePointClick(event) {
    const clickedUni = event.detail.university;
    selectedUniversity = (selectedUniversity === clickedUni) ? 'All' : clickedUni;
  }

  $: filteredData = data['data'].filter(d =>
    (selectedYear === 'All' || d.year === selectedYear) &&
    (selectedUniversity === 'All' || d.university === selectedUniversity) &&
    (searchText === '' || d.university.toLowerCase().includes(searchText.toLowerCase()))
    ).sort((a, b) => b.year - a.year);

  $: calculateAverages = getGroupedData(filteredData);
  
  function handleSearch(event) {
    searchText = event.detail.searchText;
  }

</script>

<Row>
    <Col xs="12" md="12" lg="12" xl="12" style="display: flex; justify-content: center; padding: 0; margin-bottom: {showTicks ? 70 : 50}px">
        <TernaryChartPoints
        filteredData={filteredData}
        width={width}
        height={height}
        margin={margin}
        colorParticular={colorParticular}
        colorSubvencionado={colorSubvencionado}
        colorPublico={colorPublico}
        colGrayText={colGrayText}
        posLabel={posLabel}
        showTicks={showTicks}
        on:pointClick={handlePointClick} 
        customStyle="border: 0px solid #ff6347">

        </TernaryChartPoints>
    </Col>
    <Col xs="12" md="12" lg="12" xl="12" style="display: flex; justify-content: center; padding: 0; margin-bottom: 0px">
        <SummaryResults
          calculateAverages={calculateAverages}
          selectedYear={selectedYear}
          colGrayText={colGrayText}
          colorPublico={colorPublico}
          colorParticular={colorParticular}
          colorSubvencionado={colorSubvencionado}
          width={600}
          height={20}
          posA={0}
          posC={0}
          posB={0}
          opacityBg="66"
          fontSize = 14
        />
      </Col>
      <Col xs="12" md="12" lg="12" xl="12" style="display: flex; justify-content: center; padding: 0; margin-bottom: 12px">
        <UniversitySearch
          on:search={handleSearch}
        />
      </Col>
      <Col xs="12" md="12" lg="12" xl="12" style="display: flex; justify-content: center; padding: 0; margin-bottom: 48px">
        <Slider
          selectedYear={selectedYear}
          years={years}
          sliderColor={colorSubvencionado}
          on:changeYear={handleYearChange}
        />
      </Col>
</Row>