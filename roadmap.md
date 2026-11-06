
---

### Phase 1: Feature Polish & UX Completion
- [ ] **1.1 Today View Empty State**: Show a celebratory empty state when all tasks for today are completed or none exist.
- [ ] **1.2 Sidebar Badges**: Display live counts (e.g., tasks due today on "Today", active count on "All tasks").
- [ ] **1.3 Toast / Error Feedback**: Add lightweight feedback for failed network actions (task save/delete errors).

---

### Phase 2: Doxygen Documentation (Building the Professional Habit)
- [ ] **2.1 Doxygen Setup & Config**: Create `Doxyfile` configured for TypeScript / JavaScript (using JSDoc/Doxygen-compatible tags).
- [ ] **2.2 Document Backend API & Core**: Document routes, middleware (auth verification), controllers, and DB queries with Doxygen tags (`@brief`, `@param`, `@return`, `@throws`).
- [ ] **2.3 Document Frontend Hooks & Views**: Document custom hooks (`useAuth`, `useTasks`, `useTheme`) and core components.
- [ ] **2.4 Generate HTML Docs**: Build the documentation site locally.

---

### Phase 3: Testing & Storybook
- [ ] **3.1 Backend Integration & Unit Tests**:
  - Set up Vitest or Jest with `supertest` for Express.
  - Test Auth endpoints (`/auth/register`, `/auth/login`, `/auth/me`, cookies).
  - Test Todos CRUD endpoints with authorization checks (ensuring user A cannot edit user B's tasks).
- [ ] **3.2 Complete Storybook**:
  - Add stories for `TaskItem` (default, completed, overdue, high priority).
  - Add stories for `TaskModal`, `TaskFilters`, and `EmptyState`.

---

### Phase 4: Dockerization (Containerizing the Full Stack)
- [ ] **4.1 Backend `Dockerfile`**: Multi-stage Node/Express container with clean production build.
- [ ] **4.2 Frontend `Dockerfile`**: Multi-stage build serving Vite production output with Nginx.
- [ ] **4.3 `docker-compose.yml`**: Orchestrate Frontend, Backend, and local Database with networks and environment variables so the whole app spins up with a single `docker compose up`.

---

### Phase 5: Production Deployment & GitHub Showcase
- [ ] **5.1 Environment Configuration**: Dynamic API URLs (`VITE_API_URL`), secure cookie flags, and CORS origin headers for production.
- [ ] **5.2 Cloud Deployment**: Deploy backend (Render/Railway), database, and frontend (Vercel).
- [ ] **5.3 Professional README**: Architecture diagram, tech badges, live demo link, and local Docker setup instructions.

---
