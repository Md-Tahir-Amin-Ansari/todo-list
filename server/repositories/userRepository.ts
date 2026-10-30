import { db } from '../db/database.ts';
import type { User, UserDB } from '../types.ts';



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

export function findUserByName(name: string): UserDB | undefined {
    const statement = db.prepare(`SELECT * FROM users WHERE name = ?`)
    const user = statement.get(name) as UserDB | undefined
    if (user) {
        return user
    } else {
        return undefined
    }
}

export function findUserById(id: number): User | undefined {
    const statement = db.prepare(`SELECT id,name, email FROM users WHERE id = ?`)
    const user = statement.get(id) as User | undefined
    return user ?? undefined
}

export class DuplicateUserError extends Error {
    constructor(message = "A user with this name already exist.") {
        super(message)
    }
}