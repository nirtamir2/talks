import { Canvas } from '@react-three/fiber'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/demo/empty')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Canvas />
}
