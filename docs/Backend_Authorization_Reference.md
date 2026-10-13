# Backend Authorization Reference

**Project:** Express + TypeScript + SQLite Todo App\
**Status:** Per-user authorization implemented; manual `curl.exe` tests
passed\
**Last updated:** 13 October 2026

------------------------------------------------------------------------

## 1. What is authorization?

**Authentication** answers: "Who is making this request?"\
**Authorization** answers: "What is this user allowed to access or
change?"

In this app:

-   Authentication is handled by the session cookie and `authenticate`
    middleware.
-   Authorization is enforced by checking that each todo belongs to the
    authenticated user.
-   The client must never be trusted to choose its own `user_id`.

A user being logged in does **not** mean they can access every row in
the database.

## 2. How identity reaches a route

Relevant files:

-   `server.ts` --- registers middleware and routes.
-   `middleware.ts` --- authenticates requests and attaches the
    authenticated user's ID to `req.user_id`.
-   `sessionRepository.ts` --- validates sessions and handles session
    revocation.
-   `express.d.ts` --- extends Express's `Request` type to include
    `user_id`.

The request flow is:

1.  The browser sends the `sessionID` cookie.
2.  `cookie-parser` makes the incoming cookie available as
    `req.cookies`.
3.  `authenticate` validates the session.
4.  The middleware sets `req.user_id` for the authenticated user.
5.  The protected route uses that ID when accessing the repository.

The precise implementation of the middleware is the source of truth;
route handlers should not independently trust a user ID supplied in the
request body.

## 3. The critical rule: use the authenticated identity

Correct pattern in `server.ts`:

``` ts
if (req.user_id !== undefined) {
    const result = getAllTodos(req.user_id);
    return res.json(result);
}

return res.status(401).json({ error: "Unauthorized" });
```

The explicit `!== undefined` check is useful because user IDs are
numeric, and it makes the intended check clear. The type of
`req.user_id` is optional, even though `authenticate` should set it
before the route handler runs.

**Incorrect pattern:**

``` ts
const result = getAllTodos(req.body.user_id);
```

The request body is controlled by the client. A malicious user could
send another person's ID. Identity must come from the validated session,
not from user-supplied JSON.

## 4. Enforce ownership in SQL

Relevant file: `todoRepository.ts`

Every operation on a specific user's todos should include the
authenticated user's ID in its database query.

### Read all todos

``` ts
export function getAllTodos(user_id: number): TodoAPP[] {
    const result = db
        .prepare(`SELECT * FROM todos WHERE user_id = ?`)
        .all(user_id) as Array<TodoDB>;

    return mapTodos(result);
}
```

**Why:** the query returns only rows owned by that user. `.all()`
returns an array, including an empty array when the user has no todos.

### Read one todo

``` ts
export function getTodo(
    id: number,
    user_id: number
): TodoAPP | undefined {
    const result = db
        .prepare(`SELECT * FROM todos WHERE id = ? AND user_id = ?`)
        .get(id, user_id) as TodoDB | undefined;

    if (result) {
        return mapTodo(result);
    }

    return undefined;
}
```

**Why:** the row must match both the requested ID and the authenticated
owner. A todo belonging to another user appears not to exist to this
request.

### Create a todo

The insert must associate the new row with the authenticated user:

``` ts
INSERT INTO todos (name, user_id) VALUES (?, ?)
```

The repository function accepts both the todo name and `user_id`, and
the route supplies `req.user_id`.

After inserting, scope the follow-up query by **both** the new todo ID
and its owner:

``` sql
SELECT * FROM todos WHERE id = ? AND user_id = ?
```

This keeps the read-back query consistent with the ownership rule.

### Update a todo

``` ts
UPDATE todos
SET completed = ?
WHERE id = ? AND user_id = ?
```

The repository receives the ID, authenticated user's ID, and new
completion state.

If no row matches, the repository's boolean result is false. The route
responds with `404 Not Found`.

### Delete a todo

``` ts
DELETE FROM todos
WHERE id = ? AND user_id = ?
```

A delete operation must also check ownership in the SQL itself. Do not
fetch a row, trust the client, and then perform an unscoped delete.

### Why parameter placeholders matter

The `?` placeholders bind values separately from SQL text. Continue
using prepared statements with parameters rather than building SQL by
concatenating untrusted input.

## 5. Route-to-repository ownership map

  -----------------------------------------------------------------------------------------
  Route                   Repository call                           Required ownership
                                                                    behavior
  ----------------------- ----------------------------------------- -----------------------
  `GET /todos`            `getAllTodos(req.user_id)`                List only the current
                                                                    user's todos

  `GET /todos/:id`        `getTodo(id, req.user_id)`                Read only an owned todo

  `POST /todos`           `postTodo(name, req.user_id)`             Assign the new todo to
                                                                    the current user

  `PATCH /todos/:id`      `patchTodo(id, req.user_id, completed)`   Update only an owned
                                                                    todo

  `PATCH /todos/:id`      `getTodo(id, req.user_id)`                Read back using the
  response lookup                                                   same authenticated
                                                                    identity

  `DELETE /todos/:id`     `deleteTodo(id, req.user_id)`             Delete only an owned
                                                                    todo
  -----------------------------------------------------------------------------------------

