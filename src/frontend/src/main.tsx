import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ReactDOM from "react-dom/client";
import App from "./App";
import { GitHubAuthProvider } from "./hooks/useGitHubAuth";
import { GoogleAuthProvider } from "./hooks/useGoogleAuth";
import { InternetIdentityProvider } from "./hooks/useInternetIdentity";
import "./index.css";

BigInt.prototype.toJSON = function () {
  return this.toString();
};

declare global {
  interface BigInt {
    toJSON(): string;
  }
}

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <InternetIdentityProvider>
      <GitHubAuthProvider>
        <GoogleAuthProvider>
          <App />
        </GoogleAuthProvider>
      </GitHubAuthProvider>
    </InternetIdentityProvider>
  </QueryClientProvider>,
);
