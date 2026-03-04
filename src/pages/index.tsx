import React from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';

export default function Home(): React.JSX.Element {
  const {siteConfig} = useDocusaurusContext();

  return (
    <Layout
      title="Universidad Nexus"
      description="Programa de Upskilling para Analistas de Datos">
      <div className="hero-container">

        <div className="hero-badge">Universidad Nexus · Programa 2025</div>

        <h1 className="hero-title">
          De analista a<br />
          <span>experto en datos</span>
        </h1>

        <p className="hero-subtitle">
          Un programa de 9 meses diseñado para transformar la forma en que tu equipo piensa, trabaja y decide con datos.
        </p>

        <div className="hero-pills">
          <span className="hero-pill">SQL</span>
          <span className="hero-pill">Python · Spark</span>
          <span className="hero-pill">Databricks</span>
          <span className="hero-pill">GitHub</span>
          <span className="hero-pill">Power BI</span>
          <span className="hero-pill">IA Aplicada</span>
        </div>

        <div className="hero-buttons">
          <Link className="hero-cta" to="/intro">
            Comenzar el programa →
          </Link>
          <Link className="hero-cta-secondary" to="/plan">
          Ver plan de estudios
          </Link>

        </div>

        <div className="hero-stats">
          <div className="hero-stat">
            <div className="hero-stat-number">9</div>
            <div className="hero-stat-label">Meses</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-number">6</div>
            <div className="hero-stat-label">Pilares</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-number">15</div>
            <div className="hero-stat-label">Analistas</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-number">∞</div>
            <div className="hero-stat-label">Impacto</div>
          </div>
        </div>

      </div>
    </Layout>
  );
}