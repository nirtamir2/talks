import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/demo/geometry")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="size-screen h-screen bg-black">
      <Canvas>
        <PerspectiveCamera />
        <OrbitControls />
        <ambientLight />
        <mesh position={[-6, 0, 0]}>
          <sphereGeometry />
          <meshNormalMaterial />
        </mesh>
        <mesh position={[-3, 0, 0]}>
          <boxGeometry />
          <meshNormalMaterial />
        </mesh>
        <mesh position={[0, 0, 0]}>
          <coneGeometry />
          <meshNormalMaterial />
        </mesh>
        <mesh position={[3, 0, 0]}>
          <cylinderGeometry />
          <meshNormalMaterial />
        </mesh>
        <mesh position={[6, 0, 0]}>
          <torusGeometry />
          <meshNormalMaterial />
        </mesh>
        <mesh position={[6, 0, 0]}>
          <planeGeometry />
          <meshNormalMaterial />
        </mesh>
      </Canvas>
    </div>
  );
}
