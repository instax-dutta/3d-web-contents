// src/components/GeometryRepel/GeometryRepel.jsx
import React, { useRef } from 'react';
import * as THREE from 'three';
import { useThreeScene } from '../../hooks/useThreeScene';
import './GeometryRepel.css';

export default function GeometryRepel({ count = 12, repelRadius = 150 }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const mouseRef = useRef(new THREE.Vector2(-9999, -9999));
  const mouseWorldRef = useRef(new THREE.Vector3());
  const planeZRef = useRef(new THREE.Plane(new THREE.Vector3(0, 0, 1), 0));
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
    camera.position.z = 250;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(100, 100, 100);
    scene.add(dirLight);

    const shapes = [];
    const geometries = [
      new THREE.IcosahedronGeometry(13, 0),
      new THREE.TorusGeometry(10, 3.2, 8, 24),
      new THREE.OctahedronGeometry(13, 0)
    ];

    // Mark geometries as shared to avoid double disposal warnings
    geometries.forEach(geom => {
      geom.userData.shared = true;
    });

    const materials = [];

    for (let i = 0; i < count; i++) {
      const geom = geometries[i % 3];
      const color = new THREE.Color().setHSL(i / count, 0.8, 0.5);
      
      const mat = new THREE.MeshPhongMaterial({
        color: color,
        shininess: 80,
        flatShading: true,
        transparent: true,
        opacity: 0.8
      });
      materials.push(mat);

      const mesh = new THREE.Mesh(geom, mat);

      const wireMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: true,
        transparent: true,
        opacity: 0.15
      });
      materials.push(wireMat);

      const wire = new THREE.Mesh(geom, wireMat);
      wire.scale.multiplyScalar(1.02);

      const group = new THREE.Group();
      group.add(mesh);
      group.add(wire);

      const rx = (Math.random() - 0.5) * 280;
      const ry = (Math.random() - 0.5) * 180;
      const rz = (Math.random() - 0.5) * 80;
      group.position.set(rx, ry, rz);

      group.userData = {
        homeX: rx,
        homeY: ry,
        homeZ: rz,
        rotX: (Math.random() - 0.5) * 0.015,
        rotY: (Math.random() - 0.5) * 0.015,
        rotZ: (Math.random() - 0.5) * 0.015,
        vx: 0, vy: 0, vz: 0
      };

      scene.add(group);
      shapes.push(group);
    }

    // Exclude shared geometries from geometries list
    return {
      materials: materials,
      meshes: shapes
    };
  };

  const animate = (scene, camera, renderer, { time, delta }) => {
    if (mouseRef.current.x > -9000) {
      raycasterRef.current.setFromCamera(mouseRef.current, camera);
      raycasterRef.current.ray.intersectPlane(planeZRef.current, mouseWorldRef.current);
    } else {
      mouseWorldRef.current.set(-9999, -9999, 0);
    }

    scene.children.forEach(child => {
      if (child instanceof THREE.Group && child.userData.homeX !== undefined) {
        let dx = child.position.x - mouseWorldRef.current.x;
        let dy = child.position.y - mouseWorldRef.current.y;
        let dz = child.position.z - mouseWorldRef.current.z;
        let dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < repelRadius && mouseWorldRef.current.x > -9000) {
          let force = (repelRadius - dist) / repelRadius;
          child.userData.vx += (dx / (dist || 1)) * force * 1.8;
          child.userData.vy += (dy / (dist || 1)) * force * 1.8;
          child.userData.vz += (dz / (dist || 1)) * force * 1.8;
        }

        // Return home spring force
        child.userData.vx += (child.userData.homeX - child.position.x) * 0.04;
        child.userData.vy += (child.userData.homeY - child.position.y) * 0.04;
        child.userData.vz += (child.userData.homeZ - child.position.z) * 0.04;

        // Apply damping
        child.userData.vx *= 0.85;
        child.userData.vy *= 0.85;
        child.userData.vz *= 0.85;

        child.position.x += child.userData.vx;
        child.position.y += child.userData.vy;
        child.position.z += child.userData.vz;

        child.rotation.x += child.userData.rotX;
        child.rotation.y += child.userData.rotY;
        child.rotation.z += child.userData.rotZ;
      }
    });

    renderer.render(scene, camera);
  };

  useThreeScene({
    canvasRef,
    setup,
    animate,
    deps: [count, repelRadius]
  });

  return (
    <div 
      className="geomrepel-container" 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="geomrepel-label">Section 2 — Three.js Geometry + Mouse Repel</div>
      <canvas className="geomrepel-canvas" ref={canvasRef} />
    </div>
  );
}
