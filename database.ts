import { DatabaseSync } from 'node:sqlite';

// Opens or creates a local database file named 'todo.db'
export const db = new DatabaseSync('todos.db');

db.exec(`
    CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    completed INTEGER DEFAULT 0
  )
    `)

db.exec(`
    CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL
    )
  `)