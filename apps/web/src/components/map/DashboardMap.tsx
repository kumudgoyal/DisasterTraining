"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Map } from "lucide-react";

const MapInner = dynamic(() => import("./DashboardMapInner"), {
  ssr: false,
  loading: () => (
    <div style={{
      width: "100%", height: "100%",
      display: "flex", alignItems: "center", justifyContent: "center",
      background: "rgba(255,255,255,.06)",
    }}>
      <span style={{ color: "rgba(255,255,255,.4)", fontSize: "calc(12 * var(--u))", fontWeight: 500 }}>
        Loading Map…
      </span>
    </div>
  ),
});

export function DashboardMap({ fullHeight = false }: { fullHeight?: boolean }) {
  return (
    <div style={{ 
      padding: fullHeight ? 0 : "calc(16 * var(--u)) calc(18 * var(--u))", 
      display: "flex", flexDirection: "column", gap: "calc(12 * var(--u))",
      height: fullHeight ? "100%" : "auto"
    }}>
      {/* Header */}
      {!fullHeight && (
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "calc(10 * var(--u))", flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "calc(8 * var(--u))" }}>
          <div style={{
            width: "calc(28 * var(--u))", height: "calc(28 * var(--u))",
            borderRadius: "calc(8 * var(--u))",
            background: "rgba(255,255,255,.18)",
            border: "1px solid rgba(255,255,255,.22)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Map style={{ width: "calc(13 * var(--u))", height: "calc(13 * var(--u))", color: "#fff" }} />
          </div>
          <div>
            <p style={{ fontSize: "calc(12 * var(--u))", fontWeight: 600, color: "#fff" }}>Training Coverage Map</p>
            <p style={{ fontSize: "calc(10 * var(--u))", color: "rgba(255,255,255,.5)", marginTop: "calc(2 * var(--u))" }}>
              Spatial distribution of disaster management trainings
            </p>
          </div>
        </div>

        {/* Filter selects */}
        <div style={{ display: "flex", gap: "calc(8 * var(--u))", flexWrap: "wrap" }}>
          {[["All Themes", "First Aid", "Fire Safety"], ["All Districts", "Ludhiana", "Patiala"]].map((opts, i) => (
            <select key={i} style={{
              height: "calc(30 * var(--u))",
              padding: "0 calc(10 * var(--u))",
              fontSize: "calc(10 * var(--u))", fontWeight: 600,
              color: "rgba(255,255,255,.8)",
              background: "rgba(255,255,255,.12)",
              border: "1px solid rgba(255,255,255,.18)",
              borderRadius: "calc(8 * var(--u))",
              cursor: "pointer", outline: "none",
            }}>
              {opts.map(o => <option key={o} style={{ background: "#1e293b" }}>{o}</option>)}
            </select>
          ))}
        </div>
          </div>
        
      )}

      {/* Map container */}
      <div style={{
        borderRadius: fullHeight ? 0 : "calc(14 * var(--u))",
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,.14)",
        height: fullHeight ? "100%" : "calc(340 * var(--u))",
        minHeight: fullHeight ? "100%" : "240px",
        flex: fullHeight ? 1 : "none"
      }}>
        <MapInner />
      </div>
    </div>
  );
}
