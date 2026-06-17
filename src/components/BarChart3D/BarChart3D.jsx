// src/components/BarChart3D/BarChart3D.jsx
import React, { useRef } from 'react';
import './BarChart3D.css';

export default function BarChart3D({ data }) {
  const containerRef = useRef(null);
  const wrapperRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!wrapperRef.current || !containerRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    containerRef.current.style.setProperty('--tilt-x', `${-y * 35}deg`);
    containerRef.current.style.setProperty('--tilt-y', `${x * 35}deg`);
  };

  const handleMouseLeave = () => {
    if (!containerRef.current) return;
    containerRef.current.style.setProperty('--tilt-x', '0deg');
    containerRef.current.style.setProperty('--tilt-y', '0deg');
  };

  const hexToRgba = (hex, alpha) => {
    if (!hex || !hex.startsWith('#')) return `rgba(255, 255, 255, ${alpha})`;
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  return (
    <div className="barchart3d-section">
      <div className="barchart3d-section-label">Section 4 — Pure CSS/SVG 3D Bar Chart</div>
      <div 
        className="barchart3d-container-wrapper"
        ref={wrapperRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className="barchart3d-container" ref={containerRef}>
          {data.map((item, index) => {
            const colorGlow = hexToRgba(item.color, 0.4);
            const colorGlowDark = hexToRgba(item.color, 0.15);
            return (
              <div 
                key={index} 
                className="barchart3d-bar"
                style={{
                  '--height': `${item.value}px`,
                  '--delay': `${index * 0.1}s`,
                  '--color': item.color,
                  '--color-glow': colorGlow,
                  '--color-glow-dark': colorGlowDark
                }}
              >
                <div className="barchart3d-face barchart3d-front">
                  <span className="barchart3d-val-front">{item.value}</span>
                </div>
                <div className="barchart3d-face barchart3d-back"></div>
                <div className="barchart3d-face barchart3d-left"></div>
                <div className="barchart3d-face barchart3d-right"></div>
                <div className="barchart3d-face barchart3d-top">
                  <span className="barchart3d-val-top">{item.value}</span>
                </div>
                <div className="barchart3d-label">{item.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
