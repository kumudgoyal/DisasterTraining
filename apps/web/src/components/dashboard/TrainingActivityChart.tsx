"use client";

import React from "react";
import { TRAINING_ACTIVITY } from "@/services/mockData";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line } from "recharts";
import { TrendingUp } from "lucide-react";

export function TrainingActivityChart() {
  return (
    <div style={{ padding: "calc(16 * var(--u)) calc(18 * var(--u))" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "calc(12 * var(--u))", marginBottom: "calc(8 * var(--u))", flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "calc(8 * var(--u))" }}>
          <div style={{
            width: "calc(28 * var(--u))", height: "calc(28 * var(--u))",
            borderRadius: "calc(8 * var(--u))",
            background: "rgba(255,255,255,.18)",
            border: "1px solid rgba(255,255,255,.22)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <TrendingUp style={{ width: "calc(13 * var(--u))", height: "calc(13 * var(--u))", color: "#fff" }} />
          </div>
          <div>
            <p style={{ fontSize: "calc(12 * var(--u))", fontWeight: 600, color: "#fff" }}>Training Activity Trend</p>
            <p style={{ fontSize: "calc(10 * var(--u))", color: "rgba(255,255,255,.5)", marginTop: "calc(2 * var(--u))" }}>
              Monthly trainings &amp; participants
            </p>
          </div>
        </div>
        <select style={{
          height: "calc(30 * var(--u))",
          padding: "0 calc(10 * var(--u))",
          fontSize: "calc(10 * var(--u))",
          fontWeight: 600,
          color: "rgba(255,255,255,.8)",
          background: "rgba(255,255,255,.12)",
          border: "1px solid rgba(255,255,255,.18)",
          borderRadius: "calc(8 * var(--u))",
          cursor: "pointer",
          outline: "none",
        }}>
          <option value="12m" style={{ background: "#1e293b" }}>Last 12 months</option>
          <option value="6m"  style={{ background: "#1e293b" }}>Last 6 months</option>
          <option value="3m"  style={{ background: "#1e293b" }}>Last 3 months</option>
        </select>
      </div>

      {/* Chart */}
      <div style={{ height: "calc(240 * var(--u))", width: "100%", marginTop: "calc(8 * var(--u))" }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={TRAINING_ACTIVITY} margin={{ top: 8, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="participantsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#60a5fa" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#60a5fa" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="trainingsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#4ade80" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#4ade80" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.08)" vertical={false} />
            <XAxis
              dataKey="month"
              axisLine={false} tickLine={false}
              tick={{ fill: "rgba(255,255,255,.45)", fontSize: 10, fontWeight: 500 }}
              dy={8}
            />
            <YAxis
              axisLine={false} tickLine={false}
              tick={{ fill: "rgba(255,255,255,.40)", fontSize: 10 }}
            />
            <Tooltip
              contentStyle={{
                background: "rgba(15,23,42,.85)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(255,255,255,.15)",
                borderRadius: "12px",
                color: "#fff",
                fontSize: "11px",
              }}
              cursor={{ stroke: "rgba(255,255,255,.15)", strokeWidth: 1, strokeDasharray: "4 4" }}
            />
            <Legend
              verticalAlign="top" height={28}
              iconType="circle"
              iconSize={7}
              formatter={(value) => (
                <span style={{ color: "rgba(255,255,255,.7)", fontSize: "10px", fontWeight: 600 }}>{value}</span>
              )}
            />
            <Area
              type="monotone" dataKey="participants" name="Participants"
              stroke="#60a5fa" strokeWidth={2}
              fill="url(#participantsGradient)"
            />
            <Area
              type="monotone" dataKey="trainings" name="Trainings"
              stroke="#4ade80" strokeWidth={2}
              fill="url(#trainingsGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
