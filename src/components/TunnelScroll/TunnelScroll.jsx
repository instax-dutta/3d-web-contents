// src/components/TunnelScroll/TunnelScroll.jsx
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useThreeScene } from '../../hooks/useThreeScene';
import './TunnelScroll.css';

export default function TunnelScroll({
  ringCount = 40,
  colorA = '#00ffff',
  colorB = '#ff00ff',
  trailOpacity = 0.15,
  scrollContainer = null
}) {
  const sectionRef = useRef(null);
  const stickyRef = useRef(null);
  const canvasRef = useRef(null);
  
  const scrollProgressRef = useRef(0);
  const ringsRef = useRef([]);
  const trailSceneRef = useRef(new THREE.Scene());
  const trailCameraRef = useRef(new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1));
  const trailPlaneRef = useRef(null);

  const getScrollProgress = () => {
    if (!sectionRef.current) return 0;
    
    if (scrollContainer && scrollContainer.current) {
      const target = scrollContainer.current;
      const scrollTop = target.scrollTop;
      const sectionTop = sectionRef.current.offsetTop;
      const sectionHeight = sectionRef.current.offsetHeight;
      const containerHeight = target.clientHeight;
      const scrollRange = sectionHeight - containerHeight;
      if (scrollRange <= 0) return 0;
      return Math.max(0, Math.min(1, (scrollTop - sectionTop) / scrollRange));
    } else {
      const rect = sectionRef.current.getBoundingClientRect();
      const sectionHeight = sectionRef.current.offsetHeight;
      const totalScrollRange = sectionHeight - window.innerHeight;
      if (totalScrollRange <= 0) return 0;
      const currentScrolled = -rect.top;
      return Math.max(0, Math.min(1, currentScrolled / totalScrollRange));
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      scrollProgressRef.current = getScrollProgress();
    };

    const target = scrollContainer?.current || window;
    target.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      target.removeEventListener('scroll', handleScroll);
    };
  }, [scrollContainer]);

  const setup = (scene, camera, renderer) => {
    renderer.autoClear = false;

    const trailPlaneMat = new THREE.MeshBasicMaterial({
      color: 0x0a0a0a,
      opacity: trailOpacity,
      transparent: true,
      depthTest: false
    });
    const trailPlane = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), trailPlaneMat);
    trailSceneRef.current.add(trailPlane);
    trailPlaneRef.current = trailPlane;

    const rings = [];
    const ringGeom = new THREE.TorusGeometry(20, 0.9, 8, 36);
    
    // Mark geometry as shared to avoid double disposal warnings
    ringGeom.userData.shared = true;

    const cA = new THREE.Color(colorA);
    const cB = new THREE.Color(colorB);

    for (let i = 0; i < ringCount; i++) {
      const progress = i / (ringCount - 1 || 1);
      const ringColor = new THREE.Color().lerpColors(cA, cB, progress);
      const mat = new THREE.MeshBasicMaterial({
        color: ringColor,
        wireframe: true
      });
      const ring = new THREE.Mesh(ringGeom, mat);
      
      ring.position.set(0, 0, 800 - i * 20.5);
      ring.rotation.z = i * 0.1;
      
      scene.add(ring);
      rings.push(ring);
    }
    ringsRef.current = rings;

    // Exclude shared ringGeom from geometries list
    return {
      geometries: [trailPlane.geometry],
      materials: [...rings.map(r => r.material), trailPlaneMat]
    };
  };

  const animate = (scene, camera, renderer, { time, delta }) => {
    camera.position.z = 830 - scrollProgressRef.current * 880;

    ringsRef.current.forEach((ring, idx) => {
      ring.rotation.z += 0.004 * (idx % 2 === 0 ? 1 : -1);
    });

    renderer.clear(false, true, true);
    renderer.render(trailSceneRef.current, trailCameraRef.current);
    renderer.render(scene, camera);
  };

  useThreeScene({
    canvasRef,
    setup,
    animate,
    deps: [ringCount, colorA, colorB, trailOpacity]
  });

  return (
    <div className="tunnelscroll-section" ref={sectionRef}>
      <div className="tunnelscroll-sticky" ref={stickyRef}>
        <div className="tunnelscroll-label">Section 5 — Scroll-driven Three.js Camera Tunnel</div>
        <canvas className="tunnelscroll-canvas" ref={canvasRef} />
      </div>
    </div>
  );
}
