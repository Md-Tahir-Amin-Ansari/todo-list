/**
 * @file auth.ts
 * @brief HTTP client API functions for authentication endpoints.
 */
import { type User, type AuthCredentials } from '@/types.ts'

/**
 * @brief Sends login request with credentials.
 * @param credentials User name and password.
 * @returns Promise resolving to the authenticated `User` profile.
 * @throws Error if network request fails or server returns error status.
 */
export async function login(credentials: AuthCredentials): Promise<User> {

    const res = await fetch('/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: credentials.name, password: credentials.password })
    });
    if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Failed to login")
    } else {
        return await res.json() as User
    }

}
/**
 * @brief Registers a new user account.
 * @param credentials Name, email, and password.
 * @returns Promise resolving to the newly created `User` profile.
 * @throws Error if validation fails or username/email already exists.
 */
export async function register(credentials: AuthCredentials): Promise<User> {
    const res = await fetch('/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: credentials.name, email: credentials.email, password: credentials.password })
    });
    if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Failed to Register")
    } else {
        return await res.json() as User
    }

}
/**
 * @brief Logs out the current user session.
 * @returns Promise resolving when session cookie is cleared.
 * @throws Error if logout request fails.
 */
export async function logout(): Promise<void> {
    const res = await fetch('/auth/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
    });
    if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Failed to Logout")
    }
}
/**
 * @brief Fetches currently authenticated user profile from active session cookie.
 * @returns Promise resolving to `User` profile.
 * @throws Error if session is missing or expired (401).
 */
export async function getMe(): Promise<User> {
    const res = await fetch('/auth/me');
    if (!res.ok) {
        throw new Error('Not authenticated');
    }
    return await res.json() as User;
}