//import * as d3 from 'd3';
import { select } from 'd3-selection';
import { scaleLinear, scaleSqrt, scaleOrdinal } from 'd3-scale';
import { line, curveNatural } from 'd3-shape'
import { extent, mean, sum, group, ascending, rollup } from 'd3-array';
import { transition } from 'd3-transition';

// Funcion crea Flecha
export function createArrow(svg, color, x, y, angle, size=30) {
  svg.append('text')
  .attr('x', x)
  .attr('y', y)
  .attr('fill', color)
  .attr('font-size', size+'px')
  .attr('text-anchor', 'middle')
  .attr('transform', 'rotate(' + angle + ',' + x + ',' + y + ')')
  .text('➔'); 
}

// Funcion dibuja Poligono
export function createPolygon(g, vertices, colorT, pointsM=[[0, 1, 1/2], [1/2, 0, 1/2], [0, 0, 1]]) {
  // A: Particular Pagado, B: Particular Subvencionado, C: Público
  let pointSub = pointsM.map(point => {
    const [x, y] = barycentricToCartesian(point[0], point[1], point[2], vertices);
    return { x, y };
  });

  g.append('polygon')
    .attr('points', pointSub.map((v) => `${v.x},${v.y}`).join(' '))
    .attr('fill', colorT)
    .attr("stroke", "white")
    .attr("stroke-width", 2)
    .attr('fill-opacity', 0.2);

}

// Función para convertir proporciones a coordenadas
export function barycentricToCartesian(A, B, C, vertices) {
    const x = A * vertices[0].x + B * vertices[1].x + C * vertices[2].x;
    const y = A * vertices[0].y + B * vertices[1].y + C * vertices[2].y;
    return [x, y];
}

// Función para generar barras apiladas
export function barChart3Stacked(
  d, 
  colGrayText, colorPublico, colorParticular, colorSubvencionado,
  width=200, height=20, posA=-20, posC=23, posB=-20,
  widthLineWhite=0.5, firstBar='Particular', fontWeight=400, widthMin = 0
  ) {
  const widthBarMax = 100 - 2 * widthLineWhite
  const divParticular = `
      <div style="background: ${colorParticular}; width: ${d.A * widthBarMax}%; height: 100%; display: flex; align-items: center; justify-content: center; color: black; font-size: 12px; position: relative;">
        <span style="font-weight: ${fontWeight}; font-size: 14px; position: absolute; top: ${posA}px; color: ${colGrayText};">
          ${d.A<widthMin?"":(d.A * 100).toFixed(0)}${d.A<widthMin?"":"%"}
        </span>
      </div>`
  const divSubvencionado = `      
      <div style="background: ${colorSubvencionado}; width: ${(1 - d.A - d.C) * widthBarMax}%; height: 100%; display: flex; align-items: center; justify-content: center; color: black; font-size: 12px; position: relative;">
        <span style="font-weight: ${fontWeight}; font-size: 14px; position: absolute; top: ${posB}px; color: ${colGrayText};">
          ${d.B<widthMin?"":((1 - d.A - d.C) * 100).toFixed(0)}${d.B<widthMin?"":"%"}
        </span>
      </div>`
  const divPublico = `      
      <div style="background: ${colorPublico}; width: ${d.C * widthBarMax}%; height: 100%; display: flex; align-items: center; justify-content: center; color: black; font-size: 12px; position: relative;">
        <span style="font-weight: ${fontWeight}; font-size: 14px; position: absolute; top: ${posC}px; color: ${colGrayText};">
          ${d.C<widthMin?"":(d.C * 100).toFixed(0)}${d.C<widthMin?"":"%"}
        </span>
      </div>`
  const divLineWhite = `<div style="background: white; width: ${widthLineWhite}%; height: 100%; display: flex; align-items: center; justify-content: center; color: black; font-size: 12px; position: relative;"></div>`
  
  let htmlBarChart3Stacked;
  if(firstBar==='Particular'){
    htmlBarChart3Stacked = divParticular + divLineWhite + divPublico + divLineWhite + divSubvencionado;
  } else if(firstBar==='Publico'){
    htmlBarChart3Stacked =  divPublico + divLineWhite + divSubvencionado + divLineWhite + divParticular;
  } else if(firstBar==='Subvencionado'){
    htmlBarChart3Stacked =  divSubvencionado + divLineWhite + divPublico + divLineWhite + divParticular;
  } else {
    htmlBarChart3Stacked = divParticular + divLineWhite + divPublico + divLineWhite + divSubvencionado;
  };
  return `
    <div style="background: #ddd; width: ${width}px; height: ${height}px; position: relative; display: flex; border: 0px solid #999; border-radius: 4px; font-family: var(--serif);">
      ${htmlBarChart3Stacked}
    </div>
  `;
}

