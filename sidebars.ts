import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';
const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    {
      type: 'doc',
      id: 'intro',
      label: 'Bienvenida',
    },
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
    {
      type: 'category',
      label: 'SQL — El Lenguaje de los Datos',
      collapsed: true,
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
};
export default sidebars;
