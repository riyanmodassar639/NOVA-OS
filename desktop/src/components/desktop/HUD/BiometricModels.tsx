import React, { useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from 'three';

const GlowingCanvas = ({ children, cameraPos = [0, 0, 3.5] as [number, number, number] }: { children: React.ReactNode, cameraPos?: [number, number, number] }) => (
  <div style={{ width: "100%", height: "100%", filter: "drop-shadow(0 0 10px rgba(0,255,255,0.6))" }}>
    <Canvas camera={{ position: cameraPos, fov: 50 }}>
      <ambientLight intensity={1} />
      {children}
    </Canvas>
  </div>
);

// --- Real 3D Human Body (Wireframe + Scanning Beams) ---
const HoloBodyMesh = () => {
  const { scene } = useGLTF("/models/Xbot.glb");
  const group = useRef<THREE.Group>(null);
  const ring1 = useRef<THREE.Mesh>(null);
  const ring2 = useRef<THREE.Mesh>(null);
  const ring3 = useRef<THREE.Mesh>(null);
  
  // Convert all meshes in the GLTF to LineSegments (Wireframe)
  const wireframes = useMemo(() => {
    const lines: JSX.Element[] = [];
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const wireframeGeom = new THREE.WireframeGeometry(mesh.geometry);
        lines.push(
          <lineSegments key={mesh.uuid} geometry={wireframeGeom}>
            <lineBasicMaterial color={0x00ffff} transparent opacity={0.15} blending={THREE.AdditiveBlending} depthWrite={false} />
          </lineSegments>
        );
      }
      // Drop arms to A-pose
      if ((child as THREE.Bone).isBone) {
        if (child.name === 'mixamorigLeftArm' || child.name === 'LeftArm') {
          child.rotation.z = 1.0;
        }
        if (child.name === 'mixamorigRightArm' || child.name === 'RightArm') {
          child.rotation.z = -1.0;
        }
      }
    });
    return lines;
  }, [scene]);

  useFrame(({ clock }) => {
    if (group.current) {
      group.current.rotation.y = clock.elapsedTime * 0.4;
    }
    const t = clock.elapsedTime;
    if (ring1.current) ring1.current.position.y = -0.4 + Math.sin(t * 2) * 0.1;
    if (ring2.current) ring2.current.position.y = -0.6 + Math.sin(t * 2 + 1) * 0.1;
    if (ring3.current) ring3.current.position.y = -0.8 + Math.sin(t * 2 + 2) * 0.1;
  });

  return (
    <group position={[0, -1.0, 0]}>
      {/* The wireframe humanoid */}
      <group ref={group} scale={[1.3, 1.3, 1.3]}>
        {wireframes}
      </group>
      
      {/* Light Beams (Cone fading up) */}
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[2.0, 0.1, 4, 32, 1, true]} />
        <meshBasicMaterial color={0x00ffff} transparent opacity={0.03} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      
      {/* Concentric Base Rings */}
      <mesh ref={ring1} rotation={[Math.PI/2, 0, 0]}>
        <torusGeometry args={[0.7, 0.01, 16, 64]} />
        <meshBasicMaterial color={0x00ffff} transparent opacity={0.8} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh ref={ring2} rotation={[Math.PI/2, 0, 0]}>
        <torusGeometry args={[1.2, 0.01, 16, 64]} />
        <meshBasicMaterial color={0x00ffff} transparent opacity={0.5} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh ref={ring3} rotation={[Math.PI/2, 0, 0]}>
        <torusGeometry args={[1.7, 0.01, 16, 64]} />
        <meshBasicMaterial color={0x00ffff} transparent opacity={0.2} blending={THREE.AdditiveBlending} />
      </mesh>
      
      {/* Core Star at bottom */}
      <mesh position={[0, -1.0, 0]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial color={0xffffff} />
      </mesh>
      <pointLight position={[0, -1.0, 0]} color={0x00ffff} intensity={5} distance={3} />
    </group>
  );
};

export const HoloBody = () => (
  <GlowingCanvas>
    <HoloBodyMesh />
  </GlowingCanvas>
);

// --- Real 3D Human Face (Wireframe Scan) ---
const HoloFaceMesh = () => {
  const { scene } = useGLTF("/models/LeePerrySmith.glb");
  const group = useRef<THREE.Group>(null);

  const wireframes = useMemo(() => {
    const lines: JSX.Element[] = [];
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const wireframeGeom = new THREE.WireframeGeometry(mesh.geometry);
        lines.push(
          <lineSegments key={mesh.uuid} geometry={wireframeGeom}>
            <lineBasicMaterial color={0x00ffff} transparent opacity={0.15} blending={THREE.AdditiveBlending} depthWrite={false} />
          </lineSegments>
        );
      }
    });
    return lines;
  }, [scene]);

  useFrame(({ clock }) => {
    if (group.current) {
      group.current.rotation.y = Math.sin(clock.elapsedTime * 0.5) * 0.8;
    }
  });

  return (
    <group ref={group} position={[0, -0.2, 0]}>
      <group scale={[0.45, 0.45, 0.45]}>
        {wireframes}
      </group>
      {/* Face Scanning Ring */}
      <mesh rotation={[Math.PI/2, 0, 0]} position={[0, -0.4, 0]}>
        <torusGeometry args={[0.6, 0.01, 16, 64]} />
        <meshBasicMaterial color={0x00ffff} transparent opacity={0.5} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
};

