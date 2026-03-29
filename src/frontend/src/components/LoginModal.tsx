import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGitHubAuth } from "../hooks/useGitHubAuth";
import { useGoogleAuth } from "../hooks/useGoogleAuth";

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

const GoogleIcon = () => (
  <svg
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    role="img"
    aria-label="Google logo"
    style={{
      width: "18px",
      height: "18px",
      marginRight: "10px",
      flexShrink: 0,
    }}
  >
    <title>Google</title>
    <path
      fill="#EA4335"
      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
    />
    <path
      fill="#4285F4"
      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
    />
    <path
      fill="#FBBC05"
      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
    />
    <path
      fill="#34A853"
      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.35-8.16 2.35-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
    />
    <path fill="none" d="M0 0h48v48H0z" />
  </svg>
);

const GitHubIcon = () => (
  <svg
    viewBox="0 0 24 24"
    role="img"
    aria-label="GitHub logo"
    style={{
      width: "18px",
      height: "18px",
      marginRight: "10px",
      flexShrink: 0,
      fill: "white",
    }}
  >
    <title>GitHub</title>
    <path d="M12 0C5.37 0 0 5.373 0 12c0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.929.43.372.823 1.102.823 2.222 0 1.606-.015 2.898-.015 3.293 0 .322.216.694.825.576C20.565 21.795 24 17.298 24 12c0-6.627-5.373-12-12-12z" />
  </svg>
);

export default function LoginModal({ open, onClose }: LoginModalProps) {
  const { signIn: googleSignIn } = useGoogleAuth();
  const { signIn: gitHubSignIn } = useGitHubAuth();

  const handleGoogleSignIn = () => {
    googleSignIn();
    onClose();
  };

  const handleGitHubSignIn = () => {
    onClose();
    gitHubSignIn();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="sm:max-w-md"
        style={{
          background: "rgba(14, 20, 34, 0.97)",
          border: "1px solid rgba(36, 230, 255, 0.2)",
          backdropFilter: "blur(24px)",
          boxShadow:
            "0 0 60px rgba(36,230,255,0.08), 0 24px 64px rgba(0,0,0,0.6)",
        }}
        data-ocid="login.modal"
      >
        <DialogHeader className="text-center pb-2">
          <div
            className="mx-auto mb-4 w-12 h-12 rounded-xl flex items-center justify-center"
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
          <DialogTitle
            className="text-xl font-bold tracking-tight"
            style={{ color: "#F2F6FF" }}
          >
            Sign in to HalfBuilt
          </DialogTitle>
          <DialogDescription
            className="text-sm mt-1"
            style={{ color: "#A7B0C2" }}
          >
            Access the verified marketplace for digital assets
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 mt-2">
          {/* Official Google Sign-In Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            data-ocid="login.primary_button"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              padding: "11px 24px",
              background: "#ffffff",
              color: "#3c4043",
              border: "1px solid #dadce0",
              borderRadius: "4px",
              fontSize: "14px",
              fontWeight: 500,
              fontFamily: "'Google Sans', Roboto, Arial, sans-serif",
              letterSpacing: "0.25px",
              cursor: "pointer",
              transition: "box-shadow 0.15s ease, background 0.15s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                "0 1px 3px rgba(60,64,67,0.3), 0 4px 8px rgba(60,64,67,0.15)";
              (e.currentTarget as HTMLButtonElement).style.background =
                "#f8faff";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
              (e.currentTarget as HTMLButtonElement).style.background =
                "#ffffff";
            }}
          >
            <GoogleIcon />
            Sign in with Google
          </button>

          {/* GitHub Sign-In Button */}
          <button
            type="button"
            onClick={handleGitHubSignIn}
            data-ocid="login.secondary_button"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              padding: "11px 24px",
              background: "rgba(36, 41, 46, 0.9)",
              color: "#ffffff",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "4px",
              fontSize: "14px",
              fontWeight: 500,
              fontFamily:
                "'Inter Tight', -apple-system, BlinkMacSystemFont, sans-serif",
              letterSpacing: "0.25px",
              cursor: "pointer",
              transition:
                "box-shadow 0.15s ease, background 0.15s ease, border-color 0.15s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "rgba(48, 54, 61, 0.95)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                "0 0 12px rgba(36,230,255,0.1), 0 4px 16px rgba(0,0,0,0.3)";
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                "rgba(255,255,255,0.2)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "rgba(36, 41, 46, 0.9)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                "rgba(255,255,255,0.1)";
            }}
          >
            <GitHubIcon />
            Sign in with GitHub
          </button>

          <div className="relative flex items-center gap-3 my-1">
            <div
              className="flex-1 h-px"
              style={{ background: "rgba(42,49,67,0.8)" }}
            />
            <span className="text-xs" style={{ color: "#4A5568" }}>
              Secured by OAuth 2.0
            </span>
            <div
              className="flex-1 h-px"
              style={{ background: "rgba(42,49,67,0.8)" }}
            />
          </div>

          <p className="text-xs text-center pb-1" style={{ color: "#4A5568" }}>
            By signing in, you agree to our terms. Your identity is verified and
            never stored on external servers.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
