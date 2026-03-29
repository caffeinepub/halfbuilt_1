import {
  type PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: Record<string, unknown>) => void;
          prompt: (
            callback?: (notification: {
              isNotDisplayed: () => boolean;
              isSkippedMoment: () => boolean;
            }) => void,
          ) => void;
          disableAutoSelect: () => void;
          cancel: () => void;
        };
      };
    };
  }
}

export type GoogleUser = {
  email: string;
  name: string;
  picture: string;
  credential: string;
};

type GoogleAuthContextType = {
  googleUser: GoogleUser | null;
  signIn: () => void;
  signOut: () => void;
  isGoogleSignedIn: boolean;
};

const STORAGE_KEY = "halfbuilt_google_user";
const CLIENT_ID =
  "968798542238-2190uklo8pumaqpssjid1uqj7dm1c975.apps.googleusercontent.com";

const GoogleAuthContext = createContext<GoogleAuthContextType | undefined>(
  undefined,
);

function decodeJWT(token: string): Record<string, unknown> {
  const parts = token.split(".");
  if (parts.length !== 3) throw new Error("Invalid JWT");
  const payload = parts[1];
  const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
  return JSON.parse(decoded);
}

export function GoogleAuthProvider({ children }: PropsWithChildren) {
  const [googleUser, setGoogleUser] = useState<GoogleUser | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? (JSON.parse(stored) as GoogleUser) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const initGoogle = () => {
      if (!window.google) return;
      window.google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: (response: { credential: string }) => {
          try {
            const payload = decodeJWT(response.credential);
            const user: GoogleUser = {
              email: payload.email as string,
              name: payload.name as string,
              picture: payload.picture as string,
              credential: response.credential,
            };
            setGoogleUser(user);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
          } catch (err) {
            console.error("Failed to decode Google credential", err);
          }
        },
        auto_select: false,
      });
    };

    if (window.google) {
      initGoogle();
    } else {
      const interval = setInterval(() => {
        if (window.google) {
          initGoogle();
          clearInterval(interval);
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, []);

  const signIn = useCallback(() => {
    if (!window.google) {
      console.error("Google Identity Services not loaded");
      return;
    }
    window.google.accounts.id.prompt();
  }, []);

  const signOut = useCallback(() => {
    if (window.google) {
      window.google.accounts.id.disableAutoSelect();
    }
    setGoogleUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const value = useMemo<GoogleAuthContextType>(
    () => ({
      googleUser,
      signIn,
      signOut,
      isGoogleSignedIn: googleUser !== null,
    }),
    [googleUser, signIn, signOut],
  );

  return (
    <GoogleAuthContext.Provider value={value}>
      {children}
    </GoogleAuthContext.Provider>
  );
}

export function useGoogleAuth(): GoogleAuthContextType {
  const ctx = useContext(GoogleAuthContext);
  if (!ctx)
    throw new Error("useGoogleAuth must be used within GoogleAuthProvider");
  return ctx;
}
