"use client";

import React from "react";
import { Bell, Search, Plus, Menu } from "lucide-react";

interface TopbarProps {
  onMenuClick?: () => void;
}

export function Topbar({ onMenuClick }: TopbarProps) {
  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 calc(32 * var(--u))",
        height: "calc(52 * var(--u))",
        flexShrink: 0,
        gap: "calc(16 * var(--u))",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(8,15,28,0.60)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        animation: "riseIn .55s cubic-bezier(.16,1,.3,1) .10s both",
      }}
    >
      {/* Mobile hamburger */}
      <button
        className="md:hidden"
        onClick={onMenuClick}
        style={{
          width: "calc(36 * var(--u))",
          height: "calc(36 * var(--u))",
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "calc(6 * var(--u))",
          flexShrink: 0,
          cursor: "pointer",
        }}
      >
        <Menu style={{ width: "calc(16 * var(--u))", height: "calc(16 * var(--u))", color: "#fff" }} />
      </button>

      {/* Left: System Status pill */}
      <div style={{ display: "flex", alignItems: "center", gap: "calc(6 * var(--u))", flex: 1 }}>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: "calc(5 * var(--u))",
          fontSize: "calc(11 * var(--u))", fontWeight: 500,
          color: "rgba(255,255,255,0.45)",
          padding: "calc(3 * var(--u)) calc(9 * var(--u))",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "calc(999 * var(--u))",
          background: "rgba(255,255,255,0.04)",
        }}>
          <span style={{ width: "calc(6 * var(--u))", height: "calc(6 * var(--u))", borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 5px #22c55e" }} />
          System Operational
        </span>
      </div>

      {/* Right tools */}
      <div style={{ display: "flex", alignItems: "center", gap: "calc(8 * var(--u))" }}>
        {/* Search */}
        <button
          aria-label="Search"
          style={{
            display: "flex", alignItems: "center", gap: "calc(6 * var(--u))",
            padding: "calc(6 * var(--u)) calc(12 * var(--u))",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.09)",
            borderRadius: "calc(6 * var(--u))",
            color: "rgba(255,255,255,0.45)",
            cursor: "pointer", fontSize: "calc(12 * var(--u))",
            transition: "all 0.15s",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.10)";
            (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.80)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.06)";
            (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.45)";
          }}
        >
          <Search style={{ width: "calc(13 * var(--u))", height: "calc(13 * var(--u))" }} />
          <span>Quick search...</span>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: "calc(2 * var(--u))",
            padding: "calc(2 * var(--u)) calc(5 * var(--u))",
            background: "rgba(255,255,255,0.08)",
            borderRadius: "calc(4 * var(--u))",
            fontSize: "calc(10 * var(--u))",
            color: "rgba(255,255,255,0.35)",
            fontFamily: "monospace",
          }}>⌘K</span>
        </button>

        {/* Notifications */}
        <button
          aria-label="Notifications"
          style={{
            position: "relative",
            width: "calc(34 * var(--u))",
            height: "calc(34 * var(--u))",
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.09)",
            borderRadius: "calc(6 * var(--u))",
            cursor: "pointer",
            transition: "all 0.15s",
          }}
          onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.12)")}
          onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
        >
          <Bell style={{ width: "calc(14 * var(--u))", height: "calc(14 * var(--u))", color: "rgba(255,255,255,0.6)" }} />
          <span style={{
            position: "absolute", top: "calc(5 * var(--u))", right: "calc(5 * var(--u))",
            width: "calc(6 * var(--u))", height: "calc(6 * var(--u))",
            borderRadius: "50%", background: "#ef4444",
            border: "1.5px solid rgba(8,15,28,0.8)",
          }} />
        </button>

        {/* Avatar */}
        <div style={{
          width: "calc(30 * var(--u))",
          height: "calc(30 * var(--u))",
          borderRadius: "50%",
          background: "rgba(99,102,241,0.7)",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer",
          flexShrink: 0,
        }}>
          <span style={{ fontSize: "calc(11 * var(--u))", fontWeight: 700, color: "#fff" }}>SA</span>
        </div>
      </div>
    </header>
  );
}

