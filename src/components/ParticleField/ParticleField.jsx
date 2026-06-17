// src/components/ParticleField/ParticleField.jsx
import React, { useRef } from 'react';
import * as THREE from 'three';
import { useThreeScene } from '../../hooks/useThreeScene';
import './ParticleField.css';

export default function ParticleField({
  count = 3000,
  color = '#00ffff',
  size = 0.8,
  mouseRadius = 100,
  speed = 0.3
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const mouseRef = useRef(new THREE.Vector2(-9999, -9999));
  const mouseWorldRef = useRef(new THREE.Vector3());
  const raycasterRef = useRef(new THREE.Raycaster());

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  };

  const handleMouseLeave = () => {
    mouseRef.current.set(-9999, -9999);
  };

  const setup = (scene, camera, renderer) => {
    camera.fov = 75;
    camera.position.z = 150;
    camera.updateProjectionMatrix();

    scene.background = new THREE.Color('#0a0a0a');

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const homePositions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const currentVelocities = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 400;
      const y = (Math.random() - 0.5) * 300;
      const z = (Math.random() - 0.5) * 200;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      homePositions[i * 3] = x;
      homePositions[i * 3 + 1] = y;
      homePositions[i * 3 + 2] = z;

      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() - 0.5) * 2);
      const r = Math.random() * 0.15;

      velocities[i * 3] = Math.sin(phi) * Math.cos(theta) * r;
      velocities[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * r;
      velocities[i * 3 + 2] = Math.cos(phi) * r;

      currentVelocities[i * 3] = 0;
      currentVelocities[i * 3 + 1] = 0;
      currentVelocities[i * 3 + 2] = 0;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.userData = {
      homePositions,
      velocities,
      currentVelocities
    };

    const material = new THREE.PointsMaterial({
      size: size,
      color: new THREE.Color(color),
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    return {
      geometries: [geometry],
      materials: [material]
    };
  };

  const animate = (scene, camera, renderer, { time, delta }) => {
    const mouseActive = mouseRef.current.x > -9000;
    if (mouseActive) {
      raycasterRef.current.setFromCamera(mouseRef.current, camera);
      const ray = raycasterRef.current.ray;
      if (Math.abs(ray.direction.z) > 0.0001) {
        const dist = -camera.position.z / ray.direction.z;
        ray.at(dist, mouseWorldRef.current);
      } else {
        mouseWorldRef.current.set(-9999, -9999, 0);
      }
    } else {
      mouseWorldRef.current.set(-9999, -9999, 0);
    }

    let points = null;
    scene.children.forEach(child => {
      if (child instanceof THREE.Points) {
        points = child;
      }
    });

    if (points) {
      const geometry = points.geometry;
      const positions = geometry.attributes.position.array;
      const home = geometry.userData.homePositions;
      const drift = geometry.userData.velocities;
      const currVel = geometry.userData.currentVelocities;

      const mWorld = mouseWorldRef.current;
      const isMouseIn = mouseActive && mWorld.x > -9000;

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        let px = positions[i3];
        let py = positions[i3 + 1];
        let pz = positions[i3 + 2];

        const hx = home[i3];
        const hy = home[i3 + 1];
        const hz = home[i3 + 2];

        const dx_drift = drift[i3] * speed;
        const dy_drift = drift[i3 + 1] * speed;
        const dz_drift = drift[i3 + 2] * speed;

        let vx = currVel[i3];
        let vy = currVel[i3 + 1];
        let vz = currVel[i3 + 2];

        vx += dx_drift;
        vy += dy_drift;
        vz += dz_drift;

        if (isMouseIn) {
          const mx = px - mWorld.x;
          const my = py - mWorld.y;
          const mz = pz - mWorld.z;
          const dist = Math.sqrt(mx * mx + my * my + mz * mz);

          if (dist < mouseRadius) {
            const force = ((mouseRadius - dist) / mouseRadius) * 2.5;
            const dirX = mx / (dist || 1);
            const dirY = my / (dist || 1);
            const dirZ = mz / (dist || 1);
            vx += dirX * force;
            vy += dirY * force;
            vz += dirZ * force;
          }
        }

        vx += (hx - px) * 0.002;
        vy += (hy - py) * 0.002;
        vz += (hz - pz) * 0.002;

        vx *= 0.92;
        vy *= 0.92;
        vz *= 0.92;

        positions[i3] = px + vx;
        positions[i3 + 1] = py + vy;
        positions[i3 + 2] = pz + vz;

        currVel[i3] = vx;
        currVel[i3 + 1] = vy;
        currVel[i3 + 2] = vz;
      }

      geometry.attributes.position.needsUpdate = true;
    }

    renderer.render(scene, camera);
  };

  useThreeScene({
    canvasRef,
    setup,
    animate,
    deps: [count, color, size, mouseRadius, speed]
  });

  return (
    <div
      className="particlefield-container"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="particlefield-label">Section 6 — Particle Field + Mouse Interaction</div>
      <canvas className="particlefield-canvas" ref={canvasRef} />
    </div>
  );
}