export const HoloFace = () => (
  <GlowingCanvas>
    <HoloFaceMesh />
  </GlowingCanvas>
);

// --- 3D Retina (Eye) Scan ---
const EyeMesh = () => {
  const group = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (group.current) {
      group.current.children.forEach((child, i) => {
        child.rotation.z = clock.elapsedTime * (i % 2 === 0 ? 0.8 : -0.8) * (i + 1) * 0.1;
      });
    }
  });

  return (
    <group ref={group}>
      <mesh>
        <torusGeometry args={[1.2, 0.02, 16, 100]} />
        <meshBasicMaterial color={0x00ffff} wireframe={true} transparent opacity={0.4} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh>
        <torusGeometry args={[0.9, 0.05, 4, 32]} />
        <meshBasicMaterial color={0x00ffff} wireframe={true} transparent opacity={0.2} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh>
        <torusGeometry args={[0.6, 0.03, 16, 64]} />
        <meshBasicMaterial color={0x00ffff} wireframe={true} transparent opacity={0.3} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshBasicMaterial color={0x00ffff} wireframe={true} transparent opacity={0.5} blending={THREE.AdditiveBlending} />
      </mesh>
      {Array.from({ length: 12 }).map((_, i) => (
        <mesh key={i} rotation={[0, 0, (i * Math.PI) / 6]}>
          <cylinderGeometry args={[0.01, 0.01, 2.4, 4]} />
          <meshBasicMaterial color={0x00ffff} transparent opacity={0.15} blending={THREE.AdditiveBlending} />
        </mesh>
      ))}
    </group>
  );
};

export const HoloEye = () => (
  <GlowingCanvas>
    <EyeMesh />
  </GlowingCanvas>
);

// --- 3D Dermal / Fingerprint Scanner ---
const ScannerBed = () => {
  const group = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (group.current) {
      const time = clock.elapsedTime;
      group.current.children.forEach((child) => {
        child.position.y = Math.sin(child.position.x * 5 + time * 3) * 0.15 + Math.cos(child.position.z * 5 + time * 2) * 0.15;
      });
      group.current.rotation.y = time * 0.3;
      group.current.rotation.x = Math.PI / 4;
    }
  });

  const boxes = [];
  for (let x = -1.2; x <= 1.2; x += 0.2) {
    for (let z = -1.2; z <= 1.2; z += 0.2) {
      boxes.push(
        <mesh key={`${x}-${z}`} position={[x, 0, z]}>
          <boxGeometry args={[0.08, 0.8, 0.08]} />
          <meshBasicMaterial color={0x00ffff} wireframe={true} transparent opacity={0.2} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      );
    }
  }

  return <group ref={group}>{boxes}</group>;
};

export const HoloFingerprint = () => (
  <GlowingCanvas>
    <ScannerBed />
  </GlowingCanvas>
);

// --- 3D Brain / Neural Sync ---
const BrainMesh = () => {
  const mesh = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (mesh.current) {
      mesh.current.rotation.x = clock.elapsedTime * 0.2;
      mesh.current.rotation.y = clock.elapsedTime * 0.3;
    }
  });

  return (
    <mesh ref={mesh} scale={[0.8, 0.8, 0.8]}>
      <torusKnotGeometry args={[1.2, 0.4, 128, 16]} />
      <meshBasicMaterial color={0x00ffff} wireframe={true} transparent opacity={0.15} blending={THREE.AdditiveBlending} depthWrite={false} />
    </mesh>
  );
};

export const HoloBrain = () => (
  <GlowingCanvas>
    <BrainMesh />
  </GlowingCanvas>
);

export const TelemetryData = () => {
  const [data, setData] = useState({
    hr: 72,
    sync: 98.4,
    temp: 36.6,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setData({
        hr: 70 + Math.floor(Math.random() * 15),
        sync: 97 + Math.random() * 2.9,
        temp: 36.4 + Math.random() * 0.5,
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(0,255,255,0.2)", paddingBottom: "2px" }}>
        <span style={{ fontSize: "0.6rem", opacity: 0.7 }}>BPM (HEART RATE)</span>
        <span style={{ fontSize: "0.8rem", color: "#00ffff", fontWeight: "bold" }}>{data.hr}</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(0,255,255,0.2)", paddingBottom: "2px" }}>
        <span style={{ fontSize: "0.6rem", opacity: 0.7 }}>NEURAL SYNC</span>
        <span style={{ fontSize: "0.8rem", color: "#00ff66", fontWeight: "bold" }}>{data.sync.toFixed(2)}%</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(0,255,255,0.2)", paddingBottom: "2px" }}>
        <span style={{ fontSize: "0.6rem", opacity: 0.7 }}>CORE TEMP</span>
        <span style={{ fontSize: "0.8rem", color: "#00ffff", fontWeight: "bold" }}>{data.temp.toFixed(1)}°C</span>
      </div>
    </div>
  );
};
