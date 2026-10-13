# Backend Reference Sheet — Todo App

## 1. Authentication and Route Protection

### Purpose

Authentication verifies who is making an HTTP request. In this project, the server identifies a user by validating their session cookie against the SQLite database.

### Request flow

1. The browser sends a request with its session cookie.
2. `cookie-parser` parses incoming cookies.
3. The `authenticate` middleware reads `req.cookies.sessionID`.
4. `validateSession()` checks that the session exists and has not expired.
5. The middleware attaches the authenticated user's ID to `req.user_id`.
6. `next()` allows the request to continue to its route handler.

If the cookie is missing or the session is invalid, the middleware returns HTTP `401 Unauthorized`.

### Actual code references

- `server.ts` — Express configuration and route declarations.
- `middleware.ts` — `authenticate(req, res, next)`.
- `sessionRepository.ts` — `validateSession(sessionID)`.
- `database.ts` — `sessions` table definition.

### Key distinction

`cookie-parser` parses incoming cookies. It does not authenticate users.

`authenticate` validates the session and establishes the user's identity for the rest of the request.

`next()` continues request processing. It does not store user information.

### Route protection rules

- `POST /auth/register` — public.
- `POST /auth/login` — public.
- Todo endpoints — protected by `authenticate`.
- Logout — should require authentication if it invalidates the current user's session.

### Important security distinction

Authentication answers: "Who are you?"

Authorization answers: "Are you allowed to access this resource?"

A valid session must not grant access to another user's todos. Every relevant database operation must enforce ownership.

### Testing checklist

- No cookie → `401`.
- Random session ID → `401`.
- Expired session → `401`.
- Valid session → protected handler executes.
- Authenticated user attempting to access another user's todo → access denied or resource not found, according to the API's design.