// Función para generar barras apiladas
export function barChart3StackedTooltip(
  d, 
  colGrayText, colorPublico, colorParticular, colorSubvencionado,
  width=200, height=20, posA=-20, posC=23, posB=-20
  ) {
  const bar3Stacked =barChart3Stacked(d, colGrayText, colorPublico, colorParticular, colorSubvencionado,
    width=200, height=20, posA=-20, posC=19, posB=-20);
  return `
    <strong style="color: ${colGrayText}; word-wrap: break-word; text-align: justify;">
      ${d.university}
    </strong><br>
    <span style="color: ${colGrayText};">
      Año: ${d.year} &nbsp;&nbsp;|&nbsp;&nbsp; Alumnos: ${d?.size?.toFixed(0)}<br><br><br>
    </span>
      ${isNaN(d.A)? "": bar3Stacked}
    </div>
  `;
}

// Función para generar resumen de datos
export function getGroupedData(data, groupSize='sum') {
  const universities = Array.from(new Set(data.map(d => d.university)));
  const university = universities.length === 1 ? universities[0] : " ";
  //console.log(university);
  const A = mean(data, d => d.A);
  const B = mean(data, d => d.B);
  const C = mean(data, d => d.C);
  const size = groupSize==='mean' ? mean(data, d => d.size) : sum(data, d => d.size);
  return { A: A, B: B, C: C, size: size, university: university };
}

