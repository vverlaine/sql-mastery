import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {

  pilar0Sidebar: [
    {
      type: 'category',
      label: 'Fundamentos y Cultura de Datos',
      collapsed: false,
      items: [
        'pilar0/index',
        'pilar0/modulo1',
        'pilar0/modulo2',
        'pilar0/modulo3',
        'pilar0/modulo4',
        'pilar0/modulo5',
        'pilar0/modulo6',
      ],
    },
  ],

  sqlSidebar: [
    {
      type: 'category',
      label: 'SQL — El Lenguaje de los Datos',
      collapsed: false,
      items: [
        'sql/bienvenida/index',
        {
          type: 'category',
          label: '01 · Recuperación de Datos',
          items: [
            'sql/recuperacion_datos/columnas_individuales',
            'sql/recuperacion_datos/multiples_columnas',
            'sql/recuperacion_datos/todas_columnas',
            'sql/recuperacion_datos/filas_distintas',
            'sql/recuperacion_datos/limitando_resultados',
            'sql/recuperacion_datos/desafios',
          ],
        },
        {
          type: 'category',
          label: '02 · Ordenamiento',
          items: [
            'sql/ordenamiento/index',
            'sql/ordenamiento/order_by',
            'sql/ordenamiento/multiples_columnas',
            'sql/ordenamiento/direccion_orden',
          ],
        },
        {
          type: 'category',
          label: '03 · Filtrado',
          items: [
            'sql/filtrado/index',
            'sql/filtrado/where',
            'sql/filtrado/operadores',
          ],
        },
        {
          type: 'category',
          label: '04 · Filtrado Avanzado',
          items: [
            'sql/filtrado_avanzado/index',
            'sql/filtrado_avanzado/and',
            'sql/filtrado_avanzado/or',
            'sql/filtrado_avanzado/not',
          ],
        },
        {
          type: 'category',
          label: '05 · Agregación',
          items: [
            'sql/agregacion/index',
            'sql/agregacion/avg',
            'sql/agregacion/count',
            'sql/agregacion/max_min',
            'sql/agregacion/sum',
          ],
        },
      ],
    },
  ],

  sparkSidebar: [
    {
      type: 'category',
      label: 'Python y Spark',
      collapsed: false,
      items: [
        'spark/bienvenida/index',
        {
          type: 'category',
          label: '01 · Python Básico',
          items: [
            'spark/python_basico/index',
            'spark/python_basico/variables_tipos',
            'spark/python_basico/listas_diccionarios',
            'spark/python_basico/condicionales_bucles',
            'spark/python_basico/funciones',
          ],
        },
        {
          type: 'category',
          label: '02 · Introducción a Spark',
          items: [
            'spark/spark_intro/index',
            'spark/spark_intro/que_es_spark',
            'spark/spark_intro/spark_table_sql',
            'spark/spark_intro/databricks_notebooks',
          ],
        },
        {
          type: 'category',
          label: '03 · Selección y Filtrado',
          items: [
            'spark/seleccion_filtrado/index',
            'spark/seleccion_filtrado/select',
            'spark/seleccion_filtrado/filter_where',
          ],
        },
        {
          type: 'category',
          label: '04 · Transformación de Columnas',
          items: [
            'spark/transformacion_columnas/index',
            'spark/transformacion_columnas/withColumn',
            'spark/transformacion_columnas/renombrar_eliminar',
            'spark/transformacion_columnas/cast_tipos',
          ],
        },
        {
          type: 'category',
          label: '05 · Funciones Útiles',
          items: [
            'spark/funciones_utiles/index',
            'spark/funciones_utiles/when',
            'spark/funciones_utiles/nulos_coalesce',
            'spark/funciones_utiles/fechas',
            'spark/funciones_utiles/strings',
          ],
        },
        {
          type: 'category',
          label: '06 · Agregaciones',
          items: [
            'spark/agregaciones/index',
            'spark/agregaciones/groupby',
            'spark/agregaciones/agg',
            'spark/agregaciones/orderby_patrones',
          ],
        },
        {
          type: 'category',
          label: '07 · Joins',
          items: [
            'spark/joins/index',
            'spark/joins/inner_join',
            'spark/joins/left_right_join',
            'spark/joins/joins_multiples',
          ],
        },
        {
          type: 'category',
          label: '08 · Repaso y Evaluación',
          items: [
            'spark/repaso_evaluacion/index',
            'spark/repaso_evaluacion/repaso_general',
            'spark/repaso_evaluacion/evaluacion_final',
          ],
        },
      ],
    },
  ],

};

export default sidebars;
