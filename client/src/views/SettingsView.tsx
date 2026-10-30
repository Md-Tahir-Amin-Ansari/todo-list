import { Button } from "@/components/tailgrids/core/button";


interface SettingsViewProps {
    user?: {
        name: string;
        email: string;
    };
    isDarkMode: boolean;
    onToggleDarkMode: () => void;
    onLogout: () => void;
}

export function SettingsView({
    user,
    isDarkMode,
    onToggleDarkMode,
    onLogout,
}: SettingsViewProps) {
    return (
        <div className="max-w-3xl space-y-6">
            <h1 className="text-2xl font-bold text-title-50">Settings</h1>

            <div className="space-y-3">
                {/* 1. Dark Mode Row */}
                <div className="flex items-center justify-between p-4 rounded-2xl border border-base-200 bg-white">
                    <div>
                        <h2 className="text-sm font-semibold text-title-50">Dark mode</h2>
                        <p className="text-xs text-text-100">Switch the app theme</p>
                    </div>

                    <button
                        type="button"
                        role="switch"
                        aria-checked={isDarkMode}
                        onClick={onToggleDarkMode}
                        className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isDarkMode ? "bg-primary-500" : "bg-base-300"
                            }`}
                    >
                        <span
                            className={`pointer-events-none inline-block size-6 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${isDarkMode ? "translate-x-5" : "translate-x-0"
                                }`}
                        />
                    </button>
                </div>

                {/* 2. Account & Logout Row */}
                <div className="flex items-center justify-between p-4 rounded-2xl border border-base-200 bg-white">
                    <div>
                        <h2 className="text-sm font-semibold text-title-50">Account</h2>
                        <p className="text-xs text-text-100">
                            {user ? `${user.name} · ${user.email}` : "Guest · Not signed in"}
                        </p>
                    </div>

                    <Button variant="danger" size="sm" onClick={onLogout}>
                        Log out
                    </Button>
                </div>
            </div>
        </div>
    );
}
