# Technical Debt & Backend Roadmap

This document tracks all backend updates, database schema changes, and endpoint enhancements deferred while focusing on frontend completion.

---

## 1. Database Schema Extensions (`database.ts`)

- [ ] **Add `email` to `users` Table**:
  - Current: `users (id, name, password_hash)`
  - Target: Add optional/unique `email TEXT` column for notifications and account settings display.
- [ ] **Add Task Metadata to `todos` Table**:
  - Current: `todos (id, user_id, name, completed)`
  - Target: Add metadata columns:
    - `priority TEXT DEFAULT 'medium'` ('high' | 'medium' | 'low')
    - `due_date TEXT` (ISO date string or nullable)
    - `tag TEXT` ('Design', 'React', 'Personal', etc.)

---

## 2. Repository Layer Updates (`todoRepository.ts` & `userRepository.ts`)

- [ ] **Update `postTodo`**:
  - Accept `priority`, `due_date`, and `tag` when inserting new tasks.
- [ ] **Update `patchTodo`**:
  - Current: Only updates `completed`:
    ```sql
    UPDATE todos SET completed = ? WHERE id = ? AND user_id = ?
    ```
  - Target: Allow dynamically updating any subset of `name`, `completed`, `priority`, `due_date`, and `tag`.
- [ ] **Update `createUser`**:
  - Allow inserting optional `email`.

---

## 3. API Route Updates (`server.ts`)

- [ ] **Expand `PATCH /todos/:id`**:
  - Allow validating and updating `name`, `priority`, `dueDate`, and `tag` in `req.body`, not just `completed`.
- [ ] **Update `POST /todos`**:
  - Accept and persist the full `TaskInput` payload (`name`, `priority`, `dueDate`, `tag`).
- [ ] **Session Verification Route**:
  - Add `GET /auth/me` to verify active session cookie on page refresh so user state persists across browser reloads without re-logging in.
