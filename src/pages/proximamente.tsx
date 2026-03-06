import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import { useLocation } from '@docusaurus/router';
import styles from './proximamente.module.css';

const cursos = {
  'python-spark': {
    nombre: 'Python / Spark',
    numero: '02',
    periodo: 'Mes 3–4',
    duracion: '5–6 semanas',
    descripcion: 'Manipular, limpiar y transformar datos con código, superando los límites de Excel.',
    temas: ['Python básico', 'Pandas', 'Visualización', 'Introducción a Spark', 'PySpark básico'],
    color: '#10b981',
  },
  'databricks': {
    nombre: 'Databricks + VSCode',
    numero: '03',
    periodo: 'Mes 4–5',
    duracion: '5–6 semanas',
    descripcion: 'Dominar el entorno donde vive el trabajo de datos, con desarrollo local conectado.',
    temas: ['Navegación en Databricks', 'Delta Lake', 'Jobs y Pipelines', 'VSCode + Databricks', 'Databricks Assistant'],
    color: '#f59e0b',
  },
  'github': {
    nombre: 'GitHub',
    numero: '04',
    periodo: 'Mes 6',
    duracion: '3–4 semanas',
    descripcion: 'Gestionar código con buenas prácticas y colaborar en repositorios compartidos.',
    temas: ['Control de versiones', 'Repos y ramas', 'Pull Requests', 'GitHub + VSCode', 'GitHub Copilot'],
    color: '#1F3864',
  },
  'power-bi': {
    nombre: 'Power BI',
    numero: '05',
    periodo: 'Mes 7–9',
    duracion: '5–6 semanas',
    descripcion: 'Transformar datos en historias visuales claras que faciliten la toma de decisiones.',
    temas: ['Modelo de datos', 'DAX básico', 'Diseño de dashboards', 'RLS', 'Power BI Service'],
    color: '#e8b84b',
  },
};

export default function Proximamente(): React.JSX.Element {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const slug = params.get('curso') || '';
  const curso = cursos[slug];

  return (
    <Layout
      title={curso ? `${curso.nombre} — Próximamente` : 'Próximamente'}
      description="Este curso está en construcción">
      <div className={styles.container}>

        <div className={styles.inner}>

          {/* Badge */}
          <div className={styles.badge}>En construcción</div>

          {/* Número */}
          {curso && (
            <div className={styles.numero} style={{ color: curso.color }}>
              {curso.numero}
            </div>
          )}

          {/* Título */}
          <h1 className={styles.titulo}>
            {curso ? curso.nombre : 'Curso próximamente'}
          </h1>

          {/* Meta */}
          {curso && (
            <p className={styles.meta}>
              {curso.periodo} &nbsp;·&nbsp; {curso.duracion}
            </p>
          )}

          {/* Descripción */}
          {curso && (
            <p className={styles.descripcion}>{curso.descripcion}</p>
          )}

          {/* Divisor */}
          <div className={styles.divisor} style={{ background: curso?.color ?? '#ccc' }} />

          {/* Temas */}
          {curso && (
            <div className={styles.temas}>
              <p className={styles.temasLabel}>Lo que aprenderás</p>
              <div className={styles.temasGrid}>
                {curso.temas.map((tema, i) => (
                  <div key={i} className={styles.tema}>
                    <span className={styles.temaNum}>{String(i + 1).padStart(2, '0')}</span>
                    {tema}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className={styles.ctas}>
            <Link to="/plan" className={styles.ctaSecundario}>
              ← Ver plan de estudios
            </Link>
            <Link to="/pilar0" className={styles.ctaPrimario}>
              Comenzar por Fundamentos →
            </Link>
          </div>

        </div>
      </div>
    </Layout>
  );
}
