import { Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer, OrbitControls, useAnimations, useGLTF } from "@react-three/drei";
import { SkeletonUtils } from "three-stdlib";
import * as THREE from "three";

import type { HandItem, ModelKey } from "@/lib/character-model";

const MODELS: Record<ModelKey, string> = {
  knight: "/models/knight.glb",
  raider: "/models/raider.glb",
  soldier: "/models/soldier.glb",
  undead: "/models/undead.glb",
  caster: "/models/caster.glb",
  dwarf: "/models/dwarf.glb",
  orc: "/models/orc.glb",
  human: "/models/human.glb",
};
const PROPS = {
  sword: "/models/sword.glb",
  shield: "/models/shield.glb",
  bow: "/models/bow.glb",
};

// Tuning: figure size and where props sit in each hand (arm-local units, pre-scale).
const FIGURE_HEIGHT = 2.1;
const HAND_OFFSET = new THREE.Vector3(0, -0.13, 0.02);
const PROP_POSE: Record<"sword" | "shield" | "bow", { rot: [number, number, number]; scale: number; offset?: [number, number, number] }> = {
  sword: { rot: [Math.PI / 2, 0, 0], scale: 0.9 },
  shield: { rot: [0, Math.PI / 2, 0], scale: 0.8, offset: [0.05, 0, 0] },
  bow: { rot: [Math.PI / 2, 0, Math.PI / 2], scale: 0.9 },
};

function useCloned(url: string) {
  const { scene, animations } = useGLTF(url);
  const cloned = useMemo(() => {
    const c = SkeletonUtils.clone(scene);
    c.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
      }
    });
    return c;
  }, [scene]);
  return { cloned, animations };
}

function Prop({ kind, parent }: { kind: "sword" | "shield" | "bow"; parent: THREE.Object3D | null }) {
  const { cloned } = useCloned(PROPS[kind]);
  useLayoutEffect(() => {
    if (!parent) return;
    const pose = PROP_POSE[kind];
    cloned.position.copy(HAND_OFFSET);
    if (pose.offset) cloned.position.add(new THREE.Vector3(...pose.offset));
    cloned.rotation.set(...pose.rot);
    cloned.scale.setScalar(pose.scale);
    parent.add(cloned);
    return () => {
      parent.remove(cloned);
    };
  }, [cloned, parent, kind]);
  return null;
}

function Figure({ model, right, left, onReady }: { model: ModelKey; right: HandItem; left: HandItem; onReady: () => void }) {
  const { cloned, animations } = useCloned(MODELS[model]);
  const group = useRef<THREE.Group>(null);
  const { actions, names } = useAnimations(animations, group);
  const [arms, setArms] = useState<{ r: THREE.Object3D | null; l: THREE.Object3D | null }>({ r: null, l: null });

  const fit = useMemo(() => {
    const box = new THREE.Box3().setFromObject(cloned);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const s = FIGURE_HEIGHT / Math.max(size.y, 0.001);
    return { s, pos: [-center.x * s, -box.min.y * s, -center.z * s] as [number, number, number] };
  }, [cloned]);

  useLayoutEffect(() => {
    setArms({ r: cloned.getObjectByName("arm-right") ?? null, l: cloned.getObjectByName("arm-left") ?? null });
  }, [cloned]);

  useEffect(() => {
    const clip = right && left ? "holding-both" : right ? "holding-right" : left ? "holding-left" : "idle";
    const name = names.includes(clip) ? clip : names.includes("idle") ? "idle" : names[0];
    const action = name ? actions[name] : undefined;
    action?.reset().fadeIn(0.3).play();
    onReady();
    return () => {
      action?.fadeOut(0.2);
    };
  }, [actions, names, right, left, onReady]);

  return (
    <group ref={group} scale={fit.s} position={fit.pos}>
      <primitive object={cloned} />
      {right && <Prop kind={right} parent={arms.r} />}
      {left && <Prop kind={left} parent={arms.l} />}
    </group>
  );
}

