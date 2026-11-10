/**
 * @file sessionRepository.ts
 * @brief Manages db interaction regarding session management
 */

import { db } from './../db/database.ts';

/**
 * @brief Creates a new session in the database for a user.
 * @details Inserts a session record with an expiration set to 1 hour from now (unixepoch('now', '+1 hour')).
 * @param user_id ID of the authenticated user.
 * @returns Tuple [sessionID, expiresAtTimestamp] or undefined if creation failed.
 */
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
/**
 * @brief Checks if a session ID is valid, active, and unexpired.
 * @details Queries the database ensuring expires_at > unixepoch('now') and revoked_at IS NULL.
 * @param sessionID The 128-bit hex session token from the cookie.
 * @returns The user_id if valid, or undefined if expired/revoked/invalid.
 */
export function validateSession(sessionID: string): number | undefined {
    const statement = db.prepare(`SELECT user_id FROM sessions WHERE id = ? AND expires_at > unixepoch('now') AND revoked_at IS NULL`)
    const user = statement.get(sessionID) as { user_id: number } | undefined;
    if (user) {
        return user.user_id
    } else {
        return undefined
    }
}
/**
 * @brief Revokes an active session.
 * @details Sets revoked_at = unixepoch('now') for the matching active session.
 * @param sessionID Session token to revoke.
 * @returns Tuple [sessionID, revokedAtTimestamp] or undefined if not found.
 */
export function logout(sessionID: string): [string, number] | undefined {

    const statement = db.prepare(`UPDATE sessions SET revoked_at = unixepoch('now') WHERE id = ? AND revoked_at IS NULL AND expires_at > unixepoch('now') RETURNING id,revoked_at`)
    const user = statement.get(sessionID) as { id: string, revoked_at: number } | undefined;
    if (user) {
        return [user.id, user.revoked_at]
    } else {
        return undefined
    }
}