// Función carga datos
export async function load({ fetch }) {
    const dataUrl = 'https://raw.githubusercontent.com/desareca/DataViz-Matricula-Demre/refs/heads/main/Visualizacion%20python/df_admision_matricula_group.json';
    try {
      const response = await fetch(dataUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const rawData = await response.json();
      //console.log("Datos crudos:", rawData);

      const years = Object.keys(rawData).sort();
      const universities = Object.entries(rawData)
        .flatMap(([year, universitiesData]) => Object.keys(universitiesData))
        .filter((value, index, self) => self.indexOf(value) === index);
      universities.unshift('All');

      let summary = {};
      let initialValues = {};
      let finalValues = {};
      let cantYears = {};

      const data = Object.entries(rawData)
        .flatMap(([year, universities]) =>
          Object.entries(universities).map(([university, values]) => {
            const A = values['Particular pagado'];
            const B = values['Particular subvencionado'];
            const C = values['Municipal'];
            const size = values['N_ESTUDIANTES'];

            // Acumular valores para calcular medias
            if (!summary[university]) {
              summary[university] = { A: 0, B: 0, C: 0, count: 0 };
              initialValues[university] = { A, B, C };
            }
            finalValues[university] = { A, B, C };
            summary[university].A += A * size;
            summary[university].B += B * size;
            summary[university].C += C * size;
            summary[university].count += size;
            cantYears[university] = cantYears[university] ? cantYears[university] + 1 : 1;

            let mayoria = 'Particular Pagado';
            if (B > A && B > C) mayoria = 'Particular Subvencionado';
            else if (C > A && C > B) mayoria = 'Publico';

            return {
              year,
              university,
              A,
              B,
              C,
              slep: values['Slep'],
              size: values['N_ESTUDIANTES'],
              notas: values['PROMEDIO_NOTAS'],
              mayoria, 
            };
          })
        )
        .sort((a, b) => b.size - a.size);
      
      // Calcular distancias euclidianas
      let distances = Object.keys(initialValues).map(university => {
        const initial = initialValues[university];
        const final = finalValues[university];
        const years = cantYears[university];
        const distanceA = Math.pow(final.A - initial.A, 2);
        const distanceB = Math.pow(final.B - initial.B, 2);
        const distanceC = Math.pow(final.C - initial.C, 2);
        const distanceTotal = distanceA + distanceB + distanceC;
        return { university, distanceA, distanceB, distanceC, distanceTotal, years };
      })
      .sort((a, b) => b.distanceTotal - a.distanceTotal);

      // Calcular medias
      let averagesUniversity = Object.keys(summary).map(university => ({
        university,
        A: summary[university].A / summary[university].count,
        B: summary[university].B / summary[university].count,
        C: summary[university].C / summary[university].count,
        size: summary[university].count
      }));

      //console.log("Datos procesados:", data);
      //console.log("Promedios por universidad:", averagesUniversity);

      return { data, years, universities, averagesUniversity, distances  };
    } catch (error) {
      console.error('Error en load():', error);
      return { data: [], years: [], universities: [], averagesUniversity: [] };
    }
  };