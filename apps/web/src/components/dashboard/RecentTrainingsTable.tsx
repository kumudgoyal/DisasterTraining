"use client";

import React, { useEffect, useState } from "react";
import { ClipboardList, MapPin, CalendarDays, ChevronRight, ArrowUpRight, Flame, CloudLightning, Activity } from "lucide-react";
import { fetchNasaEvents, NasaEvent } from "@/services/nasaEonet";

export function RecentTrainingsTable() {
  const [events, setEvents] = useState<NasaEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadEvents() {
      try {
        setLoading(true);
        const data = await fetchNasaEvents(10); // Fetch latest 10 events
        setEvents(data.events);
      } catch (err) {
        setError("Failed to load active disaster events.");
      } finally {
        setLoading(false);
      }
    }
    loadEvents();
  }, []);

  const getStatusConfig = (isClosed: boolean) => {
    if (isClosed) return { bg: "rgba(74,222,128,.20)",  dot: "#4ade80", color: "#4ade80", label: "Resolved" };
    return { bg: "rgba(251,191,36,.20)",   dot: "#fbbf24", color: "#fbbf24", label: "Active" };
  };

  const getCategoryIcon = (categoryId: string) => {
    switch (categoryId) {
      case "wildfires": return <Flame style={{ width: "calc(10 * var(--u))", height: "calc(10 * var(--u))", color: "#f97316" }} />;
      case "severeStorms": return <CloudLightning style={{ width: "calc(10 * var(--u))", height: "calc(10 * var(--u))", color: "#3b82f6" }} />;
      default: return <Activity style={{ width: "calc(10 * var(--u))", height: "calc(10 * var(--u))", color: "#8b5cf6" }} />;
    }
  };

  return (
    <div style={{ padding: "calc(16 * var(--u)) calc(18 * var(--u))" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "calc(14 * var(--u))" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "calc(8 * var(--u))" }}>
          <div style={{
            width: "calc(28 * var(--u))", height: "calc(28 * var(--u))",
            borderRadius: "calc(8 * var(--u))",
            background: "rgba(255,255,255,.15)",
            border: "1px solid rgba(255,255,255,.25)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Activity style={{ width: "calc(13 * var(--u))", height: "calc(13 * var(--u))", color: "#fff" }} />
          </div>
          <span style={{ fontSize: "calc(13 * var(--u))", fontWeight: 700, color: "#fff", letterSpacing: "-0.01em" }}>
            Live Event Tracker (NASA EONET)
          </span>
        </div>
        <button style={{
          display: "flex", alignItems: "center", gap: "calc(4 * var(--u))",
          fontSize: "calc(10.5 * var(--u))", fontWeight: 600,
          color: "#93c5fd",
          background: "rgba(96,165,250,.18)",
          border: "1px solid rgba(96,165,250,.30)",
          borderRadius: "calc(8 * var(--u))",
          padding: "calc(5 * var(--u)) calc(10 * var(--u))",
          cursor: "pointer",
        }}>
          View Map <ArrowUpRight style={{ width: "calc(11 * var(--u))", height: "calc(11 * var(--u))" }} />
        </button>
      </div>

      {/* Column headers — desktop */}
      <div
        className="hidden sm:grid"
        style={{
          gridTemplateColumns: "3fr 2fr 2fr auto",
          gap: `0 calc(12 * var(--u))`,
          padding: `0 calc(10 * var(--u)) calc(8 * var(--u))`,
          borderBottom: "1px solid rgba(255,255,255,.12)",
          marginBottom: "calc(4 * var(--u))",
        }}
      >
        {["Event Name", "Category", "Date", "Status"].map((h, i) => (
          <span key={h} style={{
            fontSize: "calc(10 * var(--u))", fontWeight: 700,
            color: "rgba(255,255,255,.9)",
            textTransform: "uppercase", letterSpacing: "0.07em",
            textAlign: i === 3 ? "right" : "left",
          }}>{h}</span>
        ))}
      </div>

      {/* Rows */}
      <div>
        {loading && (
          <div style={{ display: "flex", flexDirection: "column", gap: "calc(8 * var(--u))", marginTop: "calc(8 * var(--u))" }}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} style={{
                height: "calc(40 * var(--u))",
                borderRadius: "calc(8 * var(--u))",
                background: "rgba(255,255,255,0.05)",
                animation: "pulse 1.5s infinite ease-in-out",
              }} />
            ))}
          </div>
        )}

        {error && (
          <div style={{ color: "#f87171", padding: "calc(10 * var(--u))", fontSize: "calc(12 * var(--u))", textAlign: "center" }}>
            {error}
          </div>
        )}

        {!loading && !error && events.map((event) => {
          const st = getStatusConfig(!!event.closed);
          const category = event.categories[0];
          const latestGeo = event.geometry[event.geometry.length - 1];
          const dateStr = latestGeo?.date ? new Date(latestGeo.date).toLocaleDateString() : "Unknown";

          return (
            <div
              key={event.id}
              style={{ borderRadius: "calc(12 * var(--u))", transition: "background 0.18s", cursor: "pointer" }}
              onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,.07)"}
              onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = "transparent"}
            >
              {/* Desktop row */}
              <div
                className="hidden sm:grid"
                style={{
                  gridTemplateColumns: "3fr 2fr 2fr auto",
                  gap: `0 calc(12 * var(--u))`,
                  alignItems: "center",
                  padding: `calc(10 * var(--u)) calc(10 * var(--u))`,
                }}
              >
                <span style={{ fontSize: "calc(12 * var(--u))", fontWeight: 600, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {event.title}
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: "calc(6 * var(--u))", fontSize: "calc(11.5 * var(--u))", color: "rgba(255,255,255,.95)" }}>
                  {getCategoryIcon(category?.id)}
                  {category?.title || "Unknown"}
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: "calc(4 * var(--u))", fontSize: "calc(11.5 * var(--u))", color: "rgba(255,255,255,.95)" }}>
                  <CalendarDays style={{ width: "calc(10 * var(--u))", height: "calc(10 * var(--u))", color: "rgba(255,255,255,.8)", flexShrink: 0 }} />
                  {dateStr}
                </span>
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: "calc(4 * var(--u))",
                  fontSize: "calc(10 * var(--u))", fontWeight: 700,
                  color: st.color, background: st.bg,
                  padding: "calc(4 * var(--u)) calc(9 * var(--u))",
                  borderRadius: "999px", justifySelf: "end",
                  border: `1px solid ${st.dot}40`,
                }}>
                  <span style={{ width: "calc(5 * var(--u))", height: "calc(5 * var(--u))", borderRadius: "50%", background: st.dot }} />
                  {st.label}
                </span>
              </div>

              {/* Mobile card row */}
              <div
                className="sm:hidden"
                style={{ padding: `calc(10 * var(--u)) calc(6 * var(--u))`, display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "calc(8 * var(--u))" }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: "calc(12 * var(--u))", fontWeight: 600, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {event.title}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: "calc(8 * var(--u))", marginTop: "calc(4 * var(--u))", flexWrap: "wrap" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "calc(3 * var(--u))", fontSize: "calc(10.5 * var(--u))", color: "rgba(255,255,255,.95)" }}>
                      {getCategoryIcon(category?.id)} {category?.title || "Unknown"}
                    </span>
                    <span style={{ fontSize: "calc(10.5 * var(--u))", color: "rgba(255,255,255,.95)" }}>{dateStr}</span>
                  </div>
                </div>
                <span style={{
                  flexShrink: 0,
                  display: "inline-flex", alignItems: "center", gap: "calc(4 * var(--u))",
                  fontSize: "calc(9.5 * var(--u))", fontWeight: 700,
                  color: st.color, background: st.bg,
                  padding: "calc(3 * var(--u)) calc(7 * var(--u))",
                  borderRadius: "999px", border: `1px solid ${st.dot}40`,
                }}>
                  <span style={{ width: "calc(5 * var(--u))", height: "calc(5 * var(--u))", borderRadius: "50%", background: st.dot }} />
                  {st.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer CTA */}
      <button style={{
        width: "100%", marginTop: "calc(10 * var(--u))",
        padding: "calc(9 * var(--u))",
        display: "flex", alignItems: "center", justifyContent: "center",
        gap: "calc(5 * var(--u))",
        fontSize: "calc(11 * var(--u))", fontWeight: 600,
        color: "rgba(255,255,255,.9)", background: "none",
        border: "1px dashed rgba(255,255,255,.22)",
        borderRadius: "calc(12 * var(--u))", cursor: "pointer",
      }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = "#fff"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,.4)"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,.65)"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,.22)"; }}
      >
        Load more events <ChevronRight style={{ width: "calc(12 * var(--u))", height: "calc(12 * var(--u))" }} />
      </button>
    </div>
  );
}

