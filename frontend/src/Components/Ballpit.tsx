import React, { useRef, useEffect } from "react";
import * as THREE from "three";

type BallpitProps = {
  count?: number;
  gravity?: number;
  friction?: number;
  wallBounce?: number;
  followCursor?: boolean;
  colors?: number[];
  ambientColor?: number;
  ambientIntensity?: number;
  lightIntensity?: number;
  minSize?: number;
  maxSize?: number;
  size0?: number;
  maxVelocity?: number;
  maxX?: number;
  maxY?: number;
  maxZ?: number;
};

const Ballpit: React.FC<BallpitProps> = ({
  count = 200,
  gravity = 0.5,
  friction = 0.9975,
  wallBounce = 0.95,
  followCursor = true,
  colors = [0xffffff, 0x7c3aed, 0xa3a3a3, 0x18181b],
  ambientColor = 0xffffff,
  ambientIntensity = 1,
  lightIntensity = 200,
  minSize = 0.5,
  maxSize = 1,
  size0 = 1,
  maxVelocity = 0.15,
  maxX = 5, // will be overridden dynamically
  maxY = 5, // will be overridden dynamically
  maxZ = 2,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let width = window.innerWidth;
    let height = window.innerHeight;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 10;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);

    // Calculate visible width and height at camera.position.z
    const cameraZ = camera.position.z;
    const fov = (camera.fov * Math.PI) / 180; // vertical fov in radians
    let visibleHeight = 2 * Math.tan(fov / 2) * cameraZ;
    let visibleWidth = visibleHeight * camera.aspect;

    // Use these as bounds for ball movement
    let boundsX = visibleWidth / 2;
    let boundsY = visibleHeight / 2;

    // Ambient and main light
    const ambientLight = new THREE.AmbientLight(ambientColor, ambientIntensity);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, lightIntensity);
    pointLight.position.set(0, 0, 20);
    scene.add(pointLight);

    // Balls
    const balls: THREE.Mesh[] = [];
    for (let i = 0; i < count; i++) {
      const size = minSize + Math.random() * (maxSize - minSize);
      const geometry = new THREE.SphereGeometry(size, 32, 32);
      const material = new THREE.MeshPhysicalMaterial({
        color: colors[Math.floor(Math.random() * colors.length)],
        roughness: 0.2,
        metalness: 0.7,
        clearcoat: 1,
        clearcoatRoughness: 0.1,
      });
      const ball = new THREE.Mesh(geometry, material);
      // Spread balls randomly across the entire visible screen area
      ball.position.x = (Math.random() - 0.5) * visibleWidth;
      ball.position.y = (Math.random() - 0.5) * visibleHeight;
      ball.position.z = (Math.random() - 0.5) * maxZ * 2; // keep balls visible in z
      // Initial velocities
      ball.userData = {
        vx: (Math.random() - 0.5) * maxVelocity * 0.5,
        vy: (Math.random() - 0.5) * maxVelocity * 0.5,
        vz: (Math.random() - 0.5) * maxVelocity * 0.5,
      };
      scene.add(ball);
      balls.push(ball);
    }

    // Animation
    function animate() {
      balls.forEach((ball) => {
        let { vx, vy, vz } = ball.userData;
        // Gravity
        vy -= gravity * 0.01;
        // Friction
        vx *= friction;
        vy *= friction;
        vz *= friction;

        // Move
        ball.position.x += vx;
        ball.position.y += vy;
        ball.position.z += vz;

        // Wall bounce on X
        if (ball.position.x < -boundsX || ball.position.x > boundsX) {
          ball.userData.vx *= -wallBounce;
          ball.position.x = Math.max(
            Math.min(ball.position.x, boundsX),
            -boundsX
          );
        }
        // Wall bounce on Y
        if (ball.position.y < -boundsY || ball.position.y > boundsY) {
          ball.userData.vy *= -wallBounce;
          ball.position.y = Math.max(
            Math.min(ball.position.y, boundsY),
            -boundsY
          );
        }
        // Wall bounce on Z
        if (ball.position.z < -maxZ || ball.position.z > maxZ) {
          ball.userData.vz *= -wallBounce;
          ball.position.z = Math.max(Math.min(ball.position.z, maxZ), -maxZ);
        }
      });

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }

    const mountNode = mountRef.current;

    animate();

    // Mount renderer
    if (mountNode) {
      mountNode.appendChild(renderer.domElement);
    }

    // Handle window resize to prevent stretching
    function onWindowResize() {
      width = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);

      // Recalculate visible bounds on resize
      visibleHeight =
        2 * Math.tan((camera.fov * Math.PI) / 360) * camera.position.z;
      visibleWidth = visibleHeight * camera.aspect;
      boundsX = visibleWidth / 2;
      boundsY = visibleHeight / 2;
    }
    window.addEventListener("resize", onWindowResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", onWindowResize);
      renderer.dispose();
      if (mountNode) {
        mountNode.innerHTML = "";
      }
    };
  }, [
    count,
    gravity,
    friction,
    wallBounce,
    followCursor,
    colors,
    ambientColor,
    ambientIntensity,
    lightIntensity,
    minSize,
    maxSize,
    size0,
    maxVelocity,
    maxX,
    maxY,
    maxZ,
  ]);

  return (
    <div
      ref={mountRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
};

export default Ballpit;
