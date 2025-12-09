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
        {/* <mesh position={[-6, 0, 0]}>
          <sphereGeometry />
          <meshNormalMaterial wireframe/>
        </mesh>
        <mesh position={[-3, 0, 0]}>
          <boxGeometry />
          <meshNormalMaterial wireframe/>
        </mesh> */}
        <mesh position={[0, 0, 0]}>
          <coneGeometry />
          <meshNormalMaterial wireframe />
        </mesh>
        {/* <mesh position={[3, 0, 0]}>
          <cylinderGeometry />
          <meshNormalMaterial wireframe/>
        </mesh>
        <mesh position={[6, 0, 0]}>
          <torusGeometry />
          <meshNormalMaterial wireframe/>
        </mesh>
        <mesh position={[6, 0, 0]}>
          <planeGeometry />
          <meshNormalMaterial wireframe/>
        </mesh> */}
      </Canvas>
    </div>
  );
}
