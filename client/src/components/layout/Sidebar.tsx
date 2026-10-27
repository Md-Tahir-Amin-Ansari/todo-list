import {
    Sidebar,
    SidebarHeader,
    SidebarContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarFooter,
} from '@/components/tailgrids/core/sidebar';
import {
    Calendar,
    Gear1,
    Home
} from "@tailgrids/icons";
import type { User, ViewType } from '@/types';



interface SidebarProps {
    currentView: ViewType;
    onSelectView: (view: ViewType) => void;
    user?: User;
}

const NAV_ITEMS = [
    { id: 'today', label: 'Today', icon: Calendar },
    { id: 'all', label: 'All tasks', icon: Home },
    { id: 'settings', label: 'Settings', icon: Gear1 },
] as const;


export function AppSidebar({ currentView, onSelectView, user }: SidebarProps) {
    return (

        <Sidebar>
            <SidebarHeader className="px-3 pt-6 pb-4">
                <span className="text-xl font-extrabold tracking-tight text-title-50">
                    Doable
                </span>
            </SidebarHeader>
            <SidebarContent>
                <SidebarMenu>
                    {NAV_ITEMS.map((item) => {
                        const Icon = item.icon;
                        return (
                            <SidebarMenuItem key={item.id}>
                                <SidebarMenuButton
                                    isActive={currentView === item.id}
                                    onClick={() => onSelectView(item.id)}
                                >
                                    <Icon className="size-4" />
                                    <span>{item.label}</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        );
                    })}
                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter className="border-t border-base-200 p-3">
                <div className="flex items-center gap-3">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-500 font-bold text-white text-xs">
                        {user?.name ? user.name.charAt(0).toUpperCase() : '?'}
                    </div>
                    <div className="min-w-0">
                        <p className="truncate font-semibold text-sm text-title-50">{user?.name ?? 'Guest'}</p>
                        <p className="truncate text-xs text-text-100">{user?.email ?? 'Sign in'}</p>
                    </div>
                </div>
            </SidebarFooter>
        </Sidebar>
    )
}