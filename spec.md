# HalfBuilt

## Current State
Backend has `exchangeGitHubCode(code)` and `syncGitHubProfile(accessToken)` functions compiled and ready. The `UserProfile` Motoko type now includes `email`, `avatarUrl`, `githubLogin`, and `provider` optional fields. The frontend declarations (`backend.did.js`, `backend.did.d.ts`, `backend.d.ts`, `backend.ts`) still reflect the OLD `UserProfile` (name only) and do NOT expose `exchangeGitHubCode`, `syncGitHubProfile`, or `saveGoogleProfile`. `OAuthCallback.tsx` currently just validates the state param and redirects -- it does not call any backend functions. The GitHub redirect URI mismatch: `useGitHubAuth.tsx` sends users to `/api/auth/callback/github` but the GitHub OAuth app is configured with `https://halfbuilt.caffeine.ai/oauth/callback`.

## Requested Changes (Diff)

### Add
- `/oauth/callback` route in `App.tsx` pointing to `OAuthCallback`
- `exchangeGitHubCode`, `syncGitHubProfile`, `saveGoogleProfile` to all declaration files and `backend.ts`
- GitHub user display in `Navbar.tsx` (avatar + name, matching Google user display)
- `GitHubAuthProvider` wrapper in `main.tsx`

### Modify
- `UserProfile` type everywhere: add `email`, `avatarUrl`, `githubLogin`, `provider` as optional fields
- `OAuthCallback.tsx`: wire the full flow (get code from URL → call `exchangeGitHubCode` → call `syncGitHubProfile` → save to localStorage → update `GitHubAuthContext` → redirect to `/my-projects`)
- `useGitHubAuth.tsx`: fix `GITHUB_REDIRECT_URI` to `https://halfbuilt.caffeine.ai/oauth/callback`
- `Navbar.tsx`: add GitHub signed-in state (show avatar, name, sign out)

### Remove
- Nothing

## Implementation Plan
1. Update `useGitHubAuth.tsx` redirect URI to `/oauth/callback`
2. Add `/oauth/callback` route to `App.tsx` (keep `/api/auth/callback/github` too for safety)
3. Add `GitHubAuthProvider` to `main.tsx`
4. Update Candid declarations (`backend.did.d.ts`, `backend.did.js`) with new `UserProfile` type and new service methods
5. Update `backend.d.ts` and `backend.ts` with new `UserProfile`, `exchangeGitHubCode`, `syncGitHubProfile`, `saveGoogleProfile`
6. Wire `OAuthCallback.tsx` with full backend handshake + localStorage + context update + redirect
7. Update `Navbar.tsx` to show GitHub user avatar and name when signed in via GitHub
