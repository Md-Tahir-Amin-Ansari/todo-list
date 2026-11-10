/**
 * @file userRepository.ts
 * @brief Manages db interaction regarding user management
 */

import { db } from '../db/database.ts';
import type { User, UserDB } from '../types.ts';


/**
 * @brief Inserts a new user into the database.
 * @param name Unique Username
 * @param email User's email
 * @param passwordHash Argon-2hashed password
 * @returns The created user object(wihtout password)
 * @throws DuplicateUserError if the username is already taken.
 */
export function createUser(name: string, email: string, passwordHash: string): User {
    if (findUserByName(name)) {
        throw new DuplicateUserError
    } else {
        const statement = db.prepare(`INSERT INTO users (name,email,password_hash) VALUES (?,?,?)`)
        const result = statement.run(name, email, passwordHash)
        const responseStatement = db.prepare(`SELECT id, name, email FROM users WHERE id = ?`)
        const user = responseStatement.get(result.lastInsertRowid) as User
        return user
    }
}
/**
 * @brief Fetches a user record by their username.
 * @param name Username to query.
 * @returns Full UserDB (including password hash for authentication) or undefined.
 */
export function findUserByName(name: string): UserDB | undefined {
    const statement = db.prepare(`SELECT * FROM users WHERE name = ?`)
    const user = statement.get(name) as UserDB | undefined
    if (user) {
        return user
    } else {
        return undefined
    }
}
/**
 * @brief Looks up a safe user profile by ID.
 * @param id User ID primary key.
 * @returns User profile or undefined.
 */
export function findUserById(id: number): User | undefined {
    const statement = db.prepare(`SELECT id,name, email FROM users WHERE id = ?`)
    const user = statement.get(id) as User | undefined
    return user ?? undefined
}
/**
 * @brief Custom error thrown when attempting to register an existing username.
 */
export class DuplicateUserError extends Error {
    constructor(message = "A user with this name already exist.") {
        super(message)
    }
}