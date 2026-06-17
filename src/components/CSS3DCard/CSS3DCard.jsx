// src/components/CSS3DCard/CSS3DCard.jsx
import React, { useState } from 'react';
import './CSS3DCard.css';

export default function CSS3DCard({
  title,
  description,
  badge,
  accentColor = '#00ffff'
}) {
  const [clickRot, setClickRot] = useState(0);

  const handleClick = () => {
    setClickRot(prev => prev + 360);
  };

  const hexToRgba = (hex, alpha) => {
    if (!hex || !hex.startsWith('#')) return `rgba(0, 255, 255, ${alpha})`;
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const glowColor = hexToRgba(accentColor, 0.4);

  return (
    <div className="css3dcard-container">
      <div 
        className="css3dcard-card" 
        onClick={handleClick}
        style={{
          '--click-rot': `${clickRot}deg`,
          '--accent-color': accentColor,
          '--glow-color': glowColor
        }}
      >
        <div className="css3dcard-layer css3dcard-shadow"></div>
        <div className="css3dcard-layer css3dcard-background"></div>
        <div className="css3dcard-layer css3dcard-image">
          <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
        </div>
        <div className="css3dcard-layer css3dcard-text">
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
        <div className="css3dcard-layer css3dcard-badge">{badge}</div>
      </div>
    </div>
  );
}
