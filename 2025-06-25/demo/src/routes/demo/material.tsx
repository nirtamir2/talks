import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/demo/material')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className='bg-black size-screen h-screen'>
    <Canvas>
      <PerspectiveCamera/>
      <OrbitControls/>
      <ambientLight />
      <mesh>
        <boxGeometry  />
        <meshNormalMaterial  />
      </mesh>
    </Canvas>
    </div>
  )
}
