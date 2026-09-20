"use client";

import React from "react";
import { Bell, AlertTriangle, Info, CheckCircle, ShieldAlert, ArrowRight } from "lucide-react";

const MOCK_ALERTS = [
  { id: "1", type: "critical", title: "Heavy Rainfall Warning", desc: "Red alert issued for Ludhiana district. Evacuation teams standby.", time: "10 mins ago", icon: AlertTriangle, color: "#f87171", bg: "rgba(248,113,113,.15)" },
  { id: "2", type: "warning", title: "Low Training Attendance", desc: "Fire safety drill in Amritsar reported < 50% attendance.", time: "1 hour ago", icon: ShieldAlert, color: "#fbbf24", bg: "rgba(251,191,36,.15)" },
  { id: "3", type: "info", title: "New Protocol Deployed", desc: "Updated SOP for earthquake response has been published to all teams.", time: "3 hours ago", icon: Info, color: "#60a5fa", bg: "rgba(96,165,250,.15)" },
  { id: "4", type: "success", title: "Drill Completed Successfully", desc: "Mock drill in Patiala completed with 98% efficiency score.", time: "5 hours ago", icon: CheckCircle, color: "#4ade80", bg: "rgba(74,222,128,.15)" },
  { id: "5", type: "warning", title: "Resource Depletion Alert", desc: "First aid kits running low in Jalandhar central warehouse.", time: "1 day ago", icon: ShieldAlert, color: "#fbbf24", bg: "rgba(251,191,36,.15)" },
];

export default function AlertsPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "calc(20 * var(--u))" }}>
      {/* ── Header ── */}
      <div style={{ animation: "wipeRight .80s cubic-bezier(.22,.61,.36,1) .1s both", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <h1 style={{
            fontFamily: "var(--font-tight, 'Inter Tight', 'Inter', sans-serif)",
            fontSize: "calc(32 * var(--u))",
            fontWeight: 700,
            color: "#fff",
            lineHeight: 1.08,
            letterSpacing: "-0.02em",
          }}>
            System Alerts
          </h1>
          <p style={{
            marginTop: "calc(8 * var(--u))",
            fontSize: "calc(13.5 * var(--u))",
            color: "rgba(255,255,255,.9)",
            lineHeight: "calc(22 * var(--u))",
          }}>
            Real-time notifications and critical warnings from field operations.
          </p>
        </div>
        <button className="glass-chip" style={{
          padding: "calc(8 * var(--u)) calc(16 * var(--u))",
          display: "flex", alignItems: "center", gap: "calc(8 * var(--u))",
          color: "#fff", fontWeight: 600, fontSize: "calc(12 * var(--u))",
          cursor: "pointer", border: "1px solid rgba(255,255,255,0.15)"
        }}>
          <Bell style={{ width: "calc(14 * var(--u))", height: "calc(14 * var(--u))" }} />
          Mark all as read
        </button>
      </div>

      {/* ── Alerts List ── */}
      <div className="glass-card" style={{ padding: "calc(16 * var(--u))", display: "flex", flexDirection: "column", gap: "calc(8 * var(--u))", animation: "slideR .95s cubic-bezier(.16,1,.3,1) .2s both" }}>
        {MOCK_ALERTS.map((alert, idx) => {
          const Icon = alert.icon;
          return (
            <div key={alert.id} style={{
              display: "flex", gap: "calc(16 * var(--u))", alignItems: "center",
              padding: "calc(16 * var(--u))",
              background: "rgba(255,255,255,.02)",
              border: "1px solid rgba(255,255,255,.05)",
              borderRadius: "calc(12 * var(--u))",
              transition: "all 0.2s ease",
              cursor: "pointer",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,.06)";
              (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,.12)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,.02)";
              (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,.05)";
            }}>
              <div style={{
                width: "calc(48 * var(--u))", height: "calc(48 * var(--u))",
                borderRadius: "50%", background: alert.bg,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0
              }}>
                <Icon style={{ width: "calc(20 * var(--u))", height: "calc(20 * var(--u))", color: alert.color }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "calc(4 * var(--u))" }}>
                  <h3 style={{ fontSize: "calc(14 * var(--u))", fontWeight: 600, color: "#fff" }}>{alert.title}</h3>
                  <span style={{ fontSize: "calc(11 * var(--u))", color: "rgba(255,255,255,.9)" }}>{alert.time}</span>
                </div>
                <p style={{ fontSize: "calc(13 * var(--u))", color: "rgba(255,255,255,.95)", lineHeight: 1.4 }}>
                  {alert.desc}
                </p>
              </div>
              <button style={{
                background: "transparent", border: "none", color: "rgba(255,255,255,.4)",
                display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
                padding: "calc(8 * var(--u))", borderRadius: "50%"
              }}
              onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,.4)")}>
                <ArrowRight style={{ width: "calc(16 * var(--u))", height: "calc(16 * var(--u))" }} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

