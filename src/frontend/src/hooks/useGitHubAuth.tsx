import {
  type PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

const GITHUB_CLIENT_ID = "Ov23li3htjpLY2JkCCL9";
const GITHUB_REDIRECT_URI = "https://halfbuilt.caffeine.ai/oauth/callback";
const STORAGE_KEY = "halfbuilt_github_user";

export type GitHubUser = {
  login: string;
  name: string;
  avatar_url: string;
  email: string | null;
};

type GitHubAuthContextType = {
  gitHubUser: GitHubUser | null;
  signIn: () => void;
  signOut: () => void;
  setGitHubUser: (user: GitHubUser) => void;
  isGitHubSignedIn: boolean;
};

const GitHubAuthContext = createContext<GitHubAuthContextType | undefined>(
  undefined,
);

export function GitHubAuthProvider({ children }: PropsWithChildren) {
  const [gitHubUser, setGitHubUserState] = useState<GitHubUser | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? (JSON.parse(stored) as GitHubUser) : null;
    } catch {
      return null;
    }
  });

  const signIn = useCallback(() => {
    const state =
      Math.random().toString(36).substring(2) + Date.now().toString(36);
    sessionStorage.setItem("github_oauth_state", state);
    const params = new URLSearchParams({
      client_id: GITHUB_CLIENT_ID,
      redirect_uri: GITHUB_REDIRECT_URI,
      scope: "user:email",
      state,
    });
    window.location.href = `https://github.com/login/oauth/authorize?${params.toString()}`;
  }, []);

  const signOut = useCallback(() => {
    setGitHubUserState(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const setGitHubUser = useCallback((user: GitHubUser) => {
    setGitHubUserState(user);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  }, []);

  const value = useMemo<GitHubAuthContextType>(
    () => ({
      gitHubUser,
      signIn,
      signOut,
      setGitHubUser,
      isGitHubSignedIn: gitHubUser !== null,
    }),
    [gitHubUser, signIn, signOut, setGitHubUser],
  );

  return (
    <GitHubAuthContext.Provider value={value}>
      {children}
    </GitHubAuthContext.Provider>
  );
}

export function useGitHubAuth(): GitHubAuthContextType {
  const ctx = useContext(GitHubAuthContext);
  if (!ctx)
    throw new Error("useGitHubAuth must be used within GitHubAuthProvider");
  return ctx;
}
