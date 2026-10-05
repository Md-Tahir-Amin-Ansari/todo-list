import { db } from './database.ts';

type User = {
    id: number,
    name : string
}
type UserDB = {
    id: number,
    name : string,
    password_hash : string
}

export function createUser(name:string, passwordHash: string): User {
    const statement = db.prepare(`INSERT INTO users (name,password_hash) VALUES (?,?)`)
    const result = statement.run(name, passwordHash)
    const responseStatement = db.prepare(`SELECT id, name FROM users WHERE id = ?`)
    const user = responseStatement.get(result.lastInsertRowid) as User
    return user
}

export function findUserByName(name:string): UserDB | undefined {
    const statement = db.prepare(`SELECT * FROM users WHERE name = ?`)
    const user = statement.get(name) as UserDB | undefined
    if (user){
        return user
    }else{
        return undefined
    }
}
