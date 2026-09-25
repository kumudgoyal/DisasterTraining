"use client";

import ProtectedLayout from "@/components/layout/ProtectedLayout";
import { useAuth } from "@/lib/auth";
import { Bell, LogOut, User, Settings } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useNotifications } from "@/hooks/use-notifications";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function Topbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { data } = useNotifications();
  
  const unreadCount = data?.data?.filter((n: any) => !n.read)?.length || 0;

  const handleLogout = async () => {
    logout();
  };

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-4 md:px-6 z-10 shadow-sm">
      <div className="flex items-center md:hidden">
        <span className="text-lg font-bold text-blue-900">DTM</span>
      </div>
      
      <div className="hidden md:flex items-center text-sm text-gray-500">
        <span className="capitalize">{pathname === '/' ? 'Home' : pathname.split('/').filter(Boolean).join(' / ').replace(/-/g, ' ')}</span>
      </div>

      <div className="flex flex-1 items-center justify-end space-x-4">
        <button 
          onClick={() => router.push('/notifications')}
          className="relative rounded-full p-2 text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center space-x-2 rounded-full p-1 hover:bg-gray-100 focus:outline-none">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700">
              <User className="h-4 w-4" />
            </div>
            <span className="hidden text-sm font-medium text-gray-700 md:block">
              {user?.name || "User"}
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.name}</p>
                <p className="text-xs leading-none text-gray-500">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push('/settings')}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout} className="text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
