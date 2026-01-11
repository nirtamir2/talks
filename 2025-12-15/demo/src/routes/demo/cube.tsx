import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/demo/cube")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Canvas>
      <PerspectiveCamera />
      <OrbitControls />
      <ambientLight />
    </Canvas>
  );
}
