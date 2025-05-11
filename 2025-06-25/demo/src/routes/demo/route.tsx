import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/demo')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div className="size-full min-h-screen h-screen"><Outlet /></div>
}
