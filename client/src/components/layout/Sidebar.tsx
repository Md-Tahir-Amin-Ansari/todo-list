import {
    Sidebar,
    SidebarHeader,
    SidebarContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarFooter,
    SidebarGroup
} from '@/components/tailgrids/core/sidebar';
import {
    Calendar,
    Gear1,
    Home
} from "@tailgrids/icons";
import type { SidebarProps } from '@/types';





const NAV_ITEMS = [
    { id: 'today', label: 'Today', icon: Calendar },
    { id: 'all', label: 'All tasks', icon: Home },
    { id: 'settings', label: 'Settings', icon: Gear1 },
] as const;


export function AppSidebar({ currentView, onSelectView, user, todayCount, allCount }: SidebarProps) {
    return (

        <Sidebar collapsible="icon">
            <SidebarHeader className="p-3 group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
                <div className="flex items-center gap-2.5">
                    {/* Consistent icon box */}
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary-500 font-extrabold text-white text-base shadow-sm">
                        D
                    </div>

                    {/* Brand name hidden when collapsed */}
                    <span className="text-xl font-extrabold tracking-tight text-title-50 group-data-[collapsible=icon]:hidden">
                        Doable
                    </span>
                </div>
            </SidebarHeader>
            <SidebarContent className="px-3 group-data-[collapsible=icon]:px-0">
                <SidebarGroup className="p-0 group-data-[collapsible=icon]:items-center">
                    <SidebarMenu>
                        {NAV_ITEMS.map((item) => {
                            const Icon = item.icon;
                            return (
                                <SidebarMenuItem key={item.id} className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
                                    <SidebarMenuButton
                                        isActive={currentView === item.id}
                                        onClick={() => onSelectView(item.id)}
                                    >
                                        <Icon className="size-4" />
                                        <span className='group-data-[collapsible=icon]:hidden'>{item.label}</span>
                                        {/* Today badge */}
                                        {item.id === 'today' && !!todayCount && (
                                            <span className="ml-auto rounded-full bg-primary-500 px-2 py-0.5 text-xs font-bold text-white  group-data-[collapsible=icon]:hidden">
                                                {todayCount}
                                            </span>
                                        )}
                                        {/* All tasks badge */}
                                        {item.id === 'all' && !!allCount && (
                                            <span className="ml-auto rounded-full bg-base-200 dark:bg-base-700 px-2 py-0.5 text-xs font-semibold text-text-100 dark:text-text-300 group-data-[collapsible=icon]:hidden">
                                                {allCount}
                                            </span>
                                        )}
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            );
                        })}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="border-t border-base-200 p-3 group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:justify-center">
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