/* eslint-disable react/no-unknown-property */
'use client';

import { useEffect, useRef, useState } from 'react';
import { Canvas, extend, useFrame } from '@react-three/fiber';
import { Environment, Lightformer, RoundedBox, useTexture, Text } from '@react-three/drei';
import { BallCollider, CuboidCollider, Physics, RigidBody, useRopeJoint, useSphericalJoint } from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import * as THREE from 'three';

extend({ MeshLineGeometry, MeshLineMaterial });

export function HeroOrb({ profileImage }: { profileImage?: string }) {
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="relative h-full w-full">
      <Canvas
        camera={{ position: [0, 0, 20], fov: 25 }}
        dpr={[1, isMobile ? 1.5 : 2]}
        className="relative z-10"
        gl={{ alpha: true }}
        onCreated={({ gl }) => gl.setClearColor(new THREE.Color(0x020409), 0)}
      >
        <ambientLight intensity={Math.PI} />
        <Physics gravity={[0, -40, 0]} timeStep={isMobile ? 1 / 30 : 1 / 60}>
          <Band isMobile={isMobile} profileImage={profileImage} />
        </Physics>
        <Environment blur={0.75}>
          <Lightformer
            intensity={2}
            color="white"
            position={[0, -1, 5]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={3}
            color="white"
            position={[-1, -1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={3}
            color="white"
            position={[1, 1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={10}
            color="white"
            position={[-10, 0, 14]}
            rotation={[0, Math.PI / 2, Math.PI / 3]}
            scale={[100, 10, 1]}
          />
        </Environment>
      </Canvas>
    </div>
  );
}

// ID Card Component
function IDCard({ isMobile, profileImage }: { isMobile: boolean; profileImage?: string }) {
  // Load custom image if provided
  const texture = profileImage ? useTexture(profileImage) : null;
  // If texture exists, update it to center/cover
  if (texture) {
    texture.center.set(0.5, 0.5);
  }

  return (
    <group scale={2.2} position={[0, -1.2, -0.05]}>
      {/* Card Base */}
      <RoundedBox args={[0.9, 1.25, 0.02]} radius={0.05} smoothness={4}>
        <meshPhysicalMaterial
          color="#050505"
          clearcoat={0.5}
          clearcoatRoughness={0.15}
          roughness={0.3}
          metalness={0.5}
        />
      </RoundedBox>

      {/* Card Content Group */}
      <group position={[0, 0, 0.011]}>

        {/* Photo Area */}
        {texture ? (
          <mesh position={[0, 0.15, 0]}>
            <planeGeometry args={[0.8, 0.8]} />
            <meshBasicMaterial map={texture} transparent toneMapped={false} />
          </mesh>
        ) : (
          // Fallback Profile Placeholder
          <mesh position={[0, 0.2, 0]}>
            <circleGeometry args={[0.25, 32]} />
            <meshStandardMaterial color="#333" />
          </mesh>
        )}

        {/* Name Text */}
        <Text
          position={[0, -0.32, 0.01]}
          fontSize={0.08}
          color="white"
          fontWeight="bold"
          anchorX="center"
          anchorY="middle"
        >
          Karl
        </Text>

        {/* Tag Pill */}
        <group position={[0, -0.45, 0.01]}>
          <RoundedBox args={[0.5, 0.08, 0.01]} radius={0.04} smoothness={4}>
            <meshStandardMaterial color="#dcfce7" />
          </RoundedBox>
          <Text
            position={[0, 0, 0.01]}
            fontSize={0.04}
            color="#166534"
            fontWeight="bold"
            anchorX="center"
            anchorY="middle"
          >
            Full Stack
          </Text>
        </group>

        {/* Role Text */}
        <Text
          position={[0, -0.55, 0.01]}
          fontSize={0.035}
          color="#a1a1aa"
          anchorX="center"
          anchorY="middle"
        >
          Web Developer
        </Text>

      </group>

      {/* Clip/Hook */}
      <mesh position={[0, 0.65, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.06, 0.015, 8, 16]} />
        <meshStandardMaterial color="#888888" metalness={0.9} roughness={0.3} />
      </mesh>
    </group>
  );
}

function Band({ maxSpeed = 50, minSpeed = 0, isMobile = false, profileImage }: { maxSpeed?: number; minSpeed?: number; isMobile?: boolean; profileImage?: string }) {
  const band = useRef<any>(null);
  const fixed = useRef<any>(null);
  const j1 = useRef<any>(null);
  const j2 = useRef<any>(null);
  const j3 = useRef<any>(null);
  const card = useRef<any>(null);

  const vec = new THREE.Vector3();
  const ang = new THREE.Vector3();
  const rot = new THREE.Vector3();
  const dir = new THREE.Vector3();

  const segmentProps = {
    type: 'dynamic' as const,
    canSleep: true,
    angularDamping: 4,
    linearDamping: 4
  };

  const [curve] = useState(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3()
      ])
  );

  const [dragged, drag] = useState<THREE.Vector3 | false>(false);
  const [hovered, hover] = useState(false);

  // Create texture for the strap
  const [strapTexture, setStrapTexture] = useState<THREE.CanvasTexture>();

  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 128; // Aspect ratio for strap
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Background
      ctx.fillStyle = '#101010';
      ctx.fillRect(0, 0, 1024, 128);

      // Text
      ctx.fillStyle = 'white';
      ctx.font = 'bold 40px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.letterSpacing = '4px';

      // Draw repeated text
      const text = "CREATIVE DEV   CREATIVE DEV   CREATIVE DEV   CREATIVE DEV";
      ctx.fillText(text, 512, 64);

      // Add some lines/borders
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(0, 10);
      ctx.lineTo(1024, 10);
      ctx.moveTo(0, 118);
      ctx.lineTo(1024, 118);
      ctx.stroke();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.repeat.set(1, 1); // Adjust repeat in material if supported or here
    setStrapTexture(tex);
  }, []);

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3, card, [
    [0, 0, 0],
    [0, 1.45, 0]
  ]);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab';
      return () => void (document.body.style.cursor = 'auto');
    }
  }, [hovered, dragged]);

  useFrame((state, delta) => {
    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach(ref => ref.current?.wakeUp());
      card.current?.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z
      });
    }

    if (fixed.current) {
      [j1, j2].forEach(ref => {
        if (!ref.current.lerped) ref.current.lerped = new THREE.Vector3().copy(ref.current.translation());
        const clampedDistance = Math.max(0.1, Math.min(1, ref.current.lerped.distanceTo(ref.current.translation())));
        ref.current.lerped.lerp(
          ref.current.translation(),
          delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed))
        );
      });

      curve.points[0].copy(j3.current.translation());
      curve.points[1].copy(j2.current.lerped);
      curve.points[2].copy(j1.current.lerped);
      curve.points[3].copy(fixed.current.translation());
      band.current.geometry.setPoints(curve.getPoints(isMobile ? 16 : 32));

      ang.copy(card.current.angvel());
      rot.copy(card.current.rotation());
      card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z });
    }
  });

  curve.curveType = 'chordal';

  return (
    <>
      <group position={[isMobile ? 0 : 3, 4, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[2, 0, 0]}
          ref={card}
          {...segmentProps}
          type={dragged ? 'kinematicPosition' : 'dynamic'}
        >
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e: any) => (e.target.releasePointerCapture(e.pointerId), drag(false))}
            onPointerDown={(e: any) => (
              e.target.setPointerCapture(e.pointerId),
              drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation())))
            )}
          >
            <IDCard isMobile={isMobile} profileImage={profileImage} />
          </group>
        </RigidBody>
      </group>

      <mesh ref={band}>
        {/* @ts-ignore */}
        <meshLineGeometry />
        {/* @ts-ignore */}
        <meshLineMaterial
          color="white"
          depthTest={false}
          resolution={isMobile ? [1000, 2000] : [1000, 1000]}
          lineWidth={0.8}
          transparent
          opacity={1}
          map={strapTexture}
          repeat={new THREE.Vector2(4, 1)}
        />
      </mesh>
    </>
  );
}
