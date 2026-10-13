import { db } from './database.ts';

export function createSession(user_id: number): [string, number] | undefined {
    // insert into session table and return its session id
    const statement = db.prepare(`INSERT INTO sessions (user_id, expires_at) VALUES (?,(unixepoch('now', '+1 hour'))) RETURNING id,expires_at`)
    const result = statement.get(user_id) as { id: string; expires_at: number } | undefined;
    if (result && typeof result.id === 'string' && typeof result.expires_at === 'number') {
        return [result.id, result.expires_at]
    } else {
        return undefined
    }
}

export function validateSession(sessionID: string):number | undefined {
    const statement = db.prepare(`SELECT user_id FROM sessions WHERE id = ? AND expires_at > unixepoch('now')`)
    const user = statement.get(sessionID) as { user_id: number } | undefined;
    if (user) {
        return user.user_id
    } else {
        return undefined
    }
}