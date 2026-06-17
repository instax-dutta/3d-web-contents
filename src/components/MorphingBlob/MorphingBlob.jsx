// src/components/MorphingBlob/MorphingBlob.jsx
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useThreeScene } from '../../hooks/useThreeScene';
import './MorphingBlob.css';

export default function MorphingBlob({
  color = '#ff00ff',
  speed = 1.0,
  intensity = 0.4,
  wireframe = false,
  pulseOnHover = true
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const currentIntensityRef = useRef(intensity);
  const targetIntensityRef = useRef(intensity);
  const meshRef = useRef(null);

  useEffect(() => {
    currentIntensityRef.current = intensity;
    targetIntensityRef.current = intensity;
  }, [intensity]);

  const handleMouseEnter = () => {
    if (pulseOnHover) {
      targetIntensityRef.current = intensity * 2.5;
    }
  };

  const handleMouseLeave = () => {
    targetIntensityRef.current = intensity;
  };

  const setup = (scene, camera, renderer) => {
    camera.fov = 50;
    camera.position.z = 25;
    camera.updateProjectionMatrix();

    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    // Primary point light
    const pointLight1 = new THREE.PointLight(0xffffff, 1.5);
    pointLight1.position.set(30, 30, 30);
    scene.add(pointLight1);

    // Secondary colored point light
    const pointLight2 = new THREE.PointLight(new THREE.Color(color), 1.0);
    pointLight2.position.set(-30, -20, -30);
    scene.add(pointLight2);

    // Geometry
    const geometry = new THREE.SphereGeometry(8, 128, 128);
    geometry.userData.originalPositions = geometry.attributes.position.array.slice();

    // Material
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(color),
      metalness: 0.1,
      roughness: 0.4,
      wireframe: wireframe
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    meshRef.current = mesh;

    return {
      geometries: [geometry],
      materials: [material]
    };
  };

  const animate = (scene, camera, renderer, { time, delta }) => {
    const mesh = meshRef.current;
    if (mesh) {
      // Lerp intensity
      currentIntensityRef.current += (targetIntensityRef.current - currentIntensityRef.current) * 0.05;
      const currentIntensity = currentIntensityRef.current;

      const geometry = mesh.geometry;
      const pos = geometry.attributes.position;
      const orig = geometry.userData.originalPositions;
      const count = pos.count;

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const ox = orig[i3];
        const oy = orig[i3 + 1];
        const oz = orig[i3 + 2];

        const len = Math.sqrt(ox * ox + oy * oy + oz * oz) || 1;
        const nx = ox / len;
        const ny = oy / len;
        const nz = oz / len;

        const wave1 = Math.sin(time * speed * 1.2 + ox * 2.1) * currentIntensity;
        const wave2 = Math.sin(time * speed * 0.8 + oy * 1.7 + 1.5) * currentIntensity * 0.7;
        const wave3 = Math.sin(time * speed * 1.5 + oz * 2.4 + 3.1) * currentIntensity * 0.5;
        const disp = wave1 + wave2 + wave3;

        pos.array[i3] = ox + nx * disp;
        pos.array[i3 + 1] = oy + ny * disp;
        pos.array[i3 + 2] = oz + nz * disp;
      }

      pos.needsUpdate = true;
      geometry.computeVertexNormals();

      // Slow auto-rotation
      mesh.rotation.y += 0.003 * speed;
    }

    renderer.render(scene, camera);
  };

  useThreeScene({
    canvasRef,
    setup,
    animate,
    deps: [color, speed, intensity, wireframe, pulseOnHover]
  });

  return (
    <div
      className="morphingblob-container"
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="morphingblob-label">Section 7 — Morphing Blob + Sine Waves</div>
      <canvas className="morphingblob-canvas" ref={canvasRef} />
    </div>
  );
}
