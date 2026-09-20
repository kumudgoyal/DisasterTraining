"use client";

import React from "react";
import { THEMATIC_COVERAGE } from "@/services/mockData";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { PieChart as PieIcon } from "lucide-react";

export function ThematicCoverageChart() {
  const total = THEMATIC_COVERAGE.reduce((acc, item) => acc + item.value, 0);

  return (
    <div style={{ padding: "calc(16 * var(--u)) calc(18 * var(--u))" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "calc(8 * var(--u))", marginBottom: "calc(4 * var(--u))" }}>
        <div style={{
          width: "calc(28 * var(--u))", height: "calc(28 * var(--u))",
          borderRadius: "calc(8 * var(--u))",
          background: "rgba(255,255,255,.18)",
          border: "1px solid rgba(255,255,255,.22)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <PieIcon style={{ width: "calc(13 * var(--u))", height: "calc(13 * var(--u))", color: "#fff" }} />
        </div>
        <span style={{ fontSize: "calc(12 * var(--u))", fontWeight: 600, color: "#fff" }}>Thematic Coverage</span>
      </div>

      {/* Donut chart */}
      <div style={{ position: "relative", height: "calc(220 * var(--u))", width: "100%" }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={THEMATIC_COVERAGE}
              cx="50%" cy="45%"
              innerRadius="52%"
              outerRadius="70%"
              paddingAngle={3}
              dataKey="value"
              strokeWidth={0}
            >
              {THEMATIC_COVERAGE.map((entry, idx) => (
                <Cell key={idx} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "rgba(15,23,42,.85)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(255,255,255,.15)",
                borderRadius: "10px",
                color: "#fff",
                fontSize: "11px",
              }}
            />
            <Legend
              verticalAlign="bottom" height={28}
              iconType="circle" iconSize={7}
              formatter={(value) => (
                <span style={{ color: "rgba(255,255,255,.7)", fontSize: "10px", fontWeight: 600 }}>{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Centre label */}
        <div style={{
          position: "absolute", top: "43%", left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center", pointerEvents: "none",
        }}>
          <p style={{
            fontSize: "calc(26 * var(--u))", fontWeight: 700, color: "#fff",
            lineHeight: 1, fontFamily: "var(--font-tight, 'Inter Tight', 'Inter', sans-serif)",
          }}>{total}</p>
          <p style={{ fontSize: "calc(9 * var(--u))", fontWeight: 600, color: "rgba(255,255,255,.5)", textTransform: "uppercase", letterSpacing: "0.07em", marginTop: "calc(3 * var(--u))" }}>
            Themes
          </p>
        </div>
      </div>
    </div>
  );
}
