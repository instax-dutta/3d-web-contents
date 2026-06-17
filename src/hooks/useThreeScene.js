// src/hooks/useThreeScene.js
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function useThreeScene({ canvasRef, setup, animate, deps = [] }) {
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const animationFrameIdRef = useRef(null);
  const isVisibleRef = useRef(true);

  // Track resources for disposal
  const resourcesRef = useRef({
    geometries: [],
    materials: [],
    textures: [],
    targets: []
  });

  useEffect(() => {
    if (!canvasRef.current) return;
    const container = canvasRef.current.parentElement;
    if (!container) return;

    // 1. Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    // 2. Call user setup function to initialize materials, geometries, etc.
    const userResources = setup(scene, camera, renderer);
    if (userResources) {
      if (userResources.geometries) resourcesRef.current.geometries.push(...userResources.geometries);
      if (userResources.materials) resourcesRef.current.materials.push(...userResources.materials);
      if (userResources.textures) resourcesRef.current.textures.push(...userResources.textures);
      if (userResources.targets) resourcesRef.current.targets.push(...userResources.targets);
    }

    // 3. Resize handling with ResizeObserver on container div
    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const { width, height } = entries[0].contentRect;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    });
    resizeObserver.observe(container);

    // 4. Viewport visibility handling with IntersectionObserver
    const intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isVisibleRef.current = entry.isIntersecting;
      });
    }, { threshold: 0.05 });
    intersectionObserver.observe(container);

    // 5. Animation loop
    const clock = new THREE.Clock();
    const tick = () => {
      animationFrameIdRef.current = requestAnimationFrame(tick);
      
      // Pause animation if element is not in viewport
      if (!isVisibleRef.current) return;

      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      animate(scene, camera, renderer, { time, delta });
    };
    tick();

    // 6. Complete cleanup on unmount
    return () => {
      cancelAnimationFrame(animationFrameIdRef.current);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();

      // Dispose geometries
      resourcesRef.current.geometries.forEach(g => {
        if (g && typeof g.dispose === 'function') g.dispose();
      });
      // Dispose materials
      resourcesRef.current.materials.forEach(m => {
        if (!m) return;
        if (Array.isArray(m)) {
          m.forEach(subM => subM && typeof subM.dispose === 'function' && subM.dispose());
        } else if (typeof m.dispose === 'function') {
          m.dispose();
        }
      });
      // Dispose textures
      resourcesRef.current.textures.forEach(t => {
        if (t && typeof t.dispose === 'function') t.dispose();
      });
      // Dispose WebGLRenderTargets
      resourcesRef.current.targets.forEach(t => {
        if (t && typeof t.dispose === 'function') t.dispose();
      });

      // Clear scene references and dispose remaining meshes, avoiding double-dispose on shared geometries
      const sharedGeometries = new Set();
      scene.traverse((object) => {
        if (object.geometry) {
          if (object.geometry.userData && object.geometry.userData.shared === true) {
            sharedGeometries.add(object.geometry);
          } else if (typeof object.geometry.dispose === 'function') {
            object.geometry.dispose();
          }
        }
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach((mat) => mat && typeof mat.dispose === 'function' && mat.dispose());
          } else if (typeof object.material.dispose === 'function') {
            object.material.dispose();
          }
        }
      });

      // Dispose shared geometries exactly once
      sharedGeometries.forEach(g => {
        if (g && typeof g.dispose === 'function') g.dispose();
      });

      renderer.dispose();

      // Clear refs
      sceneRef.current = null;
      cameraRef.current = null;
      rendererRef.current = null;
      resourcesRef.current = { geometries: [], materials: [], textures: [], targets: [] };
    };
  }, deps);

  return { sceneRef, cameraRef, rendererRef };
}