// Función dibuja grafico ternario base
export function drawTernaryBase(
  chartElement, 
  width, height, margin,
  colorParticular, colorSubvencionado, colorPublico, 
  posLabel=[[0, 0], [0, 0], [0, 0]],
  showTicks=true
  ) {

  const scale = scaleLinear().domain([0, 1]).range([0, width - margin * 2]);

  select(chartElement).selectAll('*').remove();

  const svg = select(chartElement)
    .append('svg')
    .attr('width', width)
    .attr('height', height);

  const g = svg
    .append('g')
    .attr('transform', `translate(${margin}, ${margin})`);


  createArrow(g, colorParticular, 330.5, 50, -90)
  createArrow(g, colorSubvencionado, 40, 520, 150)
  createArrow(g, colorPublico, 590, 539, 30)

  const vertices = [
    { x: scale(0.5), y: 0, label: 'Particular Pagado' },
    { x: 0, y: scale(Math.sqrt(3) / 2), label: 'Particular Subvencionado' },
    { x: scale(1), y: scale(Math.sqrt(3) / 2), label: 'Público' },
  ];

  // Dibujar el triángulo principal
  g.append('polygon')
    .attr('points', vertices.map((v) => `${v.x},${v.y}`).join(' '))
    .attr('stroke', 'none')
    .attr('fill', 'none');

  createPolygon(g, vertices, colorSubvencionado, [[0, 1, 0], [0, 1/2, 1/2], [1/3, 1/3, 1/3], [1/2, 1/2, 0]]); 
  createPolygon(g, vertices, colorParticular, [[1/2, 1/2, 0], [1/3, 1/3, 1/3], [1/2, 0, 1/2], [1, 0, 0]]); 
  createPolygon(g, vertices, colorPublico, [[1, 1, 0], [1/3, 1/3, 1/3], [1/2, 0, 1/2], [0, 0, 1]]); 

  // Dibujar los ticks en cada arista
  const tickData = [
        { line: [vertices[0], vertices[1]], color: colorSubvencionado, label: 'Particular Subvencionado' }, 
        { line: [vertices[1], vertices[2]], color: colorPublico, label: 'Público' },
        { line: [vertices[2], vertices[0]], color: colorParticular, label: 'Particular Pagado' }, 
      ];

  tickData.forEach((tick) => {
    const [start, end] = tick.line;
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const tickLength = distance / 125; 

    // Dibujar ticks
    if (showTicks) {
      for (let i = 0; i < 5; i++) {
        const proportion = i / 4; // 0, 0.25, 0.5, 0.75, 1
        const x = start.x + dx * proportion;
        const y = start.y + dy * proportion;

        // Rotación de los ticks desde su centro
        const angle = Math.atan2(dy, dx); // Ángulo de rotación en radianes
        const label = `${proportion * 100}%`; // Etiqueta
        const newX1 = x + tickLength * Math.cos(angle + Math.PI * 2/3);
        const newY1 = y + tickLength * Math.sin(angle + Math.PI * 2/3);

        // Agregar tick y etiqueta
        g.append('line')
          .attr('x1', x)
          .attr('y1', y)
          .attr('x2', newX1)
          .attr('y2', newY1)
          .attr('stroke', tick.color)
          .attr('stroke-width', 1);

        // Etiqueta de cada tick
        g.append('text')
          .attr('x', x + (tickLength ) * Math.cos(angle))
          .attr('y', y + (tickLength ) * Math.sin(angle))
          .attr('text-anchor', 'middle')
          .attr('transform', (d=tick) => {
            if (d.label === 'Particular Subvencionado') return `rotate(${angle * (180 / Math.PI) + 300}, ${newX1}, ${newY1})`;
            if (d.label === 'Particular Pagado') return `rotate(${angle * (180 / Math.PI) + 120}, ${newX1}, ${newY1})`;
            return `rotate(${angle * (180 / Math.PI) + 300}, ${newX1}, ${newY1})`;
            })
          .attr('dy', (d=tick) => {
            if (d.label === 'Particular Subvencionado') return -6;
            if (d.label === 'Particular Pagado') return 8.8;
            return 10;
            })
            .attr('dx', (d=tick) => {
            if (d.label === 'Particular Subvencionado') return -21;
            if (d.label === 'Particular Pagado') return 28;
            return -28;
            })
          .text(label)
          .style('fill', tick.color)
          .style('font-size', '12px');
      };
    }
  });

  g.selectAll('.label')
    .data(vertices)
    .join('text')
    .attr('font-weight', 'bold')
    .attr('x', (d) => {
      if (d.label === 'Particular Subvencionado') return width*0.11 + posLabel[0][0];
      if (d.label === 'Particular Pagado') return width*0.41 + posLabel[1][0];
      return width*0.75 + posLabel[2][0];
      })
    .attr('y', (d) => {
      if (d.label === 'Particular Subvencionado') return showTicks? width*0.765 + posLabel[0][1]: width*0.74 + posLabel[0][1];
      if (d.label === 'Particular Pagado') return showTicks? -width*0.055 + posLabel[1][1]: -width*0.03 + posLabel[1][1];
      return showTicks? width*0.765 + posLabel[2][1]: width*0.74 + posLabel[2][1];
      })
    .attr('text-anchor', 'middle')
    .style('font-size', '20px')
    .style('fill', (d) => {
      if (d.label === 'Particular Pagado') return colorParticular;
      if (d.label === 'Particular Subvencionado') return colorSubvencionado;
      return colorPublico;
    })
    .text((d) => d.label);    
    
    return {g, vertices}
}

