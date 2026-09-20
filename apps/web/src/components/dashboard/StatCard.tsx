import React from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendLabel?: string;
  trendDirection?: "up" | "down" | "neutral";
  iconBgColor?: string;
  iconColor?: string;
  animDelay?: string;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendLabel = "vs last month",
  trendDirection = "up",
  animDelay = "0s",
}: StatCardProps) {
  return (
    <div
      className="glass-card"
      style={{
        padding: "calc(16 * var(--u)) calc(18 * var(--u))",
        animation: `slideR .95s cubic-bezier(.16,1,.3,1) ${animDelay} both`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "calc(8 * var(--u))" }}>
        <div style={{ minWidth: 0 }}>
          <p style={{
            fontSize: "calc(10.5 * var(--u))",
            fontWeight: 500,
            color: "rgba(255,255,255,.72)",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}>
            {title}
          </p>
          <p style={{
            marginTop: "calc(6 * var(--u))",
            fontSize: "calc(28 * var(--u))",
            fontWeight: 700,
            color: "#fff",
            letterSpacing: "-0.03em",
            lineHeight: 1,
            fontFamily: "var(--font-tight, 'Inter Tight', 'Inter', sans-serif)",
          }}>
            {value}
          </p>
        </div>
        <div style={{
          flexShrink: 0,
          width: "calc(36 * var(--u))",
          height: "calc(36 * var(--u))",
          borderRadius: "calc(10 * var(--u))",
          background: "rgba(255,255,255,.18)",
          border: "1px solid rgba(255,255,255,.22)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <Icon style={{ width: "calc(18 * var(--u))", height: "calc(18 * var(--u))", color: "#fff" }} />
        </div>
      </div>

      {trend && (
        <div style={{
          marginTop: "calc(10 * var(--u))",
          display: "flex",
          alignItems: "center",
          gap: "calc(4 * var(--u))",
          fontSize: "calc(10 * var(--u))",
          flexWrap: "wrap",
        }}>
          <span style={{
            fontWeight: 600,
            color: trendDirection === "up"
              ? "#4ade80"
              : trendDirection === "down"
              ? "#f87171"
              : "rgba(255,255,255,.8)",
          }}>
            {trendDirection === "up" && "↑ "}
            {trendDirection === "down" && "↓ "}
            {trend}
          </span>
          <span style={{ color: "rgba(255,255,255,.50)" }}>{trendLabel}</span>
        </div>
      )}
    </div>
  );
}
