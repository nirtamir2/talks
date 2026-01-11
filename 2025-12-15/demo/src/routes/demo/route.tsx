import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/demo")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="size-full h-screen">
      <Outlet />
    </div>
  );
}
