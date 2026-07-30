'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export default function ThreeGraphic() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(0, 0, 4.5);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Group to hold the 3D Bust Model
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);

    // --- Dramatic Monochrome Lighting (Chiaroscuro Studio Lighting) ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    // Strong key light (top-left) for dramatic facial contours
    const keyLight = new THREE.DirectionalLight(0xffffff, 4.0);
    keyLight.position.set(5, 8, 6);
    scene.add(keyLight);

    // Cool fill light (bottom-right)
    const fillLight = new THREE.DirectionalLight(0xffffff, 1.5);
    fillLight.position.set(-5, -4, -3);
    scene.add(fillLight);

    // Subtle rim light (behind model) for sharp edge highlights
    const rimLight = new THREE.DirectionalLight(0xffffff, 2.5);
    rimLight.position.set(0, 5, -5);
    scene.add(rimLight);

    // --- Material for Classical Marble / Sculpted Obsidian ---
    const statueMaterial = new THREE.MeshStandardMaterial({
      color: 0x0f0f0f,
      roughness: 0.25,
      metalness: 0.75,
      wireframe: false,
    });

    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.08,
    });

    // --- Load GLTF Bust Model ---
    let bustMesh: THREE.Object3D | null = null;
    const loader = new GLTFLoader();

    loader.load(
      '/models/bust.glb',
      (gltf) => {
        const model = gltf.scene;

        // Traverse and apply high-contrast material
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.material = statueMaterial;

            // Optional wireframe clone overlay for tech-classical hybrid aesthetic
            const wireClone = mesh.clone();
            wireClone.material = wireframeMaterial;
            wireClone.scale.setScalar(1.005);
            modelGroup.add(wireClone);
          }
        });

        // Center and scale model
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        model.position.sub(center); // center model at origin
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 2.2 / maxDim;
        modelGroup.scale.setScalar(scale);

        modelGroup.add(model);
        bustMesh = modelGroup;
      },
      undefined,
      (error) => {
        console.warn('Fallback to procedural geometry:', error);
        // Fallback procedural sculpture (Faceted TorusKnot + Octahedron)
        const geo = new THREE.IcosahedronGeometry(1.2, 2);
        const mesh = new THREE.Mesh(geo, statueMaterial);
        modelGroup.add(mesh);
        bustMesh = modelGroup;
      }
    );

    // --- Mouse & Touch Rotation Interaction ---
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (event.touches.length > 0) {
        const rect = container.getBoundingClientRect();
        mouseX = ((event.touches[0].clientX - rect.left) / rect.width) * 2 - 1;
        mouseY = -((event.touches[0].clientY - rect.top) / rect.height) * 2 + 1;
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    // --- Animation Loop ---
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse lerp
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      if (modelGroup) {
        // Keep position firmly fixed at origin (NO floating bobbing effect)
        modelGroup.position.y = 0;

        // Smooth horizontal rotation (Y-axis - full 360 rotation + mouse influence)
        modelGroup.rotation.y = elapsedTime * 0.35 + targetX * 1.2;

        // Vertical tilt (X-axis) restricted with non-linear spring resistance (max ~10 degrees / 0.18 rads)
        const maxVerticalAngle = 0.18;
        const rawX = -targetY * 0.3;
        // Math.tanh provides smooth natural resistance at upper/lower limits
        modelGroup.rotation.x = Math.tanh(rawX) * maxVerticalAngle;
      }

      renderer.render(scene, camera);
    };

    animate();

    // --- Resize Handler ---
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      statueMaterial.dispose();
      wireframeMaterial.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-[320px] md:h-[400px] lg:h-[480px] relative pointer-events-auto cursor-grab active:cursor-grabbing select-none"
    />
  );
}
