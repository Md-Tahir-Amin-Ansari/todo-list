import { getMe, login, logout, register } from "@/api/auth";
import type { User, AuthCredentials } from "@/types";
import { useEffect, useState } from "react";

export function useAuth() {

    const [user, setUser] = useState<User | null>(null);
    const [authLoading, setAuthLoading] = useState<boolean>(false);
    const [authError, setAuthError] = useState<string | null>();
    const [isCheckingSession, setIsCheckingSession] = useState<boolean>(true);

    // authentication
    const handleAuth = async (credentials: AuthCredentials, isSignUp: boolean) => {
        try {
            setAuthLoading(true);
            setAuthError(null);
            const loggedInUser = isSignUp ? await register(credentials) : await login(credentials);
            if (!loggedInUser || !loggedInUser.id) {
                throw new Error("Authentication failed: invalid response received.");
            }
            setUser(loggedInUser);
        } catch (error) {
            setAuthError(error instanceof Error ? error.message : "Something went wrong");
        } finally {
            setAuthLoading(false)
        }
    }
    useEffect(() => {
        async function checkSession() {
            try {
                const currentUser = await getMe();
                setUser(currentUser);
            } catch {
                setUser(null);
            } finally {
                setIsCheckingSession(false)
            }
        }
        checkSession();
        //  useeffect doesnt allow async function passed directly
    }, []);
    // handle task create

    // dark mode 


    // logout
    const handleLogout = async () => {
        try {
            await logout();
            setUser(null);
        } catch (err) {
            console.error("Failed to logout:", err);
        }
    };
    return {
        user,
        authLoading,
        authError,
        isCheckingSession,
        handleAuth,
        handleLogout,
    };
}