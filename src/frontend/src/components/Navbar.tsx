import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { LogOut, Zap } from "lucide-react";
import { useState } from "react";
import { useGitHubAuth } from "../hooks/useGitHubAuth";
import { useGoogleAuth } from "../hooks/useGoogleAuth";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useIsAdmin } from "../hooks/useQueries";
import LoginModal from "./LoginModal";

export default function Navbar() {
  const { identity, clear, isLoggingIn } = useInternetIdentity();
  const { data: isAdmin } = useIsAdmin();
  const {
    googleUser,
    signOut: googleSignOut,
    isGoogleSignedIn,
  } = useGoogleAuth();
  const {
    gitHubUser,
    signOut: gitHubSignOut,
    isGitHubSignedIn,
  } = useGitHubAuth();
  const [loginOpen, setLoginOpen] = useState(false);

  const principal = identity?.getPrincipal().toString();
  const iiInitials = principal ? principal.slice(0, 2).toUpperCase() : "??";

  const isSignedIn = !!identity || isGoogleSignedIn || isGitHubSignedIn;

  const handleSignOut = () => {
    if (identity) clear();
    if (isGoogleSignedIn) googleSignOut();
    if (isGitHubSignedIn) gitHubSignOut();
  };

  // Determine the active social user (prefer Google, fallback to GitHub)
  const activeUser = googleUser
    ? { name: googleUser.name, picture: googleUser.picture }
    : gitHubUser
      ? {
          name: gitHubUser.name || gitHubUser.login,
          picture: gitHubUser.avatar_url,
        }
      : null;

  return (
    <>
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
              style={{
                background: "linear-gradient(135deg, #24E6FF, #8B5CFF)",
              }}
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
            {isSignedIn && (
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
            {isSignedIn ? (
              <>
                <div className="flex items-center gap-2">
                  {activeUser ? (
                    <Avatar
                      className="w-8 h-8"
                      style={{ border: "1px solid rgba(36,230,255,0.4)" }}
                    >
                      <AvatarImage
                        src={activeUser.picture}
                        alt={activeUser.name}
                      />
                      <AvatarFallback
                        className="text-xs font-bold"
                        style={{
                          background:
                            "linear-gradient(135deg, #24E6FF22, #8B5CFF22)",
                          color: "#24E6FF",
                        }}
                      >
                        {activeUser.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <Avatar
                      className="w-8 h-8"
                      style={{ border: "1px solid rgba(36,230,255,0.4)" }}
                    >
                      <AvatarFallback
                        className="text-xs font-bold"
                        style={{
                          background:
                            "linear-gradient(135deg, #24E6FF22, #8B5CFF22)",
                          color: "#24E6FF",
                        }}
                      >
                        {iiInitials}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  {activeUser && (
                    <span
                      className="hidden md:block text-xs"
                      style={{ color: "#A7B0C2" }}
                    >
                      {activeUser.name.split(" ")[0]}
                    </span>
                  )}
                </div>
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
                  onClick={handleSignOut}
                  className="text-xs"
                  style={{ color: "#6E768A" }}
                  data-ocid="nav.button"
                  disabled={isLoggingIn}
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
                  onClick={() => setLoginOpen(true)}
                  className="text-xs btn-liquid"
                  style={{
                    background: "#0E1422",
                    borderColor: "#2A3143",
                    color: "#A7B0C2",
                  }}
                  data-ocid="nav.button"
                >
                  Sign in
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}
