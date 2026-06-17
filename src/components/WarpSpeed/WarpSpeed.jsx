// src/components/WarpSpeed/WarpSpeed.jsx
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useThreeScene } from '../../hooks/useThreeScene';
import './WarpSpeed.css';

export default function WarpSpeed({
  count = 2000,
  color = '#ffffff',
  speed = 1.0,
  scrollDriven = false,
  maxStreak = 3.0
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const lastScrollYRef = useRef(0);
  const scrollDeltaRef = useRef(0);
  const currentSpeedMultiplierRef = useRef(1.0);

  const pointsRef = useRef(null);
  const linesRef = useRef(null);

  useEffect(() => {
    if (!scrollDriven) {
      currentSpeedMultiplierRef.current = 1.0;
      return;
    }
    lastScrollYRef.current = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollYRef.current;
      scrollDeltaRef.current = delta;
      lastScrollYRef.current = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrollDriven]);

  const setup = (scene, camera, renderer) => {
    camera.fov = 60;
    camera.position.set(0, 0, 0);
    camera.lookAt(0, 0, -1);
    camera.updateProjectionMatrix();

    // Pure black background, no alpha
    scene.background = new THREE.Color('#000000');

    const pointsGeometry = new THREE.BufferGeometry();
    const pointsPositions = new Float32Array(count * 3);

    const linesGeometry = new THREE.BufferGeometry();
    const linesPositions = new Float32Array(count * 2 * 3);

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 80;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      const z = Math.random() * -500;

      pointsPositions[i * 3] = x;
      pointsPositions[i * 3 + 1] = y;
      pointsPositions[i * 3 + 2] = z;

      linesPositions[i * 6] = x;
      linesPositions[i * 6 + 1] = y;
      linesPositions[i * 6 + 2] = z;
      linesPositions[i * 6 + 3] = x;
      linesPositions[i * 6 + 4] = y;
      linesPositions[i * 6 + 5] = z;
    }

    pointsGeometry.setAttribute('position', new THREE.BufferAttribute(pointsPositions, 3));
    linesGeometry.setAttribute('position', new THREE.BufferAttribute(linesPositions, 3));

    const pointsMaterial = new THREE.PointsMaterial({
      size: 1.2,
      color: new THREE.Color(color),
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true
    });

    const linesMaterial = new THREE.LineBasicMaterial({
      color: new THREE.Color(color),
      transparent: true,
      opacity: 0.0
    });

    const points = new THREE.Points(pointsGeometry, pointsMaterial);
    const lines = new THREE.LineSegments(linesGeometry, linesMaterial);

    scene.add(points);
    scene.add(lines);

    pointsRef.current = points;
    linesRef.current = lines;

    return {
      geometries: [pointsGeometry, linesGeometry],
      materials: [pointsMaterial, linesMaterial]
    };
  };

  const animate = (scene, camera, renderer, { time, delta }) => {
    let speedMultiplier = 1.0;
    if (scrollDriven) {
      const scrollDelta = scrollDeltaRef.current;
      scrollDeltaRef.current = 0;
      const scrollMagnitude = Math.abs(scrollDelta) * 0.05;
      const targetSpeedMult = scrollMagnitude > 0.01
        ? Math.min(3.0, scrollMagnitude)
        : 1.0;
      currentSpeedMultiplierRef.current += (targetSpeedMult - currentSpeedMultiplierRef.current) * 0.1;
      speedMultiplier = currentSpeedMultiplierRef.current;
    } else {
      speedMultiplier = 1.0;
    }

    const currSpeed = speed * speedMultiplier;

    const points = pointsRef.current;
    const lines = linesRef.current;

    if (points && lines) {
      const pointsGeo = points.geometry;
      const pointsPos = pointsGeo.attributes.position.array;

      const linesGeo = lines.geometry;
      const linesPos = linesGeo.attributes.position.array;

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const i6 = i * 6;

        let x = pointsPos[i3];
        let y = pointsPos[i3 + 1];
        let z = pointsPos[i3 + 2];

        z += currSpeed * delta * 60;

        if (z > 5) {
          const angle = Math.random() * Math.PI * 2;
          const radius = Math.random() * 80;
          x = Math.cos(angle) * radius;
          y = Math.sin(angle) * radius;
          z = -500;
        }

        pointsPos[i3] = x;
        pointsPos[i3 + 1] = y;
        pointsPos[i3 + 2] = z;

        const streakLength = currSpeed * maxStreak * Math.abs(z) * 0.01;

        linesPos[i6] = x;
        linesPos[i6 + 1] = y;
        linesPos[i6 + 2] = z;
        linesPos[i6 + 3] = x;
        linesPos[i6 + 4] = y;
        linesPos[i6 + 5] = z - streakLength;
      }

      pointsGeo.attributes.position.needsUpdate = true;
      linesGeo.attributes.position.needsUpdate = true;

      // Lerp opacities
      let targetPointsOpacity = 0.8;
      let targetLinesOpacity = 0.0;

      if (speedMultiplier >= 0.3) {
        const factor = Math.min(1.0, (speedMultiplier - 0.3) / 1.0);
        targetPointsOpacity = Math.max(0.0, 0.8 * (1.0 - factor));
        targetLinesOpacity = Math.min(0.6, 0.6 * factor);
      }

      points.material.opacity += (targetPointsOpacity - points.material.opacity) * 0.1;
      lines.material.opacity += (targetLinesOpacity - lines.material.opacity) * 0.1;
    }

    renderer.render(scene, camera);
  };

  useThreeScene({
    canvasRef,
    setup,
    animate,
    deps: [count, color, speed, scrollDriven, maxStreak]
  });

  return (
    <div
      className="warpspeed-container"
      ref={containerRef}
    >
      <div className="warpspeed-label">Section 8 — Warp Speed Starfield</div>
      <canvas className="warpspeed-canvas" ref={canvasRef} />
    </div>
  );
}
