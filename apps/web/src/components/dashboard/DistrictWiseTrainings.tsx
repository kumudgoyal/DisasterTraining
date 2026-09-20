"use client";

import React, { useState } from "react";
import { DISTRICT_WISE } from "@/services/mockData";
import { MapPin, Users, TrendingUp, ChevronRight } from "lucide-react";

const RANK_COLORS = ["#3b82f6","#6366f1","#8b5cf6","#14b8a6","#10b981","#64748b"];

export function DistrictWiseTrainings() {
  const [hovered, setHovered] = useState<number | null>(null);
  const maxTrainings = Math.max(...DISTRICT_WISE.map((d) => d.trainings));

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
            <MapPin style={{ width: "calc(13 * var(--u))", height: "calc(13 * var(--u))", color: "#fff" }} />
          </div>
          <span style={{ fontSize: "calc(13 * var(--u))", fontWeight: 700, color: "#fff" }}>District-wise Trainings</span>
        </div>
        <span style={{
          fontSize: "calc(9.5 * var(--u))", fontWeight: 600,
          color: "rgba(255,255,255,.55)",
          background: "rgba(255,255,255,.1)",
          border: "1px solid rgba(255,255,255,.14)",
          borderRadius: "999px",
          padding: "calc(3 * var(--u)) calc(9 * var(--u))",
        }}>
          Top {DISTRICT_WISE.length}
        </span>
      </div>

      {/* Rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: "calc(4 * var(--u))" }}>
        {DISTRICT_WISE.map((item, idx) => {
          const pct = Math.round((item.trainings / maxTrainings) * 100);
          const color = RANK_COLORS[idx] ?? "#64748b";
          return (
            <div
              key={idx}
              onMouseEnter={() => setHovered(idx)}
              onMouseLeave={() => setHovered(null)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "calc(10 * var(--u))",
                padding: "calc(8 * var(--u)) calc(10 * var(--u))",
                borderRadius: "calc(12 * var(--u))",
                background: hovered === idx ? "rgba(255,255,255,.10)" : "transparent",
                cursor: "pointer",
                transition: "background 0.18s",
              }}
            >
              {/* Rank */}
              <div style={{
                flexShrink: 0,
                width: "calc(22 * var(--u))", height: "calc(22 * var(--u))",
                borderRadius: "50%",
                background: color,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "calc(9 * var(--u))", fontWeight: 800, color: "#fff",
              }}>
                {idx + 1}
              </div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "calc(5 * var(--u))" }}>
                  <span style={{ fontSize: "calc(11.5 * var(--u))", fontWeight: 600, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {item.district}
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: "calc(10 * var(--u))", flexShrink: 0, marginLeft: "calc(8 * var(--u))" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "calc(3 * var(--u))", fontSize: "calc(10.5 * var(--u))", fontWeight: 700, color: "#fff" }}>
                      <TrendingUp style={{ width: "calc(10 * var(--u))", height: "calc(10 * var(--u))", color: "rgba(255,255,255,.65)" }} />
                      {item.trainings}
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: "calc(3 * var(--u))", fontSize: "calc(11 * var(--u))", color: "rgba(255,255,255,.80)" }}>
                      <Users style={{ width: "calc(10 * var(--u))", height: "calc(10 * var(--u))" }} />
                      {item.participants.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div style={{ width: "100%", height: "calc(4 * var(--u))", background: "rgba(255,255,255,.12)", borderRadius: "999px", overflow: "hidden" }}>
                  <div style={{
                    width: `${pct}%`, height: "100%",
                    background: color, borderRadius: "999px",
                    transition: "width 0.5s cubic-bezier(.16,1,.3,1)",
                  }} />
                </div>
              </div>

              <ChevronRight style={{
                flexShrink: 0,
                width: "calc(14 * var(--u))", height: "calc(14 * var(--u))",
                color: hovered === idx ? "rgba(255,255,255,.7)" : "rgba(255,255,255,.2)",
                transition: "all 0.18s",
                transform: hovered === idx ? "translateX(1px)" : "none",
              }} />
            </div>
          );
        })}
      </div>

      {/* Footer CTA */}
      <button style={{
        width: "100%",
        marginTop: "calc(10 * var(--u))",
        padding: "calc(9 * var(--u))",
        display: "flex", alignItems: "center", justifyContent: "center",
        gap: "calc(5 * var(--u))",
        fontSize: "calc(10.5 * var(--u))",
        fontWeight: 600,
        color: "rgba(255,255,255,.55)",
        background: "none",
        border: "1px dashed rgba(255,255,255,.18)",
        borderRadius: "calc(12 * var(--u))",
        cursor: "pointer",
        transition: "all 0.18s",
      }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color="#fff"; (e.currentTarget as HTMLButtonElement).style.borderColor="rgba(255,255,255,.35)"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color="rgba(255,255,255,.55)"; (e.currentTarget as HTMLButtonElement).style.borderColor="rgba(255,255,255,.18)"; }}
      >
        View all districts <ChevronRight style={{ width: "calc(12 * var(--u))", height: "calc(12 * var(--u))" }} />
      </button>
    </div>
  );
}
