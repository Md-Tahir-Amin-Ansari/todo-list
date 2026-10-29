import { type User, type AuthCredentials } from '@/types.ts'

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

export async function getMe(): Promise<User> {
    const res = await fetch('/auth/me');
    if (!res.ok) {
        throw new Error('Not authenticated');
    }
    return await res.json() as User;
}