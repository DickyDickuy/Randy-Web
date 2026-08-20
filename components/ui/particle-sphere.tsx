"use client";
import React, { useEffect, useRef, useMemo } from "react";
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Color,
  SphereGeometry,
  MeshBasicMaterial,
  InstancedMesh,
  Matrix4,
  Group,
  Vector3,
} from "three";

interface ParticleSphereRefactorProps {
  particlesCount?: number;
  particleScale?: number;
  speed?: number;
  smoothing?: number;
  scale?: number;
  stopOnHover?: boolean;
  rotationDirection?: "clockwise" | "anticlockwise";
  dragSpeed?: number;
  drag?: boolean;
  cursorOn?: boolean;
  cursorRadiusUI?: number;
  cursorStrengthUI?: number;
  clickForce?: number;
  sphereColor?: string;
  style?: React.CSSProperties;
}

const cssVariableRegex =
  /var\s*\(\s*(--[\w-]+)(?:\s*,\s*((?:[^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*))?\s*\)/;

function extractDefaultValue(cssVar: string): string {
  if (!cssVar || !cssVar.startsWith("var(")) return cssVar;
  const match = cssVariableRegex.exec(cssVar);
  if (!match) return cssVar;
  const fallback = (match[2] || "").trim();
  if (fallback.startsWith("var(")) return extractDefaultValue(fallback);
  return fallback || cssVar;
}

function resolveTokenColor(input: any): any {
  if (typeof input !== "string") return input;
  if (!input.startsWith("var(")) return input;
  return extractDefaultValue(input);
}

function parseColorToRgba(input: string | undefined): {
  r: number;
  g: number;
  b: number;
  a: number;
} {
  if (!input || input.trim() === "") return { r: 0, g: 0, b: 0, a: 1 };
  const str = input.trim();

  const rgbaMatch = str.match(
    /rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+)\s*)?\)/i
  );
  if (rgbaMatch) {
    const r = Math.max(0, Math.min(255, parseFloat(rgbaMatch[1]))) / 255;
    const g = Math.max(0, Math.min(255, parseFloat(rgbaMatch[2]))) / 255;
    const b = Math.max(0, Math.min(255, parseFloat(rgbaMatch[3]))) / 255;
    const a =
      rgbaMatch[4] !== undefined
        ? Math.max(0, Math.min(1, parseFloat(rgbaMatch[4])))
        : 1;
    return { r, g, b, a };
  }

  const hex = str.replace(/^#/, "");
  if (hex.length === 8) {
    return {
      r: parseInt(hex.slice(0, 2), 16) / 255,
      g: parseInt(hex.slice(2, 4), 16) / 255,
      b: parseInt(hex.slice(4, 6), 16) / 255,
      a: parseInt(hex.slice(6, 8), 16) / 255,
    };
  }
  if (hex.length === 6) {
    return {
      r: parseInt(hex.slice(0, 2), 16) / 255,
      g: parseInt(hex.slice(2, 4), 16) / 255,
      b: parseInt(hex.slice(4, 6), 16) / 255,
      a: 1,
    };
  }
  if (hex.length === 4) {
    return {
      r: parseInt(hex[0] + hex[0], 16) / 255,
      g: parseInt(hex[1] + hex[1], 16) / 255,
      b: parseInt(hex[2] + hex[2], 16) / 255,
      a: parseInt(hex[3] + hex[3], 16) / 255,
    };
  }
  if (hex.length === 3) {
    return {
      r: parseInt(hex[0] + hex[0], 16) / 255,
      g: parseInt(hex[1] + hex[1], 16) / 255,
      b: parseInt(hex[2] + hex[2], 16) / 255,
      a: 1,
    };
  }
  return { r: 0, g: 0, b: 0, a: 1 };
}

function mapLinear(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  if (inMax === inMin) return outMin;
  const t = (value - inMin) / (inMax - inMin);
  return outMin + t * (outMax - outMin);
}

function mapSpeedUiToInternal(ui: number): number {
  return mapLinear(ui, 0.1, 1.0, 0.01, 0.05);
}

function mapScaleUiToMultiplier(ui: number): number {
  const clamped = Math.max(0, Math.min(1, ui));
  return mapLinear(clamped, 0, 1.0, 0.25, 1.25);
}

function mapParticleSizeUiToInternal(ui: number): number {
  const clamped = Math.max(0.1, Math.min(1, ui));
  return mapLinear(clamped, 0.1, 1.0, 0.01, 0.1);
}

