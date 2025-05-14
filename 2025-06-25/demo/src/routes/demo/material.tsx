import { OrbitControls, PerspectiveCamera, SpotLight } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/demo/material")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="bg-black size-screen h-screen">
      <Canvas>
        <PerspectiveCamera />
        <OrbitControls />

        <directionalLight />
{/*<ambientLight />*/}


        <mesh>
         <torusKnotGeometry />
      {/*<meshNormalMaterial />*/}
          {/*<meshBasicMaterial color="#5DDCB9" />*/}
          {/*<meshMatcapMaterial color="#5DDCB9" />*/}
         {/*<meshLambertMaterial color="#5DDCB9" />*/}
         {/* <meshToonMaterial color="#5DDCB9" />*/}
          <meshStandardMaterial color="#5DDCB9" />
        </mesh>


      </Canvas>
    </div>
  );
}
