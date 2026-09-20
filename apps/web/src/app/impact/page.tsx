"use client";

import React from "react";
import { Activity, Users, Home, TrendingUp, ShieldAlert, HeartPulse } from "lucide-react";

export default function ImpactPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "calc(20 * var(--u))", height: "100%" }}>
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
            Impact Assessment
          </h1>
          <p style={{
            marginTop: "calc(8 * var(--u))",
            fontSize: "calc(13.5 * var(--u))",
            color: "rgba(255,255,255,.9)",
            lineHeight: "calc(22 * var(--u))",
          }}>
            Real-time assessment of affected populations, infrastructure damage, and relief distribution across India.
          </p>
        </div>
        <button className="glass-chip" style={{
          padding: "calc(8 * var(--u)) calc(16 * var(--u))",
          display: "flex", alignItems: "center", gap: "calc(8 * var(--u))",
          color: "#fff", fontWeight: 600, fontSize: "calc(12 * var(--u))",
          cursor: "pointer", border: "1px solid rgba(255,255,255,0.15)"
        }}>
          <Activity style={{ width: "calc(14 * var(--u))", height: "calc(14 * var(--u))" }} />
          Generate Impact Report
        </button>
      </div>

      {/* KPI Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(calc(240 * var(--u)), 1fr))", gap: "calc(16 * var(--u))", animation: "slideR .95s cubic-bezier(.16,1,.3,1) .2s both" }}>
        <div className="glass-card" style={{ padding: "calc(20 * var(--u))", borderTop: "3px solid #3b82f6" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "calc(12 * var(--u))" }}>
            <div style={{ padding: "calc(10 * var(--u))", borderRadius: "50%", background: "rgba(59,130,246,0.15)", color: "#3b82f6" }}>
              <Users style={{ width: "calc(20 * var(--u))", height: "calc(20 * var(--u))" }} />
            </div>
            <div>
              <p style={{ fontSize: "calc(12 * var(--u))", color: "rgba(255,255,255,.7)", fontWeight: 500 }}>People Evacuated</p>
              <h2 style={{ fontSize: "calc(24 * var(--u))", fontWeight: 700, color: "#fff", marginTop: "calc(2 * var(--u))" }}>14,250</h2>
            </div>
          </div>
        </div>
        <div className="glass-card" style={{ padding: "calc(20 * var(--u))", borderTop: "3px solid #10b981" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "calc(12 * var(--u))" }}>
            <div style={{ padding: "calc(10 * var(--u))", borderRadius: "50%", background: "rgba(16,185,129,0.15)", color: "#10b981" }}>
              <HeartPulse style={{ width: "calc(20 * var(--u))", height: "calc(20 * var(--u))" }} />
            </div>
            <div>
              <p style={{ fontSize: "calc(12 * var(--u))", color: "rgba(255,255,255,.7)", fontWeight: 500 }}>Lives Saved (YTD)</p>
              <h2 style={{ fontSize: "calc(24 * var(--u))", fontWeight: 700, color: "#fff", marginTop: "calc(2 * var(--u))" }}>3,892</h2>
            </div>
          </div>
        </div>
        <div className="glass-card" style={{ padding: "calc(20 * var(--u))", borderTop: "3px solid #f59e0b" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "calc(12 * var(--u))" }}>
            <div style={{ padding: "calc(10 * var(--u))", borderRadius: "50%", background: "rgba(245,158,11,0.15)", color: "#f59e0b" }}>
              <Home style={{ width: "calc(20 * var(--u))", height: "calc(20 * var(--u))" }} />
            </div>
            <div>
              <p style={{ fontSize: "calc(12 * var(--u))", color: "rgba(255,255,255,.7)", fontWeight: 500 }}>Shelters Activated</p>
              <h2 style={{ fontSize: "calc(24 * var(--u))", fontWeight: 700, color: "#fff", marginTop: "calc(2 * var(--u))" }}>124</h2>
            </div>
          </div>
        </div>
        <div className="glass-card" style={{ padding: "calc(20 * var(--u))", borderTop: "3px solid #ef4444" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "calc(12 * var(--u))" }}>
            <div style={{ padding: "calc(10 * var(--u))", borderRadius: "50%", background: "rgba(239,68,68,0.15)", color: "#ef4444" }}>
              <ShieldAlert style={{ width: "calc(20 * var(--u))", height: "calc(20 * var(--u))" }} />
            </div>
            <div>
              <p style={{ fontSize: "calc(12 * var(--u))", color: "rgba(255,255,255,.7)", fontWeight: 500 }}>Critical Incidents</p>
              <h2 style={{ fontSize: "calc(24 * var(--u))", fontWeight: 700, color: "#fff", marginTop: "calc(2 * var(--u))" }}>8</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "calc(16 * var(--u))", flex: 1, animation: "slideR .95s cubic-bezier(.16,1,.3,1) .3s both" }}>
        {/* Left: State Wise Impact */}
        <div className="glass-card" style={{ padding: "calc(20 * var(--u))", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "calc(16 * var(--u))" }}>
            <h3 style={{ fontSize: "calc(16 * var(--u))", fontWeight: 600, color: "#fff" }}>State-Wise Impact Summary</h3>
            <span style={{ fontSize: "calc(12 * var(--u))", color: "rgba(255,255,255,.7)" }}>Last 30 Days</span>
          </div>
          
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,.1)" }}>
                <th style={{ padding: "calc(12 * var(--u)) calc(8 * var(--u))", color: "rgba(255,255,255,.6)", fontWeight: 500, fontSize: "calc(12 * var(--u))" }}>State</th>
                <th style={{ padding: "calc(12 * var(--u)) calc(8 * var(--u))", color: "rgba(255,255,255,.6)", fontWeight: 500, fontSize: "calc(12 * var(--u))" }}>Affected Population</th>
                <th style={{ padding: "calc(12 * var(--u)) calc(8 * var(--u))", color: "rgba(255,255,255,.6)", fontWeight: 500, fontSize: "calc(12 * var(--u))" }}>Relief Camps</th>
                <th style={{ padding: "calc(12 * var(--u)) calc(8 * var(--u))", color: "rgba(255,255,255,.6)", fontWeight: 500, fontSize: "calc(12 * var(--u))" }}>Est. Damage (Cr)</th>
                <th style={{ padding: "calc(12 * var(--u)) calc(8 * var(--u))", color: "rgba(255,255,255,.6)", fontWeight: 500, fontSize: "calc(12 * var(--u))" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { state: "Assam", affected: "45,000", camps: 42, damage: "₹ 120", status: "Critical", color: "#f87171" },
                { state: "Himachal Pradesh", affected: "12,500", camps: 15, damage: "₹ 85", status: "High", color: "#fbbf24" },
                { state: "Odisha", affected: "8,200", camps: 8, damage: "₹ 30", status: "Moderate", color: "#60a5fa" },
                { state: "Kerala", affected: "3,100", camps: 4, damage: "₹ 15", status: "Recovering", color: "#4ade80" },
                { state: "Maharashtra", affected: "1,800", camps: 2, damage: "₹ 5", status: "Stable", color: "#4ade80" },
              ].map((row, idx) => (
                <tr key={idx} style={{ borderBottom: "1px solid rgba(255,255,255,.05)", transition: "background 0.2s" }}>
                  <td style={{ padding: "calc(12 * var(--u)) calc(8 * var(--u))", color: "#fff", fontWeight: 500, fontSize: "calc(13 * var(--u))" }}>{row.state}</td>
                  <td style={{ padding: "calc(12 * var(--u)) calc(8 * var(--u))", color: "rgba(255,255,255,.9)", fontSize: "calc(13 * var(--u))" }}>{row.affected}</td>
                  <td style={{ padding: "calc(12 * var(--u)) calc(8 * var(--u))", color: "rgba(255,255,255,.9)", fontSize: "calc(13 * var(--u))" }}>{row.camps}</td>
                  <td style={{ padding: "calc(12 * var(--u)) calc(8 * var(--u))", color: "rgba(255,255,255,.9)", fontSize: "calc(13 * var(--u))" }}>{row.damage}</td>
                  <td style={{ padding: "calc(12 * var(--u)) calc(8 * var(--u))" }}>
                    <span style={{ padding: "calc(4 * var(--u)) calc(8 * var(--u))", borderRadius: "calc(4 * var(--u))", fontSize: "calc(11 * var(--u))", fontWeight: 600, color: row.color, background: `${row.color}22` }}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right: Needs & Resources */}
        <div className="glass-card" style={{ padding: "calc(20 * var(--u))", display: "flex", flexDirection: "column", gap: "calc(16 * var(--u))" }}>
          <h3 style={{ fontSize: "calc(16 * var(--u))", fontWeight: 600, color: "#fff" }}>Critical Needs Assessment</h3>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "calc(12 * var(--u))" }}>
            {[
              { item: "Medical Supplies", val: 85, color: "#ef4444" },
              { item: "Clean Water", val: 70, color: "#3b82f6" },
              { item: "Food Packets", val: 65, color: "#f59e0b" },
              { item: "Tents & Tarps", val: 40, color: "#8b5cf6" },
              { item: "Rescue Boats", val: 25, color: "#10b981" },
            ].map(stat => (
              <div key={stat.item}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "calc(4 * var(--u))", fontSize: "calc(12 * var(--u))", color: "rgba(255,255,255,.9)", fontWeight: 500 }}>
                  <span>{stat.item}</span>
                  <span>{stat.val}% Depleted</span>
                </div>
                <div style={{ width: "100%", height: "calc(6 * var(--u))", background: "rgba(255,255,255,.1)", borderRadius: "calc(3 * var(--u))", overflow: "hidden" }}>
                  <div style={{ width: `${stat.val}%`, height: "100%", background: stat.color, borderRadius: "calc(3 * var(--u))" }} />
                </div>
              </div>
            ))}
          </div>
          
          <div style={{ marginTop: "auto", padding: "calc(16 * var(--u))", background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)", borderRadius: "calc(8 * var(--u))" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "calc(8 * var(--u))", color: "#60a5fa", marginBottom: "calc(4 * var(--u))" }}>
              <TrendingUp style={{ width: "calc(16 * var(--u))", height: "calc(16 * var(--u))" }} />
              <h4 style={{ fontWeight: 600, fontSize: "calc(13 * var(--u))" }}>Trend Analysis</h4>
            </div>
            <p style={{ fontSize: "calc(12 * var(--u))", color: "rgba(255,255,255,.8)", lineHeight: 1.5 }}>
              Medical supplies depletion rate has increased by 15% in Assam over the last 48 hours. Recommend immediate dispatch from central reserves.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

