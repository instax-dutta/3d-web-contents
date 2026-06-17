// src/components/LightingReflection/LightingReflection.jsx
import React, { useRef } from 'react';
import * as THREE from 'three';
import { useThreeScene } from '../../hooks/useThreeScene';
import './LightingReflection.css';

export default function LightingReflection({
  lightColor = '#00ffff',
  metalness = 1.0,
  roughness = 0.1
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  
  const mouseRef = useRef(new THREE.Vector2(0, 0));
  const pointLightRef = useRef(null);
  const lightGlowRef = useRef(null);
  const reflCameraRef = useRef(null);
  const renderTargetRef = useRef(null);
  const floorRef = useRef(null);
  const glowMatRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  };

  const setup = (scene, camera, renderer) => {
    camera.position.set(0, 25, 65);
    camera.lookAt(0, 0, 0);

    const floorY = -12;
    
    const renderTarget = new THREE.WebGLRenderTarget(512, 512, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBFormat
    });
    renderTargetRef.current = renderTarget;

    const reflCamera = new THREE.PerspectiveCamera(40, 1, 1, 1000);
    reflCameraRef.current = reflCamera;

    const sphereGeom = new THREE.SphereGeometry(10, 48, 48);
    const metalMat = new THREE.MeshStandardMaterial({
      color: 0x222222,
      metalness: metalness,
      roughness: roughness
    });
    const sphere = new THREE.Mesh(sphereGeom, metalMat);
    scene.add(sphere);

    const glowGeom = new THREE.SphereGeometry(10.6, 48, 48);
    const glowMat = new THREE.MeshBasicMaterial({
      color: lightColor,
      transparent: true,
      opacity: 0.16,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide
    });
    glowMatRef.current = glowMat;
    const glowSphere = new THREE.Mesh(glowGeom, glowMat);
    scene.add(glowSphere);

    const ambient = new THREE.AmbientLight(0xffffff, 0.05);
    scene.add(ambient);

    const pointLight = new THREE.PointLight(lightColor, 2.5, 300);
    scene.add(pointLight);
    pointLightRef.current = pointLight;

    const lightGlow = new THREE.Mesh(
      new THREE.SphereGeometry(1.2, 16, 16),
      new THREE.MeshBasicMaterial({ color: lightColor })
    );
    scene.add(lightGlow);
    lightGlowRef.current = lightGlow;

    const floorGeom = new THREE.PlaneGeometry(200, 200);
    const floorMat = new THREE.ShaderMaterial({
      uniforms: {
        tDiffuse: { value: renderTarget.texture }
      },
      vertexShader: `
        varying vec4 vUv;
        void main() {
          vUv = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          gl_Position = vUv;
        }
      `,
      fragmentShader: `
        uniform sampler2D tDiffuse;
        varying vec4 vUv;
        void main() {
          vec2 uv = (vUv.xy / vUv.w) * 0.5 + 0.5;
          vec4 texColor = texture2D(tDiffuse, uv);
          gl_FragColor = mix(vec4(0.04, 0.04, 0.04, 1.0), texColor, 0.45);
        }
      `
    });
    const floor = new THREE.Mesh(floorGeom, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = floorY;
    scene.add(floor);
    floorRef.current = floor;

    return {
      geometries: [sphereGeom, glowGeom, floorGeom, lightGlow.geometry],
      materials: [metalMat, glowMat, lightGlow.material, floorMat],
      targets: [renderTarget]
    };
  };

  const animate = (scene, camera, renderer, { time, delta }) => {
    if (!pointLightRef.current || !reflCameraRef.current || !renderTargetRef.current || !floorRef.current) return;

    const floorY = -12;
    const pointLight = pointLightRef.current;
    const lightGlow = lightGlowRef.current;
    const reflCamera = reflCameraRef.current;
    const renderTarget = renderTargetRef.current;
    const floor = floorRef.current;

    pointLight.position.x = mouseRef.current.x * 45;
    pointLight.position.y = mouseRef.current.y * 35;
    pointLight.position.z = 20 + Math.sin(time) * 10;
    lightGlow.position.copy(pointLight.position);

    const baseColor = new THREE.Color(lightColor);
    const hsl = {};
    baseColor.getHSL(hsl);
    
    const shiftHue = (hsl.h + time * 0.05) % 1.0;
    pointLight.color.setHSL(shiftHue, hsl.s, hsl.l);
    lightGlow.material.color.setHSL(shiftHue, hsl.s, hsl.l);
    if (glowMatRef.current) {
      glowMatRef.current.color.setHSL((shiftHue + 0.5) % 1.0, hsl.s, hsl.l);
    }

    reflCamera.aspect = camera.aspect;
    reflCamera.updateProjectionMatrix();

    floor.visible = false;
    reflCamera.position.set(camera.position.x, 2 * floorY - camera.position.y, camera.position.z);
    reflCamera.up.set(0, -1, 0);
    reflCamera.lookAt(0, floorY, 0);

    renderer.setRenderTarget(renderTarget);
    renderer.render(scene, reflCamera);
    renderer.setRenderTarget(null);
    floor.visible = true;

    renderer.render(scene, camera);
  };

  useThreeScene({
    canvasRef,
    setup,
    animate,
    deps: [lightColor, metalness, roughness]
  });

  return (
    <div 
      className="lightrefl-container" 
      ref={containerRef}
      onMouseMove={handleMouseMove}
    >
      <div className="lightrefl-label">Section 3 — Three.js Lighting + Fake Reflection</div>
      <canvas className="lightrefl-canvas" ref={canvasRef} />
    </div>
  );
}
