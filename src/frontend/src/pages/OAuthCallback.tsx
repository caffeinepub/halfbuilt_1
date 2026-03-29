import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useActor } from "../hooks/useActor";
import { useGitHubAuth } from "../hooks/useGitHubAuth";

type CallbackState = "loading" | "success" | "error";

export default function OAuthCallback() {
  const navigate = useNavigate();
  const { actor: backend } = useActor();
  const { setGitHubUser } = useGitHubAuth();
  const [status, setStatus] = useState<CallbackState>("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const state = params.get("state");
    const error = params.get("error");

    if (error) {
      setErrorMessage(`GitHub returned an error: ${error}`);
      setStatus("error");
      return;
    }

    const storedState = sessionStorage.getItem("github_oauth_state");

    if (!code || !state || state !== storedState) {
      setErrorMessage("Invalid OAuth state. Please try signing in again.");
      setStatus("error");
      return;
    }

    sessionStorage.removeItem("github_oauth_state");

    if (!backend) return;

    (async () => {
      try {
        // Step 1: Exchange code for access token
        const accessToken = await backend.exchangeGitHubCode(code);

        // Step 2: Fetch + sync GitHub profile, which also sets the ICP role
        const profile = await backend.syncGitHubProfile(accessToken);

        // Step 3: Persist to context + localStorage
        setGitHubUser({
          login: profile.githubLogin ?? "",
          name: profile.name,
          avatar_url: profile.avatarUrl ?? "",
          email: profile.email ?? null,
        });

        setStatus("success");

        // Step 4: Redirect to dashboard
        setTimeout(() => {
          navigate({ to: "/my-projects" });
        }, 1200);
      } catch (err) {
        console.error("GitHub OAuth failed:", err);
        setErrorMessage(
          err instanceof Error
            ? err.message
            : "Authentication failed. Please try again.",
        );
        setStatus("error");
      }
    })();
  }, [backend, navigate, setGitHubUser]);

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        background:
          "linear-gradient(180deg, #05070B 0%, #070B12 50%, #0A1020 100%)",
      }}
    >
      <div
        className="flex flex-col items-center gap-6 p-10 rounded-2xl max-w-sm w-full mx-4"
        style={{
          background: "rgba(14, 20, 34, 0.95)",
          border: "1px solid rgba(36, 230, 255, 0.2)",
          backdropFilter: "blur(24px)",
          boxShadow:
            "0 0 60px rgba(36,230,255,0.08), 0 24px 64px rgba(0,0,0,0.6)",
        }}
      >
        {/* Logo */}
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{
            background:
              "linear-gradient(135deg, rgba(36,230,255,0.15), rgba(139,92,255,0.15))",
            border: "1px solid rgba(36,230,255,0.25)",
          }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <title>HalfBuilt</title>
            <path
              d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
              stroke="#24E6FF"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {status === "loading" && (
          <>
            {/* Spinner */}
            <div
              className="w-10 h-10 rounded-full border-2 animate-spin"
              style={{
                borderColor: "rgba(36,230,255,0.15)",
                borderTopColor: "#24E6FF",
              }}
              data-ocid="oauth.loading_state"
            />
            <div className="text-center">
              <p
                className="text-base font-semibold tracking-tight"
                style={{ color: "#F2F6FF" }}
              >
                Completing GitHub sign-in...
              </p>
              <p className="text-sm mt-1" style={{ color: "#A7B0C2" }}>
                Verifying your identity
              </p>
            </div>
          </>
        )}

        {status === "success" && (
          <>
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{
                background: "rgba(36,230,255,0.1)",
                border: "1px solid rgba(36,230,255,0.3)",
              }}
              data-ocid="oauth.success_state"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <title>Success</title>
                <path
                  d="M20 6L9 17l-5-5"
                  stroke="#24E6FF"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="text-center">
              <p
                className="text-base font-semibold tracking-tight"
                style={{ color: "#F2F6FF" }}
              >
                Signed in with GitHub
              </p>
              <p className="text-sm mt-1" style={{ color: "#A7B0C2" }}>
                Redirecting to your dashboard...
              </p>
            </div>
          </>
        )}

        {status === "error" && (
          <>
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{
                background: "rgba(255,60,80,0.1)",
                border: "1px solid rgba(255,60,80,0.3)",
              }}
              data-ocid="oauth.error_state"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <title>Error</title>
                <path
                  d="M18 6L6 18M6 6l12 12"
                  stroke="#FF3C50"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div className="text-center">
              <p
                className="text-base font-semibold tracking-tight"
                style={{ color: "#F2F6FF" }}
              >
                Sign-in failed
              </p>
              <p className="text-sm mt-2" style={{ color: "#A7B0C2" }}>
                {errorMessage}
              </p>
              <button
                type="button"
                onClick={() => navigate({ to: "/" })}
                className="mt-4 text-sm px-4 py-2 rounded-lg"
                style={{
                  background: "rgba(36,230,255,0.1)",
                  border: "1px solid rgba(36,230,255,0.2)",
                  color: "#24E6FF",
                  cursor: "pointer",
                }}
                data-ocid="oauth.cancel_button"
              >
                Back to Home
              </button>
            </div>
          </>
        )}

        <p className="text-xs" style={{ color: "#2A3142" }}>
          HalfBuilt · Verified Asset Marketplace
        </p>
      </div>
    </div>
  );
}
