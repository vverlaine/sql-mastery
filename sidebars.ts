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
        {
          type: 'category',
          label: '06 · JOINs',
          items: [
            'sql/joins/index',
            'sql/joins/inner_join',
            'sql/joins/left_join',
            'sql/joins/left_outer_join',
            'sql/joins/full_join',
            'sql/joins/joins_encadenados',
            'sql/joins/duplicacion_registros',
            'sql/joins/errores_comunes',
            'sql/joins/desafios',
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

  databricksSidebar: [
    {
      type: 'category',
      label: 'Databricks + VSCode',
      collapsed: false,
      items: [
        'databricks/bienvenida/index',
        {
          type: 'category',
          label: '01 · Databricks como Entorno',
          items: [
            'databricks/databricks_entorno/index',
            'databricks/databricks_entorno/workspace',
            'databricks/databricks_entorno/clusters',
            'databricks/databricks_entorno/unity_catalog',
          ],
        },
        {
          type: 'category',
          label: '02 · Notebooks Productivos',
          items: [
            'databricks/notebooks_productivos/index',
            'databricks/notebooks_productivos/estructura',
            'databricks/notebooks_productivos/widgets_parametros',
            'databricks/notebooks_productivos/jobs_workflows',
          ],
        },
        {
          type: 'category',
          label: '03 · VSCode Setup',
          items: [
            'databricks/vscode_setup/index',
            'databricks/vscode_setup/instalacion',
            'databricks/vscode_setup/extensiones',
          ],
        },
        {
          type: 'category',
          label: '04 · Conectar VSCode con Databricks',
          items: [
            'databricks/conectar_vscode_databricks/index',
            'databricks/conectar_vscode_databricks/extension_config',
            'databricks/conectar_vscode_databricks/databricks_connect',
            'databricks/conectar_vscode_databricks/sync_archivos',
          ],
        },
        {
          type: 'category',
          label: '05 · Desarrollo Local + Remoto',
          items: [
            'databricks/desarrollo_local_remoto/index',
            'databricks/desarrollo_local_remoto/workflow_profesional',
            'databricks/desarrollo_local_remoto/refactor_a_py',
            'databricks/desarrollo_local_remoto/debugging',
          ],
        },
        {
          type: 'category',
          label: '06 · Organización de Proyectos',
          items: [
            'databricks/organizacion_proyectos/index',
            'databricks/organizacion_proyectos/estructura_carpetas',
            'databricks/organizacion_proyectos/modulos_reutilizables',
            'databricks/organizacion_proyectos/configuracion_secrets',
          ],
        },
        {
          type: 'category',
          label: '07 · Buenas Prácticas',
          items: [
            'databricks/buenas_practicas/index',
            'databricks/buenas_practicas/linting_formatting',
            'databricks/buenas_practicas/atajos_productividad',
            'databricks/buenas_practicas/buenas_practicas_generales',
          ],
        },
        {
          type: 'category',
          label: '08 · Repaso y Evaluación',
          items: [
            'databricks/repaso_evaluacion/index',
            'databricks/repaso_evaluacion/repaso_general',
            'databricks/repaso_evaluacion/evaluacion_final',
          ],
        },
      ],
    },
  ],

  githubSidebar: [
    {
      type: 'category',
      label: 'GitHub',
      collapsed: false,
      items: [
        'github/bienvenida/index',
        {
          type: 'category',
          label: '01 · ¿Por qué Git?',
          items: [
            'github/porque_git/index',
            'github/porque_git/problema_que_resuelve',
            'github/porque_git/conceptos_fundamentales',
            'github/porque_git/instalacion_configuracion',
          ],
        },
        {
          type: 'category',
          label: '02 · Git Local',
          items: [
            'github/git_local/index',
            'github/git_local/primer_repositorio',
            'github/git_local/gitignore',
            'github/git_local/comandos_esenciales',
          ],
        },
        {
          type: 'category',
          label: '03 · Branches y Merge',
          items: [
            'github/branches_merge/index',
            'github/branches_merge/trabajando_con_branches',
            'github/branches_merge/merge_y_conflictos',
          ],
        },
        {
          type: 'category',
          label: '04 · GitHub Remoto',
          items: [
            'github/github_remoto/index',
            'github/github_remoto/repos_remotos_clone',
            'github/github_remoto/push_pull_fetch',
          ],
        },
        {
          type: 'category',
          label: '05 · Pull Requests',
          items: [
            'github/pull_requests/index',
            'github/pull_requests/crear_pull_request',
            'github/pull_requests/code_reviews',
            'github/pull_requests/templates_workflows',
          ],
        },
        {
          type: 'category',
          label: '06 · Flujo Diario',
          items: [
            'github/flujo_diario/index',
            'github/flujo_diario/feature_branch_workflow',
            'github/flujo_diario/conflictos_avanzados',
            'github/flujo_diario/recuperacion',
          ],
        },
        {
          type: 'category',
          label: '07 · Databricks + Repos',
          items: [
            'github/databricks_repos/index',
            'github/databricks_repos/conectar_databricks_github',
            'github/databricks_repos/workflow_integrado',
            'github/databricks_repos/cicd_github_actions',
          ],
        },
        {
          type: 'category',
          label: '08 · Repaso y Evaluación',
          items: [
            'github/repaso_evaluacion/index',
            'github/repaso_evaluacion/repaso_general',
            'github/repaso_evaluacion/evaluacion_final',
          ],
        },
      ],
    },
  ],

  powerbiSidebar: [
    {
      type: 'category',
      label: 'Power BI',
      collapsed: false,
      items: [
        'powerbi/bienvenida/index',
        {
          type: 'category',
          label: '01 · Fundamentos',
          items: [
            'powerbi/fundamentos/index',
            'powerbi/fundamentos/que_es_power_bi',
            'powerbi/fundamentos/instalacion_primer_recorrido',
          ],
        },
        {
          type: 'category',
          label: '02 · Conectar con Databricks',
          items: [
            'powerbi/conectar_databricks/index',
            'powerbi/conectar_databricks/configurar_conexion',
            'powerbi/conectar_databricks/import_vs_directquery',
          ],
        },
        {
          type: 'category',
          label: '03 · Modelado',
          items: [
            'powerbi/modelado/index',
            'powerbi/modelado/modelo_estrella',
            'powerbi/modelado/power_query',
          ],
        },
        {
          type: 'category',
          label: '04 · DAX',
          items: [
            'powerbi/dax/index',
            'powerbi/dax/fundamentos_dax',
            'powerbi/dax/time_intelligence',
          ],
        },
        {
          type: 'category',
          label: '05 · Visualizaciones',
          items: [
            'powerbi/visualizaciones/index',
            'powerbi/visualizaciones/elegir_visual_correcto',
            'powerbi/visualizaciones/interactividad',
          ],
        },
        {
          type: 'category',
          label: '06 · Diseño UX',
          items: [
            'powerbi/diseno_ux/index',
            'powerbi/diseno_ux/principios_ux_dashboards',
            'powerbi/diseno_ux/plantilla_ejecutiva',
          ],
        },
        {
          type: 'category',
          label: '07 · Publicación y Service',
          items: [
            'powerbi/publicacion_service/index',
            'powerbi/publicacion_service/publicar_compartir',
            'powerbi/publicacion_service/refresh_programado',
          ],
        },
        {
          type: 'category',
          label: '08 · Repaso y Evaluación',
          items: [
            'powerbi/repaso_evaluacion/index',
            'powerbi/repaso_evaluacion/repaso_general',
            'powerbi/repaso_evaluacion/evaluacion_final',
          ],
        },
      ],
    },
  ],

};

export default sidebars;
