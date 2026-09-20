"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Map, Users, CheckSquare, Activity,
  BarChart3, FileText, Bell, Building2, Settings, UserCog,
  LogOut, Shield, ChevronDown, ChevronRight,
} from "lucide-react";

const NAV_SECTIONS = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard",     href: "/",              icon: LayoutDashboard },
      { label: "Map & GIS",     href: "/map",           icon: Map },
    ],
  },
  {
    label: "Operations",
    items: [
      { label: "Trainings",     href: "/trainings",     icon: CheckSquare },
      { label: "Participants",  href: "/participants",  icon: Users },
      { label: "Impact",        href: "/impact",        icon: Activity },
    ],
  },
  {
    label: "Analytics",
    items: [
      { label: "Analytics",     href: "/analytics",     icon: BarChart3 },
      { label: "Reports",       href: "/reports",       icon: FileText },
    ],
  },
  {
    label: "System",
    items: [
      { label: "Alerts",        href: "/alerts",        icon: Bell },
      { label: "Organizations", href: "/organizations", icon: Building2 },
      { label: "Users",         href: "/users",         icon: UserCog },
      { label: "Settings",      href: "/settings",      icon: Settings },
    ],
  },
];

interface SidebarProps {
  isOpen?: boolean;
  setIsOpen?: (v: boolean) => void;
}

export function Sidebar({ isOpen = false, setIsOpen }: SidebarProps) {
  const pathname = usePathname();
  const close = () => setIsOpen?.(false);

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-30 bg-black/60 md:hidden" onClick={close} />
      )}

      <aside
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          width: "calc(220 * var(--u))",
          zIndex: 40,
          display: "flex",
          flexDirection: "column",
          background: "rgba(6,12,24,0.88)",
          backdropFilter: "blur(28px) saturate(150%)",
          WebkitBackdropFilter: "blur(28px) saturate(150%)",
          borderRight: "1px solid rgba(255,255,255,0.07)",
          animation: "slideL .70s cubic-bezier(.16,1,.3,1) .05s both",
        }}
      >
        {/* Brand */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "calc(10 * var(--u))",
          padding: "calc(18 * var(--u)) calc(18 * var(--u)) calc(14 * var(--u))",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          flexShrink: 0,
        }}>
          <div style={{
            width: "calc(30 * var(--u))",
            height: "calc(30 * var(--u))",
            borderRadius: "calc(8 * var(--u))",
            background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            boxShadow: "0 0 12px rgba(59,130,246,0.4)",
          }}>
            <Shield style={{ width: "calc(15 * var(--u))", height: "calc(15 * var(--u))", color: "#fff" }} />
          </div>
          <div>
            <p style={{ fontSize: "calc(13.5 * var(--u))", fontWeight: 700, color: "#fff", lineHeight: 1.15, letterSpacing: "-0.01em" }}>NDMA Portal</p>
            <p style={{ fontSize: "calc(10 * var(--u))", color: "rgba(255,255,255,0.38)", marginTop: "calc(1 * var(--u))", lineHeight: 1 }}>Disaster Training Monitor</p>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, overflowY: "auto", padding: "calc(10 * var(--u)) calc(10 * var(--u))" }} className="glass-rail">
          {NAV_SECTIONS.map((section, sIdx) => (
            <div key={section.label} style={{ marginBottom: "calc(18 * var(--u))" }}>
              <p style={{
                fontSize: "calc(10 * var(--u))",
                fontWeight: 600,
                letterSpacing: "0.09em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.28)",
                padding: "0 calc(8 * var(--u)) calc(5 * var(--u))",
                userSelect: "none",
              }}>
                {section.label}
              </p>
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={close}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "calc(9 * var(--u))",
                      padding: "calc(7.5 * var(--u)) calc(9 * var(--u))",
                      borderRadius: "calc(7 * var(--u))",
                      background: isActive ? "rgba(59,130,246,0.12)" : "transparent",
                      border: isActive ? "1px solid rgba(59,130,246,0.22)" : "1px solid transparent",
                      color: isActive ? "#fff" : "rgba(255,255,255,0.5)",
                      textDecoration: "none",
                      transition: "all 0.14s",
                      marginBottom: "calc(1 * var(--u))",
                      fontSize: "calc(13 * var(--u))",
                      fontWeight: isActive ? 500 : 400,
                      lineHeight: 1,
                    }}
                    onMouseEnter={e => {
                      if (!isActive) {
                        const el = e.currentTarget as HTMLAnchorElement;
                        el.style.background = "rgba(255,255,255,0.05)";
                        el.style.color = "rgba(255,255,255,0.80)";
                      }
                    }}
                    onMouseLeave={e => {
                      if (!isActive) {
                        const el = e.currentTarget as HTMLAnchorElement;
                        el.style.background = "transparent";
                        el.style.color = "rgba(255,255,255,0.5)";
                      }
                    }}
                  >
                    <Icon style={{ width: "calc(14 * var(--u))", height: "calc(14 * var(--u))", flexShrink: 0 }} />
                    <span style={{ flex: 1 }}>{item.label}</span>
                    {isActive && (
                      <span style={{
                        width: "calc(6 * var(--u))",
                        height: "calc(6 * var(--u))",
                        borderRadius: "50%",
                        background: "#3b82f6",
                        boxShadow: "0 0 6px #3b82f6",
                        flexShrink: 0,
                      }} />
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* User footer */}
        <div style={{
          padding: "calc(10 * var(--u)) calc(10 * var(--u))",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          flexShrink: 0,
        }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "calc(9 * var(--u))",
              padding: "calc(8 * var(--u)) calc(9 * var(--u))",
              borderRadius: "calc(7 * var(--u))",
              cursor: "pointer",
              transition: "background 0.14s",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
          >
            <div style={{
              width: "calc(28 * var(--u))",
              height: "calc(28 * var(--u))",
              borderRadius: "50%",
              background: "rgba(99,102,241,0.65)",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <span style={{ fontSize: "calc(10 * var(--u))", fontWeight: 700, color: "#fff" }}>SA</span>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: "calc(12 * var(--u))", fontWeight: 600, color: "#fff", lineHeight: 1.2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Super Admin</p>
              <p style={{ fontSize: "calc(10 * var(--u))", color: "rgba(255,255,255,0.35)", lineHeight: 1.2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>admin@ndma.gov.in</p>
            </div>
            <LogOut style={{ width: "calc(13 * var(--u))", height: "calc(13 * var(--u))", color: "rgba(255,255,255,0.3)", flexShrink: 0 }} />
          </div>
        </div>
      </aside>
    </>
  );
}
