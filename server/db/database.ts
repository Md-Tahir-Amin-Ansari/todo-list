/**
 * @file database.ts
 * @brief SQLite database connection and schema initialization.
 * @details Creates or connects to the local `todos.db` file using Node.js native `DatabaseSync`.
 *          Automatically executes table creation migrations for `users`, `sessions`, and `todos`.
 */
import { DatabaseSync } from 'node:sqlite';

// Opens or creates a local database file named 'todo.db'
/**
 * @brief Synchronous SQLite database client instance.
 * @note Shares a single database connection across all repository layers.
 */
export const db = new DatabaseSync('todos.db');
// ==========================================
// Table Migrations / Initialization
// ==========================================
/**
 * @brief Schema definition for the `todos` table.
 * @details Stores tasks linked to a specific user via `user_id` foreign key.
 */
db.exec(`
    CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    completed INTEGER DEFAULT 0,
    priority TEXT DEFAULT 'medium',
    due_date TEXT,
    tag TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )
    `)
/**
 * @brief Schema definition for the `users` table.
 * @details Stores registered user accounts with unique username and Argon2 password hash.
 */
db.exec(`
    CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    email TEXT NOT NULL
    )
  `)
/**
 * @brief Schema definition for the `sessions` table.
 * @details Manages stateful auth sessions with random 128-bit hex tokens and UNIX expiry timestamps.
 */
db.exec(`
    CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
    user_id INTEGER NOT NULL,
    expires_at INTEGER NOT NULL,
    revoked_at INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

  `)