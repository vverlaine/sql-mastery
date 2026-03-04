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
  ],
};
export default sidebars;