function mapCursorStrengthUiToMultiplier(ui: number): number {
  const clamped = Math.max(0, Math.min(1, ui));
  return mapLinear(clamped, 0, 1.0, 0, 15);
}

const CURSOR_PHYSICS = {
  RETURN_FORCE: 0.02,
  FRICTION: 0.94,
} as const;

export default function ParticleSphereRefactor(props: ParticleSphereRefactorProps) {
  const {
    particlesCount = 8000,
    speed = 20,
    smoothing = 8,
    scale = 10,
    stopOnHover = false,
    rotationDirection = "anticlockwise",
    dragSpeed = 16,
    drag = true,
    particleScale = 3.5,
    cursorOn = true,
    cursorRadiusUI = 140,
    cursorStrengthUI = 6,
    clickForce = 12,
    sphereColor = "#000000",
    style,
  } = props;

  const speedN = speed / 10;
  const smoothingN = smoothing / 10;
  const scaleN = scale / 10;
  const dragN = dragSpeed / 10;
  const sizeN = particleScale / 10;
  const strengthN = cursorStrengthUI / 10;

  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);
  const rendererRef = useRef<any>(null);
  const particlesRef = useRef<any>(null);
  const particlesGroupRef = useRef<any>(null);
  const animationFrameRef = useRef<number | null>(null);
  const mouseRef = useRef<{ x: number; y: number } | null>(null);
  const baseParticlePositionsRef = useRef<Vector3[]>([]);
  const particleDisplacementsRef = useRef<Vector3[]>([]);
  const particleScatterVelocitiesRef = useRef<Vector3[]>([]);

  const rotationSpeed = useMemo(() => {
    const baseSpeed = mapSpeedUiToInternal(speedN);
    return rotationDirection === "anticlockwise" ? -baseSpeed : baseSpeed;
  }, [speedN, rotationDirection]);

  const scaleMultiplier = useMemo(
    () => mapScaleUiToMultiplier(scaleN),
    [scaleN]
  );

  const particleSize = useMemo(
    () => mapParticleSizeUiToInternal(sizeN),
    [sizeN]
  );

  const cursorRadius = useMemo(
    () => Math.max(0, Math.min(600, cursorRadiusUI)),
    [cursorRadiusUI]
  );

  const cursorStrength = useMemo(
    () => mapCursorStrengthUiToMultiplier(strengthN),
    [strengthN]
  );

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const containerWidth = container.clientWidth || 400;
    const containerHeight = container.clientHeight || 400;

    const canvasOverflowMultiplier = 2.0;
    const canvasWidth = containerWidth * canvasOverflowMultiplier;
    const canvasHeight = containerHeight * canvasOverflowMultiplier;

    const scene = new Scene();
    sceneRef.current = scene;

    const baseFOV = 50;
    const adjustedFOV =
      2 *
      Math.atan(
        Math.tan((baseFOV * Math.PI) / 180 / 2) * canvasOverflowMultiplier
      ) *
      (180 / Math.PI);

    const camera = new PerspectiveCamera(
      adjustedFOV,
      canvasWidth / canvasHeight,
      0.1,
      1000
    );

    const baseCameraDistance = 3.0;
    const currentSphereRadius = 1.0 * scaleMultiplier;
    const cameraDistance = Math.max(baseCameraDistance, currentSphereRadius + 1.0);
    camera.position.z = cameraDistance;
    cameraRef.current = camera;

    const renderer = new WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(canvasWidth, canvasHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const canvas = renderer.domElement;
    canvas.style.position = "absolute";
    const offsetX = (canvasWidth - containerWidth) / 2;
    const offsetY = (canvasHeight - containerHeight) / 2;
    canvas.style.left = `-${offsetX}px`;
    canvas.style.top = `-${offsetY}px`;
    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${canvasHeight}px`;
    canvas.style.display = "block";
    canvas.style.cursor = drag ? "grab" : "default";
    container.appendChild(canvas);
    rendererRef.current = renderer;

    const resolvedSphereColor = resolveTokenColor(sphereColor);
    const sphereRgba = parseColorToRgba(resolvedSphereColor || sphereColor);
    const baseColorObj = new Color(sphereRgba.r, sphereRgba.g, sphereRgba.b);
    const particleOpacity = sphereRgba.a;

    const vertices: number[] = [];
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    const baseSphereRadius = 1.0;
    const sphereRadius = baseSphereRadius * scaleMultiplier;

    baseParticlePositionsRef.current = [];
    particleDisplacementsRef.current = [];
    particleScatterVelocitiesRef.current = [];

    for (let i = 0; i < particlesCount; i++) {
      const y = 1 - (i / (particlesCount - 1)) * 2;
      const radius = Math.sqrt(1 - y * y);
      const theta = goldenAngle * i;

      const x = Math.cos(theta) * radius;
      const z = Math.sin(theta) * radius;

      const posX = x * sphereRadius;
      const posY = y * sphereRadius;
      const posZ = z * sphereRadius;
      vertices.push(posX, posY, posZ);

      baseParticlePositionsRef.current.push(new Vector3(posX, posY, posZ));
      particleDisplacementsRef.current.push(new Vector3(0, 0, 0));
      particleScatterVelocitiesRef.current.push(new Vector3(0, 0, 0));
    }

    const sphereMeshRadius = particleSize * 0.15;
    const sphereGeometry = new SphereGeometry(sphereMeshRadius, 8, 8);
    const sphereMaterial = new MeshBasicMaterial({
      color: baseColorObj,
      transparent: particleOpacity < 1,
      opacity: particleOpacity,
    });

    const particles = new InstancedMesh(
      sphereGeometry,
      sphereMaterial,
      particlesCount
    );

    const matrix = new Matrix4();
    for (let i = 0; i < particlesCount; i++) {
      const idx = i * 3;
      matrix.setPosition(vertices[idx], vertices[idx + 1], vertices[idx + 2]);
      particles.setMatrixAt(i, matrix);
    }
    particles.instanceMatrix.needsUpdate = true;
    particlesRef.current = particles;

    const particlesGroup = new Group();
    particlesGroupRef.current = particlesGroup;
    particlesGroup.add(particles);
    scene.add(particlesGroup);

    const rotation = { x: 0, y: 0 };
    const targetRotation = { x: 0, y: 0 };
    const velocity = { x: 0, y: 0 };
    let isDragging = false;
    let isHovering = false;
    let lastMouseX = 0;
    let lastMouseY = 0;
    let lastDragTime = 0;

    let lastFrameTime = performance.now();
    const targetDeltaTime = 1000 / 60;

    const lerpFactor =
      smoothingN === 0 ? 1 : mapLinear(smoothingN, 0, 1, 0.4, 0.03);
    const velocityDecay = mapLinear(smoothingN, 0, 1, 0.7, 0.96);

    const animateCore = () => {
      const now = performance.now();
      const deltaTime = now - lastFrameTime;
      lastFrameTime = now;
      const deltaFactor = Math.min(deltaTime / targetDeltaTime, 3.0);

      const threshold = 0.001;

      if (!isDragging && rotationSpeed !== 0 && (!stopOnHover || !isHovering)) {
        targetRotation.x += rotationSpeed * 0.1 * deltaFactor;
      }

      if (!isDragging && smoothingN > 0) {
        if (
          Math.abs(velocity.x) > threshold ||
          Math.abs(velocity.y) > threshold
        ) {
          targetRotation.x += velocity.x * deltaFactor;
          targetRotation.y += velocity.y * deltaFactor;
          targetRotation.y = Math.max(
            -Math.PI / 2,
            Math.min(Math.PI / 2, targetRotation.y)
          );
          const decayFactor = Math.pow(velocityDecay, deltaFactor);
          velocity.x *= decayFactor;
          velocity.y *= decayFactor;
        } else {
          velocity.x = 0;
          velocity.y = 0;
        }
      }

      const dx = targetRotation.x - rotation.x;
      const dy = targetRotation.y - rotation.y;

      const timeLerpFactor = 1 - Math.pow(1 - lerpFactor, deltaFactor);
      rotation.x += dx * timeLerpFactor;
      rotation.y += dy * timeLerpFactor;
      rotation.y = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, rotation.y));

      particlesGroup.rotation.y = rotation.x;
      particlesGroup.rotation.x = rotation.y;
      particlesGroup.updateMatrixWorld(true);

      const currentContainerWidth = containerRef.current?.clientWidth || 400;
      const currentContainerHeight = containerRef.current?.clientHeight || 400;
      const currentCanvasWidth = currentContainerWidth * canvasOverflowMultiplier;
      const currentCanvasHeight = currentContainerHeight * canvasOverflowMultiplier;
      const currentCamera = cameraRef.current;
      const cursorRadiusSquared = cursorRadius * cursorRadius;

      if (cursorOn && baseParticlePositionsRef.current.length > 0) {
        const mouse = mouseRef.current;

        for (let i = 0; i < baseParticlePositionsRef.current.length; i++) {
          const basePos = baseParticlePositionsRef.current[i];
          const displacement = particleDisplacementsRef.current[i];

          if (mouse) {
            const currentLocalPos = new Vector3();
            currentLocalPos.copy(basePos);
            currentLocalPos.add(displacement);

            const worldPos = new Vector3();
            worldPos.copy(currentLocalPos);
            worldPos.applyMatrix4(particlesGroup.matrixWorld);

            const projected = worldPos.clone().project(currentCamera);
            const screenX = (projected.x * 0.5 + 0.5) * currentCanvasWidth;
            const screenY = (-projected.y * 0.5 + 0.5) * currentCanvasHeight;

            const distDx = mouse.x - screenX;
            const distDy = mouse.y - screenY;
            const distanceSquared = distDx * distDx + distDy * distDy;

            if (
              distanceSquared < cursorRadiusSquared &&
              distanceSquared > 0 &&
              worldPos.z > 0
            ) {
              const distance = Math.sqrt(distanceSquared);
              const force = (cursorRadius - distance) / cursorRadius;
              const angle = Math.atan2(distDy, distDx);

              const cameraRight = new Vector3();
              const cameraUp = new Vector3();
              cameraRight
                .setFromMatrixColumn(currentCamera.matrixWorld, 0)
                .normalize();
              cameraUp
                .setFromMatrixColumn(currentCamera.matrixWorld, 1)
                .normalize();

              const repulsion2D = force * cursorStrength * speedN * deltaFactor;
              const repulsionX = -Math.cos(angle) * repulsion2D * 0.015;
              const repulsionY = Math.sin(angle) * repulsion2D * 0.015;

              const worldRepulsion = new Vector3();
              worldRepulsion.addScaledVector(cameraRight, repulsionX);
              worldRepulsion.addScaledVector(cameraUp, repulsionY);

              const localRepulsion = new Vector3();
              localRepulsion.copy(worldRepulsion);
              const inverseGroupMatrix = new Matrix4();
              inverseGroupMatrix.copy(particlesGroup.matrixWorld).invert();
              localRepulsion.applyMatrix4(inverseGroupMatrix);

              displacement.add(localRepulsion);
            }
          }

          const frictionFactor = Math.pow(CURSOR_PHYSICS.FRICTION, deltaFactor);
          const returnForce = CURSOR_PHYSICS.RETURN_FORCE * speedN * deltaFactor;
          displacement.multiplyScalar(frictionFactor);
          displacement.multiplyScalar(1 - returnForce);
        }
      }

      if (particleScatterVelocitiesRef.current.length > 0) {
        for (let i = 0; i < particleScatterVelocitiesRef.current.length; i++) {
          const scatterVelocity = particleScatterVelocitiesRef.current[i];
          const displacement = particleDisplacementsRef.current[i];

          displacement.addScaledVector(scatterVelocity, deltaFactor * 0.1);
          const scatterFriction = Math.pow(0.95, deltaFactor);
          scatterVelocity.multiplyScalar(scatterFriction);
          const scatterReturnForce =
            CURSOR_PHYSICS.RETURN_FORCE * speedN * deltaFactor;
          scatterVelocity.multiplyScalar(1 - scatterReturnForce);
        }
      }

      if (particlesRef.current) {
        const tempMat = new Matrix4();
        for (let i = 0; i < baseParticlePositionsRef.current.length; i++) {
          const basePos = baseParticlePositionsRef.current[i];
          const displacement = particleDisplacementsRef.current[i];
          const finalPos = new Vector3();
          finalPos.copy(basePos);
          finalPos.add(displacement);
          tempMat.setPosition(finalPos.x, finalPos.y, finalPos.z);
          particlesRef.current.setMatrixAt(i, tempMat);
        }
        particlesRef.current.instanceMatrix.needsUpdate = true;
      }

      renderer.render(scene, camera);
      animationFrameRef.current = requestAnimationFrame(animateCore);
    };

    animationFrameRef.current = requestAnimationFrame(animateCore);

    const handleMouseDown = (event: MouseEvent) => {
      if (!drag) return;
      isDragging = true;
      canvas.style.cursor = "grabbing";
      velocity.x = 0;
      velocity.y = 0;
      lastMouseX = event.clientX;
      lastMouseY = event.clientY;
      lastDragTime = performance.now();

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const currentTime = performance.now();
        const timeSinceLastMove = currentTime - lastDragTime;

        const sensitivity = mapLinear(dragN, 0, 1, 0.001, 0.02);
        const mouseDx = moveEvent.clientX - lastMouseX;
        const mouseDy = moveEvent.clientY - lastMouseY;

        targetRotation.x += mouseDx * sensitivity;
        targetRotation.y += mouseDy * sensitivity;
        targetRotation.y = Math.max(
          -Math.PI / 2,
          Math.min(Math.PI / 2, targetRotation.y)
        );

        if (timeSinceLastMove > 0) {
          const timeNormalization = targetDeltaTime / timeSinceLastMove;
          velocity.x = mouseDx * sensitivity * 0.3 * timeNormalization;
          velocity.y = mouseDy * sensitivity * 0.3 * timeNormalization;
        }

        lastMouseX = moveEvent.clientX;
        lastMouseY = moveEvent.clientY;
        lastDragTime = currentTime;
      };

      const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        isDragging = false;
        canvas.style.cursor = drag ? "grab" : "default";
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    };

    if (drag) {
      canvas.addEventListener("mousedown", handleMouseDown);
    }

    const handleMouseMoveCursor = (event: MouseEvent) => {
      const containerRect = container.getBoundingClientRect();
      const mouseXInContainer = event.clientX - containerRect.left;
      const mouseYInContainer = event.clientY - containerRect.top;

      if (
        mouseXInContainer >= 0 &&
        mouseXInContainer <= containerRect.width &&
        mouseYInContainer >= 0 &&
        mouseYInContainer <= containerRect.height
      ) {
        mouseRef.current = {
          x: mouseXInContainer + offsetX,
          y: mouseYInContainer + offsetY,
        };
      } else {
        mouseRef.current = null;
      }
    };

    const handleMouseLeaveCursor = () => {
      mouseRef.current = null;
    };

    const handleTouchMove = (event: TouchEvent) => {
      const containerRect = container.getBoundingClientRect();
      const touch = event.touches[0];
      if (touch) {
        const touchXInContainer = touch.clientX - containerRect.left;
        const touchYInContainer = touch.clientY - containerRect.top;
        if (
          touchXInContainer >= 0 &&
          touchXInContainer <= containerRect.width &&
          touchYInContainer >= 0 &&
          touchYInContainer <= containerRect.height
        ) {
          mouseRef.current = {
            x: touchXInContainer + offsetX,
            y: touchYInContainer + offsetY,
          };
        } else {
          mouseRef.current = null;
        }
      }
    };

    const handleTouchEnd = () => {
      mouseRef.current = null;
    };

    const handleClick = (event: MouseEvent) => {
      if (!cursorOn || !clickForce) return;

      particlesGroup.updateMatrixWorld(true);

      const containerRect = container.getBoundingClientRect();
      const clickX = event.clientX - containerRect.left + offsetX;
      const clickY = event.clientY - containerRect.top + offsetY;
      const cursorRadiusSq = cursorRadius * cursorRadius;

      const clickCanvasW = (containerRef.current?.clientWidth || 400) * canvasOverflowMultiplier;
      const clickCanvasH = (containerRef.current?.clientHeight || 400) * canvasOverflowMultiplier;

      const ndcX = (clickX / clickCanvasW) * 2 - 1;
      const ndcY = 1 - (clickY / clickCanvasH) * 2;

      const clickRay = new Vector3(ndcX, ndcY, 0.5);
      clickRay.unproject(camera);

      const cameraWorldPos = new Vector3();
      cameraWorldPos.setFromMatrixPosition(camera.matrixWorld);

      const clickDirection = new Vector3();
      clickDirection.subVectors(clickRay, cameraWorldPos).normalize();

      const sphereCenter = new Vector3(0, 0, 0);
      const cameraToCenter = new Vector3();
      cameraToCenter.subVectors(sphereCenter, cameraWorldPos);
      const sphereDist = cameraToCenter.length();
      const clickWorldPos = new Vector3();
      clickWorldPos.copy(cameraWorldPos);
      clickWorldPos.addScaledVector(clickDirection, sphereDist);

      for (let i = 0; i < baseParticlePositionsRef.current.length; i++) {
        const basePos = baseParticlePositionsRef.current[i];
        const displacement = particleDisplacementsRef.current[i];
        const scatterVelocity = particleScatterVelocitiesRef.current[i];

        const currentLocalPos = new Vector3();
        currentLocalPos.copy(basePos);
        currentLocalPos.add(displacement);

        const worldPos = new Vector3();
        worldPos.copy(currentLocalPos);
        worldPos.applyMatrix4(particlesGroup.matrixWorld);

        const projected = worldPos.clone().project(camera);
        const screenX = (projected.x * 0.5 + 0.5) * clickCanvasW;
        const screenY = (-projected.y * 0.5 + 0.5) * clickCanvasH;

        const distDx = clickX - screenX;
        const distDy = clickY - screenY;
        const distanceSq = distDx * distDx + distDy * distDy;

        if (distanceSq < cursorRadiusSq && distanceSq > 0) {
          const screenDist = Math.sqrt(distanceSq);
          const force = ((cursorRadius - screenDist) / cursorRadius) * clickForce;

          const radialDirection = new Vector3();
          radialDirection.subVectors(worldPos, clickWorldPos);

          if (radialDirection.length() > 0.001) {
            radialDirection.normalize();
            const scatterMagnitude = force * 0.5;
            const worldScatter = new Vector3();
            worldScatter.copy(radialDirection);
            worldScatter.multiplyScalar(scatterMagnitude);

            const localScatter = new Vector3();
            localScatter.copy(worldScatter);
            const inverseGroupMatrix = new Matrix4();
            inverseGroupMatrix.copy(particlesGroup.matrixWorld).invert();
            localScatter.applyMatrix4(inverseGroupMatrix);

            scatterVelocity.add(localScatter);
          }
        }
      }
    };

    if (cursorOn) {
      canvas.addEventListener("mousemove", handleMouseMoveCursor);
      canvas.addEventListener("mouseleave", handleMouseLeaveCursor);
      canvas.addEventListener("click", handleClick);
      canvas.addEventListener("touchmove", handleTouchMove, { passive: true });
      canvas.addEventListener("touchend", handleTouchEnd);
    }

    const resizeObserver = new ResizeObserver(() => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current)
        return;

      const newWidth = containerRef.current.clientWidth || 400;
      const newHeight = containerRef.current.clientHeight || 400;

      const newCanvasWidth = newWidth * canvasOverflowMultiplier;
      const newCanvasHeight = newHeight * canvasOverflowMultiplier;
      const newOffsetX = (newCanvasWidth - newWidth) / 2;
      const newOffsetY = (newCanvasHeight - newHeight) / 2;

      cameraRef.current.aspect = newCanvasWidth / newCanvasHeight;
      cameraRef.current.updateProjectionMatrix();

      rendererRef.current.setSize(newCanvasWidth, newCanvasHeight);
      const canvasEl = rendererRef.current.domElement;
      canvasEl.style.left = `-${newOffsetX}px`;
      canvasEl.style.top = `-${newOffsetY}px`;
      canvasEl.style.width = `${newCanvasWidth}px`;
      canvasEl.style.height = `${newCanvasHeight}px`;
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (drag) {
        canvas.removeEventListener("mousedown", handleMouseDown);
      }
      if (cursorOn) {
        canvas.removeEventListener("mousemove", handleMouseMoveCursor);
        canvas.removeEventListener("mouseleave", handleMouseLeaveCursor);
        canvas.removeEventListener("click", handleClick);
        canvas.removeEventListener("touchmove", handleTouchMove);
        canvas.removeEventListener("touchend", handleTouchEnd);
      }
      if (rendererRef.current) {
        rendererRef.current.dispose();
        if (containerRef.current && canvas.parentNode) {
          containerRef.current.removeChild(canvas);
        }
      }
      if (particlesRef.current) {
        if (particlesRef.current.geometry) {
          particlesRef.current.geometry.dispose();
        }
        if (particlesRef.current.material) {
          particlesRef.current.material.dispose();
        }
      }
    };
  }, [
    particlesCount,
    speed,
    smoothing,
    scale,
    stopOnHover,
    rotationDirection,
    dragSpeed,
    drag,
    particleScale,
    cursorOn,
    clickForce,
    cursorRadius,
    cursorStrength,
    sphereColor,
    rotationSpeed,
    scaleMultiplier,
    particleSize,
  ]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "visible",
        ...style,
      }}
    />
  );
}
