"use client";

import React from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { PieChart, Activity, TrendingUp, Zap } from "lucide-react";

const RESPONSE_DATA = [
  { month: "Jan", time: 45, incidents: 12 },
  { month: "Feb", time: 42, incidents: 19 },
  { month: "Mar", time: 38, incidents: 15 },
  { month: "Apr", time: 35, incidents: 22 },
  { month: "May", time: 31, incidents: 28 },
  { month: "Jun", time: 28, incidents: 34 },
];

const RESOURCE_DATA = [
  { name: "NDRF", active: 45, standby: 20 },
  { name: "SDRF", active: 85, standby: 40 },
  { name: "Medical", active: 120, standby: 30 },
  { name: "Fire", active: 65, standby: 15 },
  { name: "Police", active: 150, standby: 50 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: "rgba(15,23,42,0.9)", border: "1px solid rgba(255,255,255,0.1)", padding: "10px", borderRadius: "8px", color: "#fff", fontSize: "12px" }}>
        <p style={{ fontWeight: 600, marginBottom: "4px" }}>{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function AnalyticsPage() {
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
            Operational Analytics
          </h1>
          <p style={{
            marginTop: "calc(8 * var(--u))",
            fontSize: "calc(13.5 * var(--u))",
            color: "rgba(255,255,255,.9)",
            lineHeight: "calc(22 * var(--u))",
          }}>
            Data-driven insights on response times, resource utilization, and historical incident trends across India.
          </p>
        </div>
        <button className="glass-chip" style={{
          padding: "calc(8 * var(--u)) calc(16 * var(--u))",
          display: "flex", alignItems: "center", gap: "calc(8 * var(--u))",
          color: "#fff", fontWeight: 600, fontSize: "calc(12 * var(--u))",
          cursor: "pointer", border: "1px solid rgba(255,255,255,0.15)"
        }}>
          <PieChart style={{ width: "calc(14 * var(--u))", height: "calc(14 * var(--u))" }} />
          Export Data
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "calc(16 * var(--u))", animation: "slideR .95s cubic-bezier(.16,1,.3,1) .2s both" }}>
        {/* Response Time Chart */}
        <div className="glass-card" style={{ padding: "calc(20 * var(--u))" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "calc(20 * var(--u))" }}>
            <div>
              <h3 style={{ fontSize: "calc(16 * var(--u))", fontWeight: 600, color: "#fff" }}>Avg. Response Time (mins)</h3>
              <p style={{ fontSize: "calc(12 * var(--u))", color: "rgba(255,255,255,.7)", marginTop: "calc(4 * var(--u))" }}>Time taken for first responders to reach the site.</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "calc(6 * var(--u))", color: "#4ade80", background: "rgba(74,222,128,0.15)", padding: "calc(4 * var(--u)) calc(8 * var(--u))", borderRadius: "calc(4 * var(--u))", fontSize: "calc(12 * var(--u))", fontWeight: 600 }}>
              <TrendingUp style={{ width: "calc(14 * var(--u))", height: "calc(14 * var(--u))" }} />
              -37% (YTD)
            </div>
          </div>
          <div style={{ height: "calc(240 * var(--u))", width: "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={RESPONSE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTime" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis stroke="rgba(255,255,255,0.5)" tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="time" name="Response Time (m)" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorTime)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Incidents Trend Chart */}
        <div className="glass-card" style={{ padding: "calc(20 * var(--u))" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "calc(20 * var(--u))" }}>
            <div>
              <h3 style={{ fontSize: "calc(16 * var(--u))", fontWeight: 600, color: "#fff" }}>Incident Volume Trends</h3>
              <p style={{ fontSize: "calc(12 * var(--u))", color: "rgba(255,255,255,.7)", marginTop: "calc(4 * var(--u))" }}>Number of reported disasters & critical events.</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "calc(6 * var(--u))", color: "#f87171", background: "rgba(248,113,113,0.15)", padding: "calc(4 * var(--u)) calc(8 * var(--u))", borderRadius: "calc(4 * var(--u))", fontSize: "calc(12 * var(--u))", fontWeight: 600 }}>
              <Zap style={{ width: "calc(14 * var(--u))", height: "calc(14 * var(--u))" }} />
              +14% (YTD)
            </div>
          </div>
          <div style={{ height: "calc(240 * var(--u))", width: "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={RESPONSE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis stroke="rgba(255,255,255,0.5)" tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="incidents" name="Total Incidents" stroke="#ef4444" strokeWidth={3} dot={{ r: 4, fill: "#ef4444", strokeWidth: 2, stroke: "#fff" }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Resource Allocation Chart */}
        <div className="glass-card" style={{ padding: "calc(20 * var(--u))", gridColumn: "1 / -1" }}>
          <div style={{ marginBottom: "calc(20 * var(--u))" }}>
            <h3 style={{ fontSize: "calc(16 * var(--u))", fontWeight: 600, color: "#fff" }}>Resource Deployment (National Level)</h3>
            <p style={{ fontSize: "calc(12 * var(--u))", color: "rgba(255,255,255,.7)", marginTop: "calc(4 * var(--u))" }}>Active vs Standby units across primary response agencies.</p>
          </div>
          <div style={{ height: "calc(280 * var(--u))", width: "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={RESOURCE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis stroke="rgba(255,255,255,0.5)" tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.05)" }} />
                <Bar dataKey="active" name="Active Deployment" stackId="a" fill="#10b981" radius={[0, 0, 4, 4]} />
                <Bar dataKey="standby" name="Standby Reserve" stackId="a" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