All five routes use `authenticate` middleware. Keep ownership filtering
in the repository too: route middleware alone does not prevent a query
from returning another user's row.

## 6. HTTP status codes used by this app

-   **200 OK** --- a read, update, delete, or logout operation
    succeeded, depending on the endpoint.
-   **201 Created** --- registration or todo creation succeeded.
-   **400 Bad Request** --- the submitted input is invalid, such as a
    malformed todo ID or invalid registration data.
-   **401 Unauthorized** --- the request has no valid authenticated
    session or credentials are invalid.
-   **404 Not Found** --- the requested todo does not exist for the
    authenticated user. This avoids revealing another user's todo.
-   **409 Conflict** --- registration conflicts with an existing
    username.
-   **500 Internal Server Error** --- an unexpected server-side failure;
    return a generic error instead of exposing database details.

A subtle distinction: an invalid ID and a missing owned todo are
different cases. For example, `GET /todos/abc` can return `400`, while
`GET /todos/123` can return `404` if no matching owned todo exists.

## 7. Defensive checks and middleware

`req.user_id` is optional in the TypeScript declaration, so a route may
need to check it before passing it to a repository function that
requires a `number`.

Prefer an explicit missing-identity response (`401`) rather than
returning `400 Invalid input`. The user ID is not user-submitted input;
it is part of the authenticated request context.

If `authenticate` is guaranteed to reject requests without a valid
session, the route-level checks are defensive. Keep the middleware as
the primary authentication boundary.

## 8. Manual authorization test plan

Run the server, then use two distinct cookie jars with `curl.exe`.
Register two test accounts, log in as each user, and create a todo as
User A.

  -----------------------------------------------------------------------
  Test                                Expected result
  ----------------------------------- -----------------------------------
  A requests `GET /todos`             A sees A's todo

  A requests `GET /todos/:id` for     `200 OK`
  their todo                          

  B requests `GET /todos` with B's    B does not see A's todo
  cookie                              

  B requests A's todo by ID           `404 Not Found`

  B tries to `PATCH` A's todo         `404 Not Found`; A's row remains
                                      unchanged

  B tries to `DELETE` A's todo        `404 Not Found`; A's row remains

  A reads their todo after B's        `200 OK`; todo still exists and is
  attempts                            unchanged

  A logs out                          `200 OK`

  A reuses the old session cookie     `401 Unauthorized`

  Request has no cookie               `401 Unauthorized`

  Login uses a wrong password         `401 Unauthorized`

  Registration uses invalid input     `400 Bad Request`
  -----------------------------------------------------------------------

**Project milestone:** the above manual tests were reported as passing
on 13 October 2026.

For repeatable testing, use a fresh pair of test accounts or substitute
new usernames if the existing ones are already registered. Use the
actual todo ID returned by the create response; do not assume it is
always `1`.

## 9. Common authorization mistakes

1.  **Trusting `req.body.user_id`.** A client can alter it. Use
    `req.user_id` from authenticated middleware.
2.  **Filtering only by todo ID.** `WHERE id = ?` alone does not enforce
    ownership. Include `AND user_id = ?`.
3.  **Protecting the route but not the query.** Authentication proves
    identity; it does not automatically scope SQL results.
4.  **Scoping the update but not the follow-up read.** Use the same
    authenticated user ID for both.
5.  **Returning another user's row to distinguish ownership.** Respond
    with `404` for a todo that isn't available to the current user.
6.  **Leaving a branch without a response.** Ensure every route path
    sends a response or passes an error onward; otherwise, requests can
    hang.
7.  **Treating missing identity as invalid client input.** Return
    `401 Unauthorized` for an absent authenticated identity.
8.  **Building SQL with string concatenation.** Use prepared statements
    and parameter placeholders.

## 10. Database integrity reminder

The `todos` table should store a `user_id` foreign key to `users(id)`.
In SQLite, foreign-key enforcement must be enabled for each database
connection, for example with:

``` sql
PRAGMA foreign_keys = ON;
```

A foreign key helps prevent todos from referencing nonexistent users,
but it does **not** replace ownership filters in queries. Both are
useful and solve different problems.

## 11. Future improvements

After this milestone, consider:

-   Automated tests for two-user isolation, invalid sessions, and
    logout.
-   A small helper or shared error-handling pattern to reduce repeated
    route boilerplate.
-   Integration tests that use a disposable test database.
-   Production cookie settings appropriate to deployment, including
    HTTPS (`Secure`) and an intentional `SameSite`/CSRF strategy.
-   Reviewing CORS configuration before deployment; permissive defaults
    may be unsuitable for a production app.

These are follow-up improvements, not reasons to dismiss the passing
manual tests.

------------------------------------------------------------------------

## Quick mental model

**Authenticate the request → obtain the trusted user ID → include that
ID in every data-access query → return only data the user owns → test
with two separate users.**

That is the central authorization pattern implemented in this Todo app.
