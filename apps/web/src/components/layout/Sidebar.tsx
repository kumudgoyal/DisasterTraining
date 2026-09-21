"use client";

import Link from "next/Link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  GraduationCap, 
  Map as MapIcon, 
  BarChart3, 
  FileText, 
  BellRing, 
  AlertTriangle,
  Building2,
  Users,
  ShieldCheck,
  Settings
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  
  const isAdmin = user?.role === 'ADMIN';
  const isOrgAdmin = user?.role === 'ORGANIZATION_ADMIN' || isAdmin;

  const navItems = [
    { href: "/", label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
    { href: "/trainings", label: "Trainings", icon: <GraduationCap className="h-5 w-5" /> },
    { href: "/map", label: "GIS Map", icon: <MapIcon className="h-5 w-5" /> },
    { href: "/analytics", label: "Analytics", icon: <BarChart3 className="h-5 w-5" /> },
    { href: "/impact", label: "Impact", icon: <ShieldCheck className="h-5 w-5" /> },
    { href: "/reports", label: "Reports", icon: <FileText className="h-5 w-5" /> },
    { href: "/alerts", label: "Alerts", icon: <AlertTriangle className="h-5 w-5" /> },
  ];

  if (isOrgAdmin) {
    navItems.push(
      { href: "/organizations", label: "Organizations", icon: <Building2 className="h-5 w-5" /> },
      { href: "/participants", label: "Participants", icon: <Users className="h-5 w-5" /> }
    );
  }

  if (isAdmin) {
    navItems.push(
      { href: "/users", label: "Users & Roles", icon: <Settings className="h-5 w-5" /> }
    );
  }

  return (
    <aside className="hidden w-64 flex-col border-r bg-[#0f172a] text-slate-300 md:flex">
      <div className="flex h-16 items-center px-6 border-b border-slate-800 bg-[#0a0f1d]">
        <ShieldCheck className="h-6 w-6 text-blue-400 mr-2" />
        <span className="text-lg font-bold text-white tracking-wide">DTM System</span>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-blue-600/10 text-blue-400" 
                    : "hover:bg-slate-800 hover:text-white"
                )}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
      
      <div className="p-4 border-t border-slate-800 bg-[#0a0f1d]">
        <div className="flex items-center">
          <div className="ml-3">
            <p className="text-sm font-medium text-white">{user?.name || 'User'}</p>
            <p className="text-xs text-slate-400 truncate w-40">{user?.role?.replace('_', ' ') || 'Guest'}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
