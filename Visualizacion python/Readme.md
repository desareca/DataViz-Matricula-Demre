# Procesamiento de Datos.

Este script se utiliza para procesar y visualizar datos educacionales relacionados con admisiones y matrículas en diversas universidades. El proceso se divide en varias etapas clave, incluyendo preprocesamiento, carga de datos, procesamiento, agrupamiento y visualización.

- Preprocesamiento:
    - Se definen funciones para la lectura automática de archivos CSV y XLSX dentro de carpetas especificadas.
    - Se preparan las rutas a los directorios que contienen los datos de admisión y matrícula.
- Carga de Datos:
    - Los archivos se leen y se cargan en dataframes específicos, configurando columnas acorde a las necesidades del análisis.
    - Se manejan archivos tanto en formatos CSV como XLSX, adaptando la estructura de columnas según el año y el tipo de archivo.
- Procesamiento de Datos:
    - Se realizan fusiones de dataframes de admisión y matrícula, filtrando y convirtiendo tipos de datos cuando es necesario para la correcta manipulación.
    - Se efectúan ajustes a los nombres de universidades para corregir errores de codificación y se calculan nuevas variables basadas en la dependencia del grupo educacional.
- Agrupamiento y Guardado:
    - Los datos son agrupados por año y universidad, calculando medias y conteos para diferentes categorías y promedios de notas.
    - Se reestructuran los datos en un formato anidado que facilita su visualización y análisis por año y universidad.
    - El resultado se guarda en un archivo JSON estructurado para su uso posterior en análisis, informes y visualizaciones.
- Visualización:
    - Primera visualización, gráfico ternario con distribución de notas de estudiantes según establecimiento de origen.
    - Segunda visualización, gráfico de dispersión con evolución temporal de las notas promedio de los estudiantes.

Para utilizar este script es necesario seguir una estructura de carpetas similar a **Estructura de carpetas Data.txt**.

El script se ejecutó en un entorno de Python 3.10.16.

Para instalar las librerías necesarias, ejecutar el siguiente comando en la terminal:
`pip install -r requirements.txt`