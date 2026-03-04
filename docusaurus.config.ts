import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Universidad Nexus',
  tagline: 'Programa de Upskilling para Analistas de Datos',
  favicon: 'img/favicon.ico',

  url: 'https://vverlaine.github.io',
  baseUrl: '/sql-mastery/',

  organizationName: 'vverlaine',
  projectName: 'sql-mastery',

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'es',
    locales: ['es'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    navbar: {
      title: 'Universidad Nexus',
      items: [
        {
          label: 'Inicio',
          to: '/',
          position: 'left',
        },
        {
          type: 'dropdown',
          label: 'Pilares',
          position: 'left',
          items: [
            {
              label: '00 · Fundamentos y Cultura de Datos',
              to: '/pilar0',
            },
            {
              label: '01 · SQL: El Lenguaje de los Datos',
              to: '/intro',
            },
            {
              label: '02 · Python / Spark',
              to: '/intro',
            },
            {
              label: '03 · Databricks + VSCode',
              to: '/intro',
            },
            {
              label: '04 · GitHub',
              to: '/intro',
            },
            {
              label: '05 · Power BI',
              to: '/intro',
            },
          ],
        },
        {
          label: 'Plan de Estudios',
          to: '/plan',
          position: 'left',
        },
      ],
    },
    footer: {
      style: 'dark',
      copyright: `© ${new Date().getFullYear()} Universidad Nexus`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['sql', 'python'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;