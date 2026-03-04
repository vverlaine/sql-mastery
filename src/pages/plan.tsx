import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import styles from './plan.module.css';

const pilares = [
  {
    number: '00',
    title: 'Fundamentos y Cultura de Datos',
    duration: '2-3 semanas',
    period: 'Mes 1',
    color: '#6366f1',
    objective: 'Desarrollar la mentalidad analítica y el uso responsable de IA antes de entrar a lo técnico.',
    topics: ['Mentalidad analítica', 'Ecosistema de datos', 'Introducción a IA', 'Prompt Engineering', 'Seguridad y GDPR'],
    link: '/pilar0',
  },
  {
    number: '01',
    title: 'SQL: El Lenguaje de los Datos',
    duration: '4-5 semanas',
    period: 'Mes 1-2',
    color: '#2E75B6',
    objective: 'Consultar bases de datos de forma autónoma para responder preguntas de negocio reales.',
    topics: ['SELECT / FROM / WHERE', 'GROUP BY y agregaciones', 'JOINs', 'Subconsultas y CTEs', 'IA aplicada a SQL'],
    link: '/intro',
  },
  {
    number: '02',
    title: 'Python / Spark',
    duration: '5-6 semanas',
    period: 'Mes 3-4',
    color: '#10b981',
    objective: 'Manipular, limpiar y transformar datos con código, superando los límites de Excel.',
    topics: ['Python básico', 'Pandas', 'Visualización', 'Introducción a Spark', 'PySpark básico'],
    link: '/intro',
  },
  {
    number: '03',
    title: 'Databricks + VSCode',
    duration: '5-6 semanas',
    period: 'Mes 4-5',
    color: '#f59e0b',
    objective: 'Dominar el entorno donde vive el trabajo de datos, con desarrollo local conectado.',
    topics: ['Navegación en Databricks', 'Delta Lake', 'Jobs y Pipelines', 'VSCode + Databricks', 'Databricks Assistant'],
    link: '/intro',
  },
  {
    number: '04',
    title: 'GitHub',
    duration: '3-4 semanas',
    period: 'Mes 6',
    color: '#1F3864',
    objective: 'Gestionar código con buenas prácticas y colaborar en repositorios compartidos.',
    topics: ['Control de versiones', 'Repos y ramas', 'Pull Requests', 'GitHub + VSCode', 'GitHub Copilot'],
    link: '/intro',
  },
  {
    number: '05',
    title: 'Power BI',
    duration: '5-6 semanas',
    period: 'Mes 7-9',
    color: '#e8b84b',
    objective: 'Transformar datos en historias visuales claras que faciliten la toma de decisiones.',
    topics: ['Modelo de datos', 'DAX básico', 'Diseño de dashboards', 'RLS', 'Power BI Service'],
    link: '/intro',
  },
];

export default function Plan(): React.JSX.Element {
  return (
    <Layout title="Plan de Estudios" description="Los 6 pilares del programa Universidad Nexus">
      <div className={styles.container}>

        {/* Header */}
        <div className={styles.header}>
          <div className={styles.badge}>Plan de Estudios · 9 meses</div>
          <h1 className={styles.title}>El camino completo</h1>
          <p className={styles.subtitle}>
            6 pilares secuenciales diseñados para construir habilidades de menor a mayor complejidad técnica.
            Cada pilar tiene objetivos claros, ejercicios prácticos y un proyecto integrador.
          </p>
        </div>

        {/* Timeline */}
        <div className={styles.timeline}>
          {pilares.map((pilar, index) => (
            <div key={index} className={styles.card}>
              <div className={styles.cardLeft}>
                <div className={styles.cardNumber} style={{color: pilar.color}}>
                  {pilar.number}
                </div>
                <div className={styles.cardLine} style={{background: pilar.color}} />
              </div>
              <div className={styles.cardContent}>
                <div className={styles.cardHeader}>
                  <div>
                    <div className={styles.cardPeriod} style={{color: pilar.color}}>
                      {pilar.period} · {pilar.duration}
                    </div>
                    <h2 className={styles.cardTitle}>
                      {pilar.title}
                    </h2>
                  </div>
                  <Link to={pilar.link} className={styles.cardCta} style={{borderColor: pilar.color, color: pilar.color}}>
                    Entrar →
                  </Link>
                </div>
                <p className={styles.cardObjective}>{pilar.objective}</p>
                <div className={styles.topics}>
                  {pilar.topics.map((topic, i) => (
                    <span key={i} className={styles.topic} style={{borderColor: `${pilar.color}40`, color: pilar.color, background: `${pilar.color}10`}}>
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Final */}
        <div className={styles.ctaBlock}>
          <h2 className={styles.ctaTitle}>¿Listo para empezar?</h2>
          <p className={styles.ctaSubtitle}>Comienza por el Pilar 0 y construye desde los fundamentos.</p>
          <Link to="/pilar0" className={styles.ctaButton}>
            Comenzar el programa →
          </Link>
        </div>

      </div>
    </Layout>
  );
}