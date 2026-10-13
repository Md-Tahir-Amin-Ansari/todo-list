Bro, 🎉 you've completed authentication, session management, and per-user authorization. Let's build on that without jumping ahead too quickly.

I'd suggest this order for your Todo backend:

1\. Commit your working version

Do this first

Save a known-good checkpoint before making further changes.

```
git status
git add .
git commit -m "Add session authentication and todo authorization"
```

2\. Document authentication and authorization

Add the middleware, session lifecycle, cookie settings, ownership-filtered SQL, HTTP status codes, and actual code references to your backend reference sheet.

3\. Introduce automated backend tests

Use a test framework such as Vitest with Supertest to test registration, login, logout, session expiry, and cross-user access automatically.

4\. Learn database migrations and constraints

Practise changing your SQLite schema without deleting the database, enforcing foreign keys, and managing test data safely.

5\. Return to the frontend

Rebuild the Todo UI in React, connect login and registration, handle `401` responses, and protect the user experience when a session expires.

Let's start with Step 1. Run `git status` and tell me what it shows. We'll make sure your working authentication changes are safely committed before moving on.

I'll continue with your preferred approach: you'll write the code yourself, and I'll guide you through the reasoning rather than simply handing you complete implementations. 💪
Bro, I actually like that plan. 😄 You want to finish the main application first, understand what features it really needs, and then design the test suite and database migrations around the finished feature set. That makes sense for a learning project—as long as we keep doing basic manual checks while developing.

And yes, RBAC, Docker, CI/CD, and JWT are important backend concepts, but they solve different problems. We shouldn't automatically add all of them just because they're common in production projects. Let's decide which ones fit your Todo app and which ones are better as later learning exercises.

## Which backend concepts should we add?

1\. Authorization and RBAC

Already started

Authorization checks what a user is allowed to access. You've already implemented an important form of it: users can only access their own todos, enforced through `user_id` checks in your database queries.

RBAC means Role-Based Access Control. For example, an app might have `user`, `admin`, and `moderator` roles with different permissions. Your current app doesn't need those roles unless you introduce features that require them.

Plan: Keep the current ownership-based authorization. Add RBAC later if we introduce admin functionality.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://cheatsheetseries.owasp.org\&sz=32)

OWASP Cheat Sheet Series

+1



2\. JWT vs. sessions

Keep current sessions

You've implemented database-backed sessions, with expiry, revocation, and an HTTP-only cookie. That's a perfectly valid way to authenticate a browser-based application.

JWTs are another way to represent authenticated claims. They can be useful for certain API architectures, but they aren't automatically more secure or necessary. Switching now would add complexity without solving an obvious problem in your project.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://cheatsheetseries.owasp.org\&sz=32)

OWASP Cheat Sheet Series

+1



Plan: Finish the session system, then learn JWT separately—possibly through a small API authentication exercise.

3\. Docker

Learn after the core app

Docker packages your app and its runtime dependencies into a container, helping it run more consistently across development and deployment environments.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://docs.docker.com\&sz=32)

Docker Docs

+1



Plan: Once the app works, write a `Dockerfile`, build an image, and run the app in a container. Because you're using SQLite, we'll also need to make sure the database file persists outside the disposable container filesystem.

4\. CI/CD

After automated tests

CI means Continuous Integration: automatically checking your code when changes are pushed. CD generally refers to continuously delivering or deploying changes.

Plan: Once your tests exist, configure GitHub Actions to install dependencies, run type checks, and execute tests on every push or pull request. Deployment automation can come later.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://github.com\&sz=32)

GitHub



5\. Security hardening

Don't leave this entirely until the end. Some protections should be part of the features we're building:

- Input validation and parameterized SQL queries.
- Authorization checks on every protected operation.
- Safe session handling and logout.
- HTTPS and the `Secure` cookie flag in production.
- Login rate limiting and appropriate CSRF protection for the deployed browser app.

These aren't all new frameworks to bolt on; many are improvements to the code you already have. OWASP's session guidance covers cookie security and server-side session invalidation.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://cheatsheetseries.owasp.org\&sz=32)

OWASP Cheat Sheet Series

+1



## Our revised roadmap 🛠️

Here's the order I'd use for your project:

1. Finish the core Todo app: CRUD, authentication, authorization, and the frontend integration.
2. Update the backend reference sheet: document sessions, authorization, and the code you've actually written.
3. Add automated tests: use the finished features to decide what needs testing.
4. Learn migrations and database design: review schema changes, constraints, indexes, and how to preserve data during upgrades.
5. Containerize with Docker: run the application and preserve its database properly.
6. Set up CI with GitHub Actions: automatically check types and run tests.
7. Add optional advanced features: RBAC if needed, JWT in a separate exercise, and deployment automation.

One distinction worth remembering: authentication tells us who you are; authorization tells us what you're allowed to do; RBAC is just one way to implement authorization. Your current project already teaches you the first two.

My recommendation is to keep the current architecture and finish the product rather than turn it into a collection of technologies. That way, when you learn Docker, CI/CD, migrations, and JWT, you'll understand what problem each one solves—not just how to configure it. 💪