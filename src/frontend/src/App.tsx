import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Admin from "./pages/Admin";
import Directory from "./pages/Directory";
import Landing from "./pages/Landing";
import MyProjects from "./pages/MyProjects";
import Submit from "./pages/Submit";

const rootRoute = createRootRoute({
  component: () => (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background:
          "linear-gradient(180deg, #05070B 0%, #070B12 50%, #0A1020 100%)",
      }}
    >
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <Toaster />
    </div>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Landing,
});
const directoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/directory",
  component: Directory,
});
const submitRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/submit",
  component: Submit,
});
const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: Admin,
});
const myProjectsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/my-projects",
  component: MyProjects,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  directoryRoute,
  submitRoute,
  adminRoute,
  myProjectsRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