// Función dibuja grafico ternario puntos
export function drawTernaryChartPoints(
  filteredData,
  chartElement, 
  width, height, margin, colGrayText,
  colorParticular, colorSubvencionado, colorPublico, 
  posLabel=[[0, 0], [0, 0], [0, 0]],
  showTicks=true,
  onPointClick
  ) {

    const {g, vertices } = drawTernaryBase(
      chartElement, 
      width, height, margin,
      colorParticular, colorSubvencionado, colorPublico, 
      posLabel,
      showTicks
      );

    // De acá apara abajo los puntos
    const sizeScale = scaleSqrt()
      .domain(extent(filteredData, (d) => d.size))
      .range([5, 20]);

    const colorScale = scaleOrdinal()
      .domain(["Particular Pagado", 'Particular Subvencionado', 'Publico'])
      .range([colorParticular, colorSubvencionado, colorPublico]);

    function drawLineEdge(d, vertices, showTicks=true) {
      const [x1_1, y1_1] = barycentricToCartesian(d.A, 0, 1 - d.A, vertices);  
      const [x2_1, y2_1] = barycentricToCartesian(d.A, d.B, d.C, vertices);    
      const [x1_2, y1_2] = barycentricToCartesian(0, 1-d.C, d.C, vertices);
      const [x2_2, y2_2] = barycentricToCartesian(d.A, d.B, d.C, vertices); 
      const [x1_3, y1_3] = barycentricToCartesian(1-d.B, d.B, 0, vertices);
      const [x2_3, y2_3] = barycentricToCartesian(d.A, d.B, d.C, vertices); 

      if (showTicks) {
        g.append('line').attr('class', 'linePos')
        .attr('x1', x1_1).attr('y1', y1_1).attr('x2', x2_1).attr('y2', y2_1)
        .attr('stroke', colorParticular);
    
        g.append('line').attr('class', 'linePos')
          .attr('x1', x1_2).attr('y1', y1_2).attr('x2', x2_2).attr('y2', y2_2)
          .attr('stroke', colorPublico);

        g.append('line').attr('class', 'linePos')
          .attr('x1', x1_3).attr('y1', y1_3).attr('x2', x2_3).attr('y2', y2_3)
          .attr('stroke', colorSubvencionado);
      }
    }

    // Dibujar los puntos
    g.selectAll('.point')
      .data(filteredData)
      .join('circle')
      .attr('cx', (d) => barycentricToCartesian(d.A, d.B, d.C, vertices)[0])
      .attr('cy', (d) => barycentricToCartesian(d.A, d.B, d.C, vertices)[1])
      .attr('r', (d) => sizeScale(d.size))
      .attr('fill', (d) => colorScale(d.mayoria)) 
      .attr('stroke', 'white')
      .attr('stroke-width', 1)
      .style('opacity', 0.2) 
      .style('cursor', 'pointer')
      .on('mouseover', function (event, d) {
        drawLineEdge(d, vertices, showTicks);
        select(this).raise()
          .transition()
          .duration(200)
          .attr('r', sizeScale(d.size))
          .attr('fill', (d) => colorScale(d.mayoria)) 
          .attr('stroke', 'black') 
          .attr('stroke-width', 2) 
          .style('opacity', 1); 
        tooltip
          .style('visibility', 'visible')
          .html(barChart3StackedTooltip(d, colGrayText, colorPublico, colorParticular, colorSubvencionado))
          .style('padding', '10px 5px 20px 10px')
          .style('width', '220px')
          .style('border', '1px solid transparent')
          .style('background-color', 'rgba(200, 200, 200, 0.)')
          .style('left', event.pageX + 15 + 'px')
          .style('top', event.pageY - 15 + 'px');
      })
      .on('click', function(event, d) {
        if (onPointClick) onPointClick(d);
        tooltip.style('visibility', 'hidden');
      })
      .on('mouseout', function () {
        select(this)
          .transition()
          .duration(50)
          .attr('r', (d) => sizeScale(d.size))
          .attr('fill', (d) => colorScale(d.mayoria)) 
          .attr('stroke', 'white')
          .attr('stroke-width', 1)
          .style('opacity', 0.2);
        tooltip.style('visibility', 'hidden');
        g.selectAll('.linePos').remove();
      });

    // Tooltip flotante
    const tooltip = select('body')
      .append('div')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('background', '#fff')
      .style('opacity', 1)
      .style('padding', '5px 10px')
      .style('border-radius', '3px')
      .style('visibility', 'hidden')
      .style('font-size', '12px')
      .style('font-family', 'var(--serif)')
      .style('color', '#333')
      .attr('class', 'stack-bar')
      .style('transform', 'translateY(-100%)')
      .style('z-index', '1000');
}