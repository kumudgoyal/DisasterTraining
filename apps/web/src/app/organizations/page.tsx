"use client";

import React from "react";
import { Building2, Search, Filter, ShieldCheck, PhoneCall, Link2, Cross, Flame } from "lucide-react";

const ORGS = [
  { id: "ORG-01", name: "National Disaster Response Force (NDRF)", type: "Government", hq: "New Delhi, Delhi", activeUnits: 12, personnel: 14500, icon: ShieldCheck, color: "#3b82f6" },
  { id: "ORG-02", name: "State Disaster Response Force (SDRF)", type: "State Gov", hq: "Multiple", activeUnits: 45, personnel: 25000, icon: ShieldCheck, color: "#8b5cf6" },
  { id: "ORG-03", name: "Indian Red Cross Society", type: "NGO", hq: "New Delhi, Delhi", activeUnits: 8, personnel: 5200, icon: Cross, color: "#ef4444" },
  { id: "ORG-04", name: "Fire & Rescue Services", type: "State Gov", hq: "Multiple", activeUnits: 120, personnel: 45000, icon: Flame, color: "#f97316" },
  { id: "ORG-05", name: "Armed Forces Medical Services", type: "Military", hq: "New Delhi, Delhi", activeUnits: 15, personnel: 3000, icon: Building2, color: "#10b981" },
];

export default function OrganizationsPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "calc(20 * var(--u))", height: "100%", overflowY: "auto", paddingRight: "calc(8 * var(--u))" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", animation: "wipeRight .80s cubic-bezier(.22,.61,.36,1) .1s both" }}>
        <div>
          <h1 style={{
            fontFamily: "var(--font-tight, 'Inter Tight', 'Inter', sans-serif)",
            fontSize: "calc(32 * var(--u))",
            fontWeight: 700,
            color: "#fff",
            lineHeight: 1.08,
            letterSpacing: "-0.02em",
          }}>
            Partner Organizations
          </h1>
          <p style={{
            marginTop: "calc(8 * var(--u))",
            fontSize: "calc(13.5 * var(--u))",
            color: "rgba(255,255,255,.9)",
            lineHeight: "calc(22 * var(--u))",
          }}>
            Directory of all national, state, and non-governmental disaster response agencies.
          </p>
        </div>
        <button className="glass-chip" style={{
          padding: "calc(8 * var(--u)) calc(16 * var(--u))",
          display: "flex", alignItems: "center", gap: "calc(8 * var(--u))",
          color: "#fff", fontWeight: 600, fontSize: "calc(12 * var(--u))",
          cursor: "pointer", border: "1px solid rgba(255,255,255,0.15)",
          background: "rgba(59,130,246,0.15)"
        }}>
          <Building2 style={{ width: "calc(14 * var(--u))", height: "calc(14 * var(--u))" }} />
          Onboard Agency
        </button>
      </div>

      {/* Toolbar */}
      <div style={{ display: "flex", gap: "calc(12 * var(--u))", animation: "slideR .95s cubic-bezier(.16,1,.3,1) .2s both" }}>
        <div style={{ flex: 1, position: "relative" }}>
          <Search style={{ position: "absolute", left: "calc(12 * var(--u))", top: "50%", transform: "translateY(-50%)", width: "calc(16 * var(--u))", height: "calc(16 * var(--u))", color: "rgba(255,255,255,.5)" }} />
          <input 
            type="text" 
            placeholder="Search agencies..."
            style={{
              width: "100%", padding: "calc(10 * var(--u)) calc(12 * var(--u)) calc(10 * var(--u)) calc(36 * var(--u))",
              background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)",
              borderRadius: "calc(8 * var(--u))", color: "#fff", fontSize: "calc(13 * var(--u))",
              outline: "none"
            }}
          />
        </div>
        <button style={{ padding: "0 calc(16 * var(--u))", display: "flex", alignItems: "center", gap: "calc(8 * var(--u))", background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)", borderRadius: "calc(8 * var(--u))", color: "rgba(255,255,255,.9)", cursor: "pointer", fontSize: "calc(13 * var(--u))" }}>
          <Filter style={{ width: "calc(14 * var(--u))", height: "calc(14 * var(--u))" }} />
          Type
        </button>
      </div>

      {/* Orgs Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(calc(320 * var(--u)), 1fr))", gap: "calc(16 * var(--u))", animation: "slideR .95s cubic-bezier(.16,1,.3,1) .3s both" }}>
        {ORGS.map(org => {
          const Icon = org.icon;
          return (
            <div key={org.id} className="glass-card" style={{ padding: "calc(20 * var(--u))", display: "flex", flexDirection: "column", gap: "calc(16 * var(--u))" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "calc(16 * var(--u))" }}>
                <div style={{ 
                  width: "calc(48 * var(--u))", height: "calc(48 * var(--u))", 
                  borderRadius: "calc(12 * var(--u))", background: `${org.color}15`, 
                  display: "flex", alignItems: "center", justifyContent: "center", color: org.color,
                  flexShrink: 0
                }}>
                  <Icon style={{ width: "calc(24 * var(--u))", height: "calc(24 * var(--u))" }} />
                </div>
                <div>
                  <h3 style={{ fontSize: "calc(16 * var(--u))", fontWeight: 600, color: "#fff", lineHeight: 1.2, marginBottom: "calc(4 * var(--u))" }}>{org.name}</h3>
                  <span style={{ fontSize: "calc(12 * var(--u))", color: "rgba(255,255,255,.6)" }}>{org.hq}</span>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "calc(12 * var(--u))", padding: "calc(12 * var(--u))", background: "rgba(255,255,255,.03)", borderRadius: "calc(8 * var(--u))" }}>
                <div>
                  <span style={{ display: "block", fontSize: "calc(11 * var(--u))", color: "rgba(255,255,255,.6)", marginBottom: "calc(2 * var(--u))" }}>Active Units</span>
                  <span style={{ fontSize: "calc(16 * var(--u))", fontWeight: 700, color: "#fff" }}>{org.activeUnits}</span>
                </div>
                <div>
                  <span style={{ display: "block", fontSize: "calc(11 * var(--u))", color: "rgba(255,255,255,.6)", marginBottom: "calc(2 * var(--u))" }}>Personnel</span>
                  <span style={{ fontSize: "calc(16 * var(--u))", fontWeight: 700, color: "#fff" }}>{org.personnel.toLocaleString()}</span>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto", borderTop: "1px solid rgba(255,255,255,.05)", paddingTop: "calc(16 * var(--u))" }}>
                <span style={{ padding: "calc(4 * var(--u)) calc(8 * var(--u))", borderRadius: "calc(4 * var(--u))", fontSize: "calc(11 * var(--u))", fontWeight: 600, color: "#fff", background: "rgba(255,255,255,.1)" }}>
                  {org.type}
                </span>
                <div style={{ display: "flex", gap: "calc(8 * var(--u))" }}>
                  <button style={{ background: "rgba(255,255,255,.05)", border: "none", color: "#fff", width: "calc(32 * var(--u))", height: "calc(32 * var(--u))", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                    <PhoneCall style={{ width: "calc(14 * var(--u))", height: "calc(14 * var(--u))" }} />
                  </button>
                  <button style={{ background: "rgba(255,255,255,.05)", border: "none", color: "#fff", width: "calc(32 * var(--u))", height: "calc(32 * var(--u))", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                    <Link2 style={{ width: "calc(14 * var(--u))", height: "calc(14 * var(--u))" }} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
