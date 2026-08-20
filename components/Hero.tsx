'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { LiquidMetalButton } from '@/components/ui/liquid-metal-button';

// --- Shaders for the Paint-to-Reveal Mask (FBO) ---
const maskVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

// Shader that stamps a soft circle onto the mask texture at cursor position
const maskStampShader = `
  uniform sampler2D u_prevMask;
  uniform vec2 u_mouse;
  uniform vec2 u_resolution;
  uniform float u_brushSize;
  uniform float u_stamp; // 1.0 when stamping, 0.0 when not
  uniform float u_fade;  // fade factor per frame (< 1.0 to slowly close)
  varying vec2 vUv;

  void main() {
    vec4 prev = texture2D(u_prevMask, vUv);

    // Fade previous mask towards 0 (overlay closing back)
    float faded = prev.r * u_fade;

    // Stamp new reveal circle at cursor position
    vec2 aspectVec = vec2(u_resolution.x / u_resolution.y, 1.0);
    float dist = length((vUv - u_mouse) * aspectVec);
    float stamp = smoothstep(u_brushSize, u_brushSize * 0.3, dist) * u_stamp;

    // Combine: keep whichever is brighter (painted or faded)
    float mask = max(faded, stamp);

    gl_FragColor = vec4(mask, mask, mask, 1.0);
  }
`;

// --- Main Composite Shader (pixelated reveal) ---
const compositeVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const compositeFragmentShader = `
  uniform sampler2D u_image;   // overlay (white bg + RANDY text)
  uniform sampler2D u_video;   // video behind
  uniform sampler2D u_mask;    // painted reveal mask
  uniform vec2 u_resolution;
  uniform vec2 u_videoRes;
  uniform float u_time;
  varying vec2 vUv;

  void main() {
    // Pixelated grid sampling for the reveal transition
    float gridRes = 80.0;
    vec2 pixelUV = floor(vUv * gridRes) / gridRes + (0.5 / gridRes);

    // Sample the painted mask at pixel-grid resolution
    float maskVal = texture2D(u_mask, pixelUV).r;

    // Threshold: pixel blocks appear/disappear discretely
    float pixelMask = step(0.15, maskVal);

    // Calculate object-fit contain UVs so video scales down proportionally on mobile
    float screenAspect = u_resolution.x / u_resolution.y;
    float videoAspect = u_videoRes.x / u_videoRes.y;

    vec2 videoScale = vec2(1.0);
    if (screenAspect > videoAspect) {
      // Screen is wider than video -> fit video height
      videoScale = vec2(screenAspect / videoAspect, 1.0);
    } else {
      // Screen is taller than video (e.g. mobile) -> fit video width
      videoScale = vec2(1.0, videoAspect / screenAspect);
    }
    vec2 videoUV = (vUv - 0.5) * videoScale + 0.5;

    vec4 imgColor = texture2D(u_image, vUv);

    vec4 vidColor;
    if (videoUV.x >= 0.0 && videoUV.x <= 1.0 && videoUV.y >= 0.0 && videoUV.y <= 1.0) {
      vidColor = texture2D(u_video, videoUV);
      if (length(vidColor.rgb) < 0.02) {
        vidColor = vec4(0.08, 0.08, 0.12, 1.0);
      }
    } else {
      vidColor = vec4(0.08, 0.08, 0.12, 1.0);
    }

    // Blend: overlay on top, video revealed cleanly through solid pixel blocks
    vec4 finalColor = mix(imgColor, vidColor, pixelMask);

    gl_FragColor = finalColor;
  }
`;

