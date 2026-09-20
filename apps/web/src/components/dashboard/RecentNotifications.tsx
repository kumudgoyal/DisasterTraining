"use client";

import React from "react";
import { RECENT_NOTIFICATIONS } from "@/services/mockData";
import { CheckCircle2, AlertCircle, Info, FileText, AlertTriangle, Bell, ChevronRight } from "lucide-react";

const TYPE_CONFIG: Record<string, { icon: React.ReactNode; bg: string; dot: string; label: string }> = {
  success: { icon: <CheckCircle2 />, bg: "rgba(74,222,128,.15)",   dot: "#4ade80", label: "Added"    },
  warning: { icon: <AlertTriangle />, bg: "rgba(251,191,36,.15)",  dot: "#fbbf24", label: "Alert"    },
  alert:   { icon: <AlertCircle />,   bg: "rgba(248,113,113,.15)", dot: "#f87171", label: "Critical" },
  report:  { icon: <FileText />,      bg: "rgba(167,139,250,.15)", dot: "#a78bfa", label: "Report"   },
  info:    { icon: <Info />,          bg: "rgba(96,165,250,.15)",  dot: "#60a5fa", label: "Info"     },
};

export function RecentNotifications() {
  return (
    <div style={{ padding: "calc(16 * var(--u)) calc(18 * var(--u))" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "calc(14 * var(--u))" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "calc(8 * var(--u))" }}>
          <div style={{
            width: "calc(28 * var(--u))", height: "calc(28 * var(--u))",
            borderRadius: "calc(8 * var(--u))",
            background: "rgba(255,255,255,.18)",
            border: "1px solid rgba(255,255,255,.22)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Bell style={{ width: "calc(13 * var(--u))", height: "calc(13 * var(--u))", color: "#fff" }} />
          </div>
          <span style={{ fontSize: "calc(12 * var(--u))", fontWeight: 600, color: "#fff" }}>Recent Notifications</span>
        </div>
        <div style={{
          width: "calc(20 * var(--u))", height: "calc(20 * var(--u))",
          borderRadius: "50%", background: "#ef4444",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "calc(9 * var(--u))", fontWeight: 800, color: "#fff",
        }}>
          {RECENT_NOTIFICATIONS.length}
        </div>
      </div>

      {/* Items */}
      <div style={{ display: "flex", flexDirection: "column", gap: "calc(2 * var(--u))" }}>
        {RECENT_NOTIFICATIONS.map((notif) => {
          const cfg = TYPE_CONFIG[notif.type] ?? TYPE_CONFIG.info;
          return (
            <div
              key={notif.id}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "calc(10 * var(--u))",
                padding: "calc(9 * var(--u)) calc(10 * var(--u))",
                borderRadius: "calc(12 * var(--u))",
                cursor: "pointer",
                transition: "background 0.18s",
              }}
              onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,.09)"}
              onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = "transparent"}
            >
              {/* Icon bubble */}
              <div style={{
                flexShrink: 0,
                width: "calc(32 * var(--u))", height: "calc(32 * var(--u))",
                borderRadius: "calc(10 * var(--u))",
                background: cfg.bg,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {React.cloneElement(cfg.icon as React.ReactElement<{ style?: React.CSSProperties }>, {
                  style: { width: "calc(14*var(--u))", height: "calc(14*var(--u))", color: cfg.dot }
                })}
              </div>

              {/* Text */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "calc(6 * var(--u))" }}>
                  <span style={{
                    fontSize: "calc(11.5 * var(--u))", fontWeight: 600,
                    color: "#fff", lineHeight: 1.3, overflow: "hidden",
                    textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>
                    {notif.title}
                  </span>
                  {/* Type pill */}
                  <span style={{
                    flexShrink: 0,
                    display: "flex", alignItems: "center", gap: "calc(4 * var(--u))",
                    fontSize: "calc(9 * var(--u))", fontWeight: 600,
                    color: cfg.dot, background: cfg.bg,
                    padding: "calc(2*var(--u)) calc(7*var(--u))",
                    borderRadius: "999px",
                  }}>
                    <span style={{ width: "calc(5*var(--u))", height: "calc(5*var(--u))", borderRadius: "50%", background: cfg.dot, display: "inline-block" }} />
                    {cfg.label}
                  </span>
                </div>
                <p style={{ marginTop: "calc(3 * var(--u))", fontSize: "calc(11 * var(--u))", color: "rgba(255,255,255,.95)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {notif.description}
                </p>
                <p style={{ marginTop: "calc(3 * var(--u))", fontSize: "calc(10 * var(--u))", fontWeight: 500, color: "rgba(255,255,255,.85)" }}>
                  {notif.time}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <button style={{
        width: "100%", marginTop: "calc(10 * var(--u))",
        padding: "calc(9 * var(--u))",
        display: "flex", alignItems: "center", justifyContent: "center",
        gap: "calc(5 * var(--u))",
        fontSize: "calc(10.5 * var(--u))", fontWeight: 600,
        color: "rgba(255,255,255,.9)", background: "none",
        border: "1px dashed rgba(255,255,255,.18)",
        borderRadius: "calc(12 * var(--u))", cursor: "pointer", transition: "all 0.18s",
      }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color="#fff"; (e.currentTarget as HTMLButtonElement).style.borderColor="rgba(255,255,255,.35)"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color="rgba(255,255,255,.55)"; (e.currentTarget as HTMLButtonElement).style.borderColor="rgba(255,255,255,.18)"; }}
      >
        View all notifications <ChevronRight style={{ width: "calc(12 * var(--u))", height: "calc(12 * var(--u))" }} />
      </button>
    </div>
  );
}