function Pedestal() {
  const texture = useMemo(() => {
    const size = 512;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    const g = ctx.createRadialGradient(size / 2, size / 2, 20, size / 2, size / 2, size / 2);
    g.addColorStop(0, "#3a3a44");
    g.addColorStop(1, "#22232b");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
    ctx.strokeStyle = "#c9a14a";
    ctx.globalAlpha = 0.55;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size * 0.42, 0, Math.PI * 2);
    ctx.stroke();
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size * 0.36, 0, Math.PI * 2);
    ctx.stroke();
    for (let i = 0; i < 24; i++) {
      const a = (i / 24) * Math.PI * 2;
      ctx.save();
      ctx.translate(size / 2 + Math.cos(a) * size * 0.39, size / 2 + Math.sin(a) * size * 0.39);
      ctx.rotate(a);
      ctx.fillStyle = "#c9a14a";
      ctx.fillRect(-3, -8, 6, 16);
      ctx.restore();
    }
    const t = new THREE.CanvasTexture(canvas);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);

  return (
    <group>
      <mesh receiveShadow position={[0, -0.08, 0]}>
        <cylinderGeometry args={[1.35, 1.45, 0.16, 64]} />
        <meshStandardMaterial color="#2a2b33" roughness={0.8} metalness={0.2} />
      </mesh>
      <mesh receiveShadow rotation-x={-Math.PI / 2} position={[0, 0.002, 0]}>
        <circleGeometry args={[1.35, 64]} />
        <meshStandardMaterial map={texture} roughness={0.7} metalness={0.25} />
      </mesh>
      <mesh position={[0, -0.08, 0]}>
        <torusGeometry args={[1.4, 0.025, 12, 96]} />
        <meshStandardMaterial color="#d4a94f" metalness={0.9} roughness={0.3} />
      </mesh>
    </group>
  );
}

export default function CharacterViewer({
  model,
  right,
  left,
}: {
  model: ModelKey;
  right: HandItem;
  left: HandItem;
}) {
  const [ready, setReady] = useState(false);
  const onReady = useMemo(() => () => setReady(true), []);

  useEffect(() => setReady(false), [model]);

  return (
    <div className="absolute inset-0" data-scene-ready={ready ? "true" : undefined}>
      <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 1.7, 5.2], fov: 32 }} gl={{ alpha: true, antialias: true }}>
        <hemisphereLight args={["#fff1d6", "#1b2030", 0.55]} />
        <directionalLight
          castShadow
          position={[3, 6, 4]}
          intensity={2.2}
          color="#ffe2b0"
          shadow-mapSize={[1024, 1024]}
          shadow-radius={8}
          shadow-bias={-0.0005}
          shadow-camera-left={-3}
          shadow-camera-right={3}
          shadow-camera-top={4}
          shadow-camera-bottom={-1}
        />
        <directionalLight position={[-4, 3, -3]} intensity={1.1} color="#7fd0dc" />
        <Environment resolution={128}>
          <Lightformer intensity={1.6} position={[0, 5, 0]} scale={[10, 10, 1]} rotation-x={Math.PI / 2} />
          <Lightformer intensity={0.8} color="#f2c66d" position={[-5, 1, -1]} rotation-y={Math.PI / 2} scale={[20, 1, 1]} />
          <Lightformer intensity={0.6} color="#88c8d0" position={[5, 1, 1]} rotation-y={-Math.PI / 2} scale={[20, 1, 1]} />
        </Environment>

        <Pedestal />
        <ContactShadows position={[0, 0.005, 0]} opacity={0.55} scale={4} blur={2.6} far={2.5} />

        <Suspense fallback={null}>
          <Figure key={model} model={model} right={right} left={left} onReady={onReady} />
        </Suspense>

        <OrbitControls
          target={[0, 1.05, 0]}
          enablePan={false}
          minDistance={3.2}
          maxDistance={7}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2.05}
          autoRotate
          autoRotateSpeed={0.8}
          enableDamping
        />
      </Canvas>
      {!ready && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="size-10 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
        </div>
      )}
    </div>
  );
}


Object.values(PROPS).forEach((u) => useGLTF.preload(u));
