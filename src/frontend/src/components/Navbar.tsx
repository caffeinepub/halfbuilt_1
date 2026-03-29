import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { LogOut, Zap } from "lucide-react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useIsAdmin } from "../hooks/useQueries";

export default function Navbar() {
  const { identity, login, clear, isLoggingIn } = useInternetIdentity();
  const { data: isAdmin } = useIsAdmin();

  const principal = identity?.getPrincipal().toString();
  const initials = principal ? principal.slice(0, 2).toUpperCase() : "??";

  return (
    <header
      className="sticky top-0 z-50"
      style={{
        background: "rgba(5, 7, 11, 0.8)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(42, 49, 67, 0.6)",
      }}
    >
      <div className="container mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 group"
          data-ocid="nav.link"
        >
          <div
            className="w-7 h-7 rounded flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #24E6FF, #8B5CFF)" }}
          >
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span
            className="text-lg font-bold tracking-tight"
            style={{ color: "#F2F6FF" }}
          >
            HalfBuilt
          </span>
        </Link>

        {/* Center Nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/directory"
            className="text-sm font-medium transition-colors hover:text-neon-cyan"
            style={{ color: "#A7B0C2" }}
            data-ocid="nav.link"
          >
            Browse
          </Link>
          <Link
            to="/directory"
            className="text-sm font-medium transition-colors hover:text-neon-cyan"
            style={{ color: "#A7B0C2" }}
            data-ocid="nav.link"
          >
            Categories
          </Link>
          <Link
            to="/"
            className="text-sm font-medium transition-colors hover:text-neon-cyan"
            style={{ color: "#A7B0C2" }}
            data-ocid="nav.link"
          >
            About
          </Link>
          {identity && (
            <Link
              to="/my-projects"
              className="text-sm font-medium transition-colors hover:text-neon-cyan"
              style={{ color: "#A7B0C2" }}
              data-ocid="nav.link"
            >
              My Projects
            </Link>
          )}
          {isAdmin && (
            <Link
              to="/admin"
              className="text-sm font-medium transition-colors"
              style={{ color: "#A56BFF" }}
              data-ocid="nav.link"
            >
              Admin
            </Link>
          )}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {identity ? (
            <>
              <Avatar
                className="w-8 h-8"
                style={{ border: "1px solid rgba(36,230,255,0.4)" }}
              >
                <AvatarFallback
                  className="text-xs font-bold"
                  style={{
                    background: "linear-gradient(135deg, #24E6FF22, #8B5CFF22)",
                    color: "#24E6FF",
                  }}
                >
                  {initials}
                </AvatarFallback>
              </Avatar>
              <Link to="/submit">
                <Button
                  size="sm"
                  className="btn-liquid text-xs font-semibold"
                  style={{
                    background: "linear-gradient(135deg, #22D8E6, #8B5CFF)",
                    color: "#071017",
                    border: "none",
                  }}
                  data-ocid="nav.primary_button"
                >
                  Submit Project
                </Button>
              </Link>
              <Button
                size="sm"
                variant="ghost"
                onClick={clear}
                className="text-xs"
                style={{ color: "#6E768A" }}
                data-ocid="nav.button"
              >
                <LogOut className="w-3.5 h-3.5" />
              </Button>
            </>
          ) : (
            <>
              <Link to="/submit">
                <Button
                  size="sm"
                  className="btn-liquid text-xs font-semibold"
                  style={{
                    background: "linear-gradient(135deg, #22D8E6, #8B5CFF)",
                    color: "#071017",
                    border: "none",
                  }}
                  data-ocid="nav.primary_button"
                >
                  Submit Project
                </Button>
              </Link>
              <Button
                size="sm"
                variant="outline"
                onClick={login}
                disabled={isLoggingIn}
                className="text-xs btn-liquid"
                style={{
                  background: "#0E1422",
                  borderColor: "#2A3143",
                  color: "#A7B0C2",
                }}
                data-ocid="nav.button"
              >
                {isLoggingIn ? "Connecting..." : "Sign in"}
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
