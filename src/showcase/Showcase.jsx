// src/showcase/Showcase.jsx
import React from 'react';
import CSS3DCard from '../components/CSS3DCard';
import GeometryRepel from '../components/GeometryRepel';
import LightingReflection from '../components/LightingReflection';
import BarChart3D from '../components/BarChart3D';
import TunnelScroll from '../components/TunnelScroll';
import './Showcase.css';

export default function Showcase() {
  const chartData = [
    { label: 'JAN', value: 140, color: '#00ffff' },
    { label: 'FEB', value: 190, color: '#ff00ff' },
    { label: 'MAR', value: 90, color: '#00ffff' },
    { label: 'APR', value: 220, color: '#ff00ff' },
    { label: 'MAY', value: 160, color: '#00ffff' },
    { label: 'JUN', value: 120, color: '#ff00ff' }
  ];

  return (
    <div className="showcase-container">
      {/* Section 1: CSS 3D Card */}
      <section className="showcase-section">
        <div className="showcase-label">Section 1 — CSS 3D Transform Scene</div>
        <CSS3DCard 
          title="NEXUS DRIVE"
          description="Accelerated neural computation cores equipped with liquid state quantum-dot memory structures."
          badge="QUANTUM"
          accentColor="#00ffff"
        />
      </section>

      {/* Section 2: Geometry Repel */}
      <GeometryRepel count={12} repelRadius={150} />

      {/* Section 3: Lighting Reflection */}
      <LightingReflection lightColor="#00ffff" metalness={1.0} roughness={0.1} />

      {/* Section 4: Bar Chart 3D */}
      <BarChart3D data={chartData} />

      {/* Section 5: Tunnel Scroll */}
      <TunnelScroll 
        ringCount={40}
        colorA="#00ffff"
        colorB="#ff00ff"
        trailOpacity={0.18}
      />
    </div>
  );
}
