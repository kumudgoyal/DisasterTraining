"use client";

import React from "react";
import { DashboardMap } from "@/components/map/DashboardMap";
import { Map, Layers, Target, Compass } from "lucide-react";

export default function MapPage() {
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
            Geospatial Intelligence
          </h1>
          <p style={{
            marginTop: "calc(8 * var(--u))",
            fontSize: "calc(13.5 * var(--u))",
            color: "rgba(255,255,255,.9)",
            lineHeight: "calc(22 * var(--u))",
          }}>
            Live spatial mapping of active natural events and NDRF/SDRF deployments across India.
          </p>
        </div>
        <div style={{ display: "flex", gap: "calc(8 * var(--u))" }}>
          <button className="glass-chip" style={{
            padding: "calc(8 * var(--u)) calc(12 * var(--u))",
            display: "flex", alignItems: "center", gap: "calc(6 * var(--u))",
            color: "#fff", fontWeight: 600, fontSize: "calc(11 * var(--u))",
            cursor: "pointer", border: "1px solid rgba(255,255,255,0.15)"
          }}>
            <Layers style={{ width: "calc(13 * var(--u))", height: "calc(13 * var(--u))" }} />
            Map Layers
          </button>
          <button className="glass-chip" style={{
            padding: "calc(8 * var(--u)) calc(12 * var(--u))",
            display: "flex", alignItems: "center", gap: "calc(6 * var(--u))",
            color: "#fff", fontWeight: 600, fontSize: "calc(11 * var(--u))",
            cursor: "pointer", border: "1px solid rgba(255,255,255,0.15)"
          }}>
            <Target style={{ width: "calc(13 * var(--u))", height: "calc(13 * var(--u))" }} />
            Recenter India
          </button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "calc(16 * var(--u))", flex: 1, minHeight: 0 }}>
        {/* Left Sidebar for Map */}
        <div className="glass-card" style={{ width: "calc(280 * var(--u))", display: "flex", flexDirection: "column", gap: "calc(16 * var(--u))", padding: "calc(16 * var(--u))", animation: "slideR .95s cubic-bezier(.16,1,.3,1) .2s both" }}>
          <h3 style={{ fontSize: "calc(14 * var(--u))", fontWeight: 600, color: "#fff", borderBottom: "1px solid rgba(255,255,255,.1)", paddingBottom: "calc(8 * var(--u))" }}>Map Controls</h3>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "calc(12 * var(--u))" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "calc(8 * var(--u))", color: "rgba(255,255,255,.9)", fontSize: "calc(13 * var(--u))", cursor: "pointer" }}>
              <input type="checkbox" defaultChecked style={{ accentColor: "#4ade80", width: "calc(16 * var(--u))", height: "calc(16 * var(--u))" }} />
              Live NASA EONET Events
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "calc(8 * var(--u))", color: "rgba(255,255,255,.9)", fontSize: "calc(13 * var(--u))", cursor: "pointer" }}>
              <input type="checkbox" defaultChecked style={{ accentColor: "#4ade80", width: "calc(16 * var(--u))", height: "calc(16 * var(--u))" }} />
              NDRF Battalions
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "calc(8 * var(--u))", color: "rgba(255,255,255,.9)", fontSize: "calc(13 * var(--u))", cursor: "pointer" }}>
              <input type="checkbox" defaultChecked style={{ accentColor: "#4ade80", width: "calc(16 * var(--u))", height: "calc(16 * var(--u))" }} />
              SDRF Active Trainings
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "calc(8 * var(--u))", color: "rgba(255,255,255,.9)", fontSize: "calc(13 * var(--u))", cursor: "pointer" }}>
              <input type="checkbox" style={{ accentColor: "#4ade80", width: "calc(16 * var(--u))", height: "calc(16 * var(--u))" }} />
              Weather Stations (IMD)
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "calc(8 * var(--u))", color: "rgba(255,255,255,.9)", fontSize: "calc(13 * var(--u))", cursor: "pointer" }}>
              <input type="checkbox" style={{ accentColor: "#4ade80", width: "calc(16 * var(--u))", height: "calc(16 * var(--u))" }} />
              Relief Shelters
            </label>
          </div>

          <div style={{ marginTop: "auto", background: "rgba(255,255,255,.05)", padding: "calc(12 * var(--u))", borderRadius: "calc(8 * var(--u))", border: "1px solid rgba(255,255,255,.1)" }}>
            <h4 style={{ fontSize: "calc(12 * var(--u))", fontWeight: 600, color: "#fff", marginBottom: "calc(6 * var(--u))" }}>Quick Stats</h4>
            <div style={{ display: "flex", justifyContent: "space-between", color: "rgba(255,255,255,.8)", fontSize: "calc(11 * var(--u))", marginBottom: "calc(4 * var(--u))" }}>
              <span>Active Alerts</span>
              <span style={{ color: "#f87171", fontWeight: 600 }}>12</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", color: "rgba(255,255,255,.8)", fontSize: "calc(11 * var(--u))" }}>
              <span>Teams Deployed</span>
              <span style={{ color: "#4ade80", fontWeight: 600 }}>45</span>
            </div>
          </div>
        </div>

        {/* Map Container */}
        <div className="glass-card" style={{ flex: 1, position: "relative", overflow: "hidden", animation: "slideR .95s cubic-bezier(.16,1,.3,1) .3s both" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}>
            {/* Reuse DashboardMap but hide its own styling/header if possible, or just render it directly */}
            <DashboardMap fullHeight />
          </div>
        </div>
      </div>
    </div>
  );
}

