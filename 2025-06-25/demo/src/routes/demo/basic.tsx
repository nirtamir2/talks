import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/demo/basic')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Canvas>
      <PerspectiveCamera/>
      <OrbitControls/>
      <ambientLight />
      <mesh position={[0,1,0]} scale={[2,2,2]} rotation={[Math.PI / 2, 0, 0]}>
        <boxGeometry args={[2, 1, 0.5]}  />
        <meshStandardMaterial color="#0c8cbf" />
      </mesh>
    </Canvas>
  )
}
