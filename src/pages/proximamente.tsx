import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import { useLocation } from '@docusaurus/router';
import styles from './proximamente.module.css';

const cursoNombres = {
  'python-spark':  'Python / Spark',
  'databricks':    'Databricks + VSCode',
  'github':        'GitHub',
  'power-bi':      'Power BI',
};

function Tractor() {
  return (
    <svg viewBox="0 0 240 150" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.tractor}>

      {/* ── HUMO ── */}
      <circle cx="82" cy="18" r="5" stroke="currentColor" strokeWidth="1.2" opacity="0.15"/>
      <circle cx="90" cy="10" r="4" stroke="currentColor" strokeWidth="1.2" opacity="0.1"/>
      <circle cx="96" cy="4"  r="3" stroke="currentColor" strokeWidth="1"   opacity="0.07"/>

      {/* ── ESCAPE ── */}
      <rect x="79" y="28" width="6" height="18" rx="3" stroke="currentColor" strokeWidth="1.8"/>

      {/* ── CABINA ── */}
      {/* Techo */}
      <path d="M60 62 L60 38 Q60 34 64 34 L112 34 Q116 34 116 38 L116 62 Z"
            stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
      {/* Ventana delantera */}
      <rect x="95" y="40" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" opacity="0.5"/>
      {/* Ventana trasera */}
      <rect x="65" y="40" width="22" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" opacity="0.35"/>
      {/* Puerta / detalle */}
      <line x1="88" y1="40" x2="88" y2="56" stroke="currentColor" strokeWidth="1" opacity="0.3"/>

      {/* ── CUERPO / CHASIS ── */}
      <path d="M44 62 L44 92 L180 92 L180 68 Q180 62 174 62 Z"
            stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>

      {/* ── CAPÓ / MOTOR ── */}
      <path d="M116 62 L180 62 L180 82 L116 82 Z"
            stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
      {/* Rejilla motor */}
      <line x1="130" y1="64" x2="130" y2="80" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
      <line x1="143" y1="64" x2="143" y2="80" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
      <line x1="156" y1="64" x2="156" y2="80" stroke="currentColor" strokeWidth="1" opacity="0.3"/>

      {/* ── ENGANCHE TRASERO ── */}
      <path d="M44 80 L32 80 L28 88 L32 92 L44 92" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>

      {/* ── RUEDA TRASERA GRANDE ── */}
      <circle cx="75" cy="108" r="34" stroke="currentColor" strokeWidth="2.2"/>
      {/* Aro interior */}
      <circle cx="75" cy="108" r="22" stroke="currentColor" strokeWidth="1.2" opacity="0.4"/>
      {/* Rayos */}
      {[0,45,90,135,180,225,270,315].map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        return (
          <line key={i}
            x1={75 + 8 * Math.cos(rad)}  y1={108 + 8 * Math.sin(rad)}
            x2={75 + 22 * Math.cos(rad)} y2={108 + 22 * Math.sin(rad)}
            stroke="currentColor" strokeWidth="1.4" opacity="0.5" strokeLinecap="round"/>
        );
      })}
      {/* Buje central */}
      <circle cx="75" cy="108" r="7" stroke="currentColor" strokeWidth="1.8"/>
      <circle cx="75" cy="108" r="3" fill="currentColor" opacity="0.25"/>
      {/* Tacos de tracción */}
      {[0,30,60,90,120,150,180,210,240,270,300,330].map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        const x1 = 75 + 30 * Math.cos(rad);
        const y1 = 108 + 30 * Math.sin(rad);
        const x2 = 75 + 34 * Math.cos(rad);
        const y2 = 108 + 34 * Math.sin(rad);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.6"/>;
      })}

      {/* ── RUEDA DELANTERA PEQUEÑA ── */}
      <circle cx="185" cy="116" r="20" stroke="currentColor" strokeWidth="2"/>
      <circle cx="185" cy="116" r="12" stroke="currentColor" strokeWidth="1.2" opacity="0.4"/>
      {[0,60,120,180,240,300].map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        return (
          <line key={i}
            x1={185 + 4 * Math.cos(rad)}  y1={116 + 4 * Math.sin(rad)}
            x2={185 + 12 * Math.cos(rad)} y2={116 + 12 * Math.sin(rad)}
            stroke="currentColor" strokeWidth="1.3" opacity="0.5" strokeLinecap="round"/>
        );
      })}
      <circle cx="185" cy="116" r="4" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="185" cy="116" r="2" fill="currentColor" opacity="0.2"/>
      {[0,30,60,90,120,150,180,210,240,270,300,330].map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        return <line key={i}
          x1={185 + 17 * Math.cos(rad)} y1={116 + 17 * Math.sin(rad)}
          x2={185 + 20 * Math.cos(rad)} y2={116 + 20 * Math.sin(rad)}
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>;
      })}

      {/* ── SUELO ── */}
      <line x1="10" y1="142" x2="230" y2="142" stroke="currentColor" strokeWidth="1" opacity="0.12" strokeLinecap="round"/>
    </svg>
  );
}

export default function Proximamente(): React.JSX.Element {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const slug = params.get('curso') || '';
  const nombre = cursoNombres[slug] || 'Este curso';

  return (
    <Layout title="Próximamente" description="Curso en construcción">
      <div className={styles.container}>
        <div className={styles.inner}>

          <Tractor />

          <div className={styles.badge}>En construcción</div>

          <h1 className={styles.titulo}>Próximamente</h1>

          <p className={styles.subtitulo}>
            <span className={styles.cursoBold}>{nombre}</span> está siendo preparado
            con todo el cuidado que se merece.
          </p>

          <p className={styles.mensaje}>
            Mientras tanto, puedes avanzar con los cursos disponibles.
          </p>

          <div className={styles.ctas}>
            <Link to="/plan" className={styles.ctaSecundario}>
              ← Plan de estudios
            </Link>
            <Link to="/pilar0" className={styles.ctaPrimario}>
              Comenzar desde Fundamentos →
            </Link>
          </div>

        </div>
      </div>
    </Layout>
  );
}
