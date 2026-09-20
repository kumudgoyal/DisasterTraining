"use client";

import React, { useEffect, useState } from "react";
import { fetchNasaEvents, NasaEvent } from "@/services/nasaEonet";
import { CalendarDays, Flame, CloudLightning, Activity, MapPin, ExternalLink, ArrowRight } from "lucide-react";

export default function TrainingsPage() {
  const [events, setEvents] = useState<NasaEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadEvents() {
      try {
        setLoading(true);
        const data = await fetchNasaEvents(20); // Fetch latest 20 events
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
      case "wildfires": return <Flame style={{ width: "calc(16 * var(--u))", height: "calc(16 * var(--u))", color: "#f97316" }} />;
      case "severeStorms": return <CloudLightning style={{ width: "calc(16 * var(--u))", height: "calc(16 * var(--u))", color: "#3b82f6" }} />;
      default: return <Activity style={{ width: "calc(16 * var(--u))", height: "calc(16 * var(--u))", color: "#8b5cf6" }} />;
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "calc(20 * var(--u))" }}>
      {/* ── Header ── */}
      <div style={{ animation: "wipeRight .80s cubic-bezier(.22,.61,.36,1) .1s both" }}>
        <h1 style={{
          fontFamily: "var(--font-tight, 'Inter Tight', 'Inter', sans-serif)",
          fontSize: "calc(32 * var(--u))",
          fontWeight: 700,
          color: "#fff",
          lineHeight: 1.08,
          letterSpacing: "-0.02em",
        }}>
          Live Event Trainings
        </h1>
        <p style={{
          marginTop: "calc(8 * var(--u))",
          fontSize: "calc(13.5 * var(--u))",
          color: "rgba(255,255,255,.9)",
          lineHeight: "calc(22 * var(--u))",
        }}>
          Deployments and training exercises mapped to real-time NASA EONET alerts.
        </p>
      </div>

      {/* ── Content ── */}
      <div className="glass-card" style={{ padding: "calc(20 * var(--u))", minHeight: "calc(400 * var(--u))", animation: "slideR .95s cubic-bezier(.16,1,.3,1) .2s both" }}>
        {loading && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(calc(300 * var(--u)), 1fr))", gap: "calc(16 * var(--u))" }}>
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} style={{
                height: "calc(160 * var(--u))",
                borderRadius: "calc(12 * var(--u))",
                background: "rgba(255,255,255,0.05)",
                animation: "pulse 1.5s infinite ease-in-out",
              }} />
            ))}
          </div>
        )}

        {error && (
          <div style={{ color: "#f87171", padding: "calc(20 * var(--u))", fontSize: "calc(14 * var(--u))", textAlign: "center" }}>
            {error}
          </div>
        )}

        {!loading && !error && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(calc(300 * var(--u)), 1fr))", gap: "calc(16 * var(--u))" }}>
            {events.map((event) => {
              const st = getStatusConfig(!!event.closed);
              const category = event.categories[0];
              const latestGeo = event.geometry[event.geometry.length - 1];
              const dateStr = latestGeo?.date ? new Date(latestGeo.date).toLocaleDateString() : "Unknown date";
              
              return (
                <div key={event.id} style={{
                  display: "flex", flexDirection: "column",
                  padding: "calc(16 * var(--u))",
                  borderRadius: "calc(12 * var(--u))",
                  background: "rgba(255,255,255,.03)",
                  border: "1px solid rgba(255,255,255,.08)",
                  transition: "all 0.2s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,.07)";
                  (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,.15)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,.03)";
                  (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,.08)";
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "calc(8 * var(--u))" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "calc(8 * var(--u))" }}>
                      <div style={{
                        width: "calc(32 * var(--u))", height: "calc(32 * var(--u))",
                        borderRadius: "calc(8 * var(--u))",
                        background: "rgba(255,255,255,.08)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        {getCategoryIcon(category?.id)}
                      </div>
                      <span style={{ fontSize: "calc(11 * var(--u))", fontWeight: 600, color: "rgba(255,255,255,.95)" }}>
                        {category?.title || "Unknown"}
                      </span>
                    </div>
                    <span style={{
                      display: "inline-flex", alignItems: "center", gap: "calc(4 * var(--u))",
                      fontSize: "calc(10 * var(--u))", fontWeight: 700,
                      color: st.color, background: st.bg,
                      padding: "calc(4 * var(--u)) calc(9 * var(--u))",
                      borderRadius: "999px",
                      border: `1px solid ${st.dot}40`,
                    }}>
                      <span style={{ width: "calc(5 * var(--u))", height: "calc(5 * var(--u))", borderRadius: "50%", background: st.dot }} />
                      {st.label}
                    </span>
                  </div>

                  <h3 style={{ marginTop: "calc(12 * var(--u))", fontSize: "calc(15 * var(--u))", fontWeight: 700, color: "#fff", lineHeight: 1.3 }}>
                    {event.title}
                  </h3>

                  <div style={{ marginTop: "auto", paddingTop: "calc(16 * var(--u))", display: "flex", flexDirection: "column", gap: "calc(6 * var(--u))" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "calc(6 * var(--u))", fontSize: "calc(11 * var(--u))", color: "rgba(255,255,255,.95)" }}>
                      <CalendarDays style={{ width: "calc(12 * var(--u))", height: "calc(12 * var(--u))", color: "rgba(255,255,255,.8)" }} />
                      {dateStr}
                    </span>
                    {latestGeo && latestGeo.coordinates && (
                      <span style={{ display: "flex", alignItems: "center", gap: "calc(6 * var(--u))", fontSize: "calc(11 * var(--u))", color: "rgba(255,255,255,.95)" }}>
                        <MapPin style={{ width: "calc(12 * var(--u))", height: "calc(12 * var(--u))", color: "rgba(255,255,255,.8)" }} />
                        Lat: {latestGeo.coordinates[1].toFixed(2)}, Lng: {latestGeo.coordinates[0].toFixed(2)}
                      </span>
                    )}
                  </div>

                  <a href={event.link} target="_blank" rel="noopener noreferrer" style={{
                    marginTop: "calc(16 * var(--u))",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "calc(6 * var(--u))",
                    padding: "calc(8 * var(--u))",
                    width: "100%",
                    borderRadius: "calc(8 * var(--u))",
                    background: "rgba(255,255,255,.05)",
                    color: "#fff",
                    fontSize: "calc(11 * var(--u))",
                    fontWeight: 600,
                    textDecoration: "none",
                    transition: "background 0.2s"
                  }}
                  onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,.1)"}
                  onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,.05)"}>
                    View Source <ExternalLink style={{ width: "calc(12 * var(--u))", height: "calc(12 * var(--u))" }} />
                  </a>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