// Generate canvas texture with giant "RANDY'" black text on white bg
// Canvas matches viewport aspect ratio to prevent text stretching
function createDefaultTextTexture(viewportWidth: number, viewportHeight: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  // Use a base resolution scaled to viewport aspect ratio
  const baseSize = 2048;
  const aspect = viewportWidth / viewportHeight;
  if (aspect >= 1) {
    canvas.width = baseSize;
    canvas.height = Math.round(baseSize / aspect);
  } else {
    canvas.width = Math.round(baseSize * aspect);
    canvas.height = baseSize;
  }
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#000000';
    // Scale font size relative to canvas width so it fits proportionally
    const fontSize = Math.round(canvas.width * 0.23);
    ctx.font = `900 ${fontSize}px "Inter", "Helvetica Neue", "Arial Black", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('RANDY\u0027', canvas.width / 2, canvas.height / 2);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const heroSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !videoRef.current) return;

    const container = containerRef.current;
    const video = videoRef.current;

    const startVideo = () => {
      video.play().catch((err) => {
        console.warn('Video play waiting for user interaction:', err);
      });
    };

    startVideo();

    // --- Renderer & Scene ---
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    // --- Textures ---
    const videoTexture = new THREE.VideoTexture(video);
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.magFilter = THREE.LinearFilter;
    videoTexture.format = THREE.RGBAFormat;

    let imageTexture: THREE.Texture = createDefaultTextTexture(window.innerWidth, window.innerHeight);
    let usingFallbackTexture = true;

    const loader = new THREE.TextureLoader();
    loader.load(
      '/layer1.jpg',
      (loadedTex) => {
        imageTexture = loadedTex;
        usingFallbackTexture = false;
        compositeMaterial.uniforms.u_image.value = imageTexture;
      },
      undefined,
      () => { }
    );

    // --- Ping-Pong FBO for Painted Reveal Mask ---
    const maskSize = 512;
    const createMaskTarget = () =>
      new THREE.WebGLRenderTarget(maskSize, maskSize, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
        type: THREE.UnsignedByteType,
      });

    let maskA = createMaskTarget();
    let maskB = createMaskTarget();

    const maskScene = new THREE.Scene();
    const maskCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const maskMaterial = new THREE.ShaderMaterial({
      vertexShader: maskVertexShader,
      fragmentShader: maskStampShader,
      uniforms: {
        u_prevMask: { value: maskA.texture },
        u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
        u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        u_brushSize: { value: 0.08 },
        u_stamp: { value: 0.0 },
        u_fade: { value: 1.0 }, // will be calculated per frame
      },
    });

    const maskQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), maskMaterial);
    maskScene.add(maskQuad);

    // --- Main Composite Quad ---
    const compositeMaterial = new THREE.ShaderMaterial({
      vertexShader: compositeVertexShader,
      fragmentShader: compositeFragmentShader,
      uniforms: {
        u_image: { value: imageTexture },
        u_video: { value: videoTexture },
        u_mask: { value: maskB.texture },
        u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        u_videoRes: { value: new THREE.Vector2(1920, 1080) },
        u_time: { value: 0 },
      },
    });

    const compositeQuad = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      compositeMaterial
    );
    scene.add(compositeQuad);

    // --- Mouse State ---
    const mousePos = { x: 0.5, y: 0.5 };
    const targetMousePos = { x: 0.5, y: 0.5 };
    let isStamping = false;

    const updateMouseCoords = (clientX: number, clientY: number) => {
      if (!heroSectionRef.current) return;
      const rect = heroSectionRef.current.getBoundingClientRect();

      // Check if cursor is strictly inside Hero section bounds
      if (
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom
      ) {
        targetMousePos.x = (clientX - rect.left) / rect.width;
        targetMousePos.y = 1.0 - ((clientY - rect.top) / rect.height);
        isStamping = true;

        if (video.paused) {
          startVideo();
        }
      } else {
        isStamping = false;
      }
    };

    const handlePointerMove = (e: MouseEvent | PointerEvent) => {
      updateMouseCoords(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        updateMouseCoords(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('pointerdown', startVideo, { passive: true });

    // --- Animation Loop ---
    const clock = new THREE.Clock();
    const FADE_PER_FRAME = 0.9847;

    const tickerCallback = () => {
      const elapsedTime = clock.getElapsedTime();

      if (video.readyState >= video.HAVE_CURRENT_DATA) {
        videoTexture.needsUpdate = true;
        if (video.videoWidth && video.videoHeight) {
          compositeMaterial.uniforms.u_videoRes.value.set(video.videoWidth, video.videoHeight);
        }
      }

      mousePos.x += (targetMousePos.x - mousePos.x) * 0.25;
      mousePos.y += (targetMousePos.y - mousePos.y) * 0.25;

      maskMaterial.uniforms.u_prevMask.value = maskA.texture;
      maskMaterial.uniforms.u_mouse.value.set(mousePos.x, mousePos.y);
      maskMaterial.uniforms.u_stamp.value = isStamping ? 1.0 : 0.0;
      maskMaterial.uniforms.u_fade.value = FADE_PER_FRAME;

      renderer.setRenderTarget(maskB);
      renderer.render(maskScene, maskCamera);
      renderer.setRenderTarget(null);

      const temp = maskA;
      maskA = maskB;
      maskB = temp;

      isStamping = false;

      compositeMaterial.uniforms.u_mask.value = maskA.texture;
      compositeMaterial.uniforms.u_time.value = elapsedTime;

      renderer.render(scene, camera);
    };

    gsap.ticker.add(tickerCallback);

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height);
      maskMaterial.uniforms.u_resolution.value.set(width, height);
      compositeMaterial.uniforms.u_resolution.value.set(width, height);

      // Regenerate fallback canvas texture to match new aspect ratio
      if (usingFallbackTexture) {
        imageTexture.dispose();
        imageTexture = createDefaultTextTexture(width, height);
        compositeMaterial.uniforms.u_image.value = imageTexture;
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('pointerdown', startVideo);
      window.removeEventListener('resize', handleResize);
      gsap.ticker.remove(tickerCallback);
      maskA.dispose();
      maskB.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div ref={heroSectionRef} className="relative w-full h-dvh overflow-hidden select-none bg-white text-black font-sans">
      {/* Off-screen Video Element for Three.js Texture */}
      <video
        ref={videoRef}
        src="/Layer1.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        style={{
          position: 'fixed',
          top: '-9999px',
          left: '-9999px',
          width: '1px',
          height: '1px',
          opacity: 0,
          pointerEvents: 'none',
        }}
      />

      {/* WebGL Canvas Container */}
      <div ref={containerRef} className="absolute inset-0 z-0" />

      {/* Absolute UI Overlay with Difference Blend Mode */}
      <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between p-6 sm:p-8 md:p-12 mix-blend-difference text-white">
        {/* Top Header */}
        <header className="flex justify-between items-start w-full">
          <div className="flex flex-col items-start space-y-4 max-w-xs sm:max-w-sm">
            <p className="font-lato text-xs sm:text-sm md:text-base font-normal leading-relaxed tracking-normal text-white/90">
              "Turning Bold Visions into Unforgettable Realities."<br />
              -Randy, 2025
            </p>
            <div className="pointer-events-auto pt-2">
              <LiquidMetalButton
                label="LET'S COLLABORATE ➔"
                href="#contact"
              />
            </div>
          </div>
        </header>

        {/* Bottom Footer */}
        <footer className="flex justify-between items-end w-full text-xs sm:text-sm font-medium tracking-tight text-white gap-4">
          <div>
            <p className="font-lato font-normal text-xs sm:text-sm text-white/90">A Personal Portfolio / CEO & Creative Visionary</p>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <a
              href="https://www.linkedin.com/in/randynomina333/"
              target="_blank"
              rel="noopener noreferrer"
              className="pointer-events-auto font-semibold text-white hover:bg-white hover:text-black transition-all duration-300 min-h-[44px] px-3 py-1 rounded-md inline-flex items-center"
            >
              LINKEDIN
            </a>
            <span>/</span>
            <a
              href="https://www.instagram.com/randyudesyaf/"
              target="_blank"
              rel="noopener noreferrer"
              className="pointer-events-auto font-semibold text-white hover:bg-white hover:text-black transition-all duration-300 min-h-[44px] px-3 py-1 rounded-md inline-flex items-center"
            >
              INSTAGRAM
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}
