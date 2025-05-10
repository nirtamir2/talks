import { Canvas } from '@react-three/fiber'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/demo/basic')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Canvas>
      <ambientLight />
      <mesh>
        <boxGeometry />
        <meshStandardMaterial />
      </mesh>
    </Canvas>
  )
}
