"use client";

import React from "react";
import { FileText, Download, Filter, Search, Calendar, CheckCircle2 } from "lucide-react";

const REPORTS = [
  { id: "REP-24-001", title: "National Response Summary - Q1 2024", type: "Quarterly", date: "Apr 02, 2024", size: "2.4 MB", status: "Published" },
  { id: "REP-24-002", title: "Assam Floods Situation Report", type: "SITREP", date: "May 15, 2024", size: "1.1 MB", status: "Published" },
  { id: "REP-24-003", title: "Cyclone Preparedness Audit", type: "Audit", date: "May 28, 2024", size: "4.8 MB", status: "Under Review" },
  { id: "REP-24-004", title: "Resource Depletion Analysis", type: "Analytics", date: "Jun 10, 2024", size: "850 KB", status: "Published" },
  { id: "REP-24-005", title: "Monthly Training Attendance", type: "Training", date: "Jul 01, 2024", size: "1.5 MB", status: "Draft" },
];

export default function ReportsPage() {
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
            Reports & Publications
          </h1>
          <p style={{
            marginTop: "calc(8 * var(--u))",
            fontSize: "calc(13.5 * var(--u))",
            color: "rgba(255,255,255,.9)",
            lineHeight: "calc(22 * var(--u))",
          }}>
            Generate, download, and review automated situation reports and performance audits.
          </p>
        </div>
        <button className="glass-chip" style={{
          padding: "calc(8 * var(--u)) calc(16 * var(--u))",
          display: "flex", alignItems: "center", gap: "calc(8 * var(--u))",
          color: "#fff", fontWeight: 600, fontSize: "calc(12 * var(--u))",
          cursor: "pointer", border: "1px solid rgba(255,255,255,0.15)",
          background: "rgba(59,130,246,0.15)"
        }}>
          <FileText style={{ width: "calc(14 * var(--u))", height: "calc(14 * var(--u))" }} />
          Generate New Report
        </button>
      </div>

      {/* Toolbar */}
      <div style={{ display: "flex", gap: "calc(12 * var(--u))", animation: "slideR .95s cubic-bezier(.16,1,.3,1) .2s both" }}>
        <div style={{ flex: 1, position: "relative" }}>
          <Search style={{ position: "absolute", left: "calc(12 * var(--u))", top: "50%", transform: "translateY(-50%)", width: "calc(16 * var(--u))", height: "calc(16 * var(--u))", color: "rgba(255,255,255,.5)" }} />
          <input 
            type="text" 
            placeholder="Search reports by title, ID, or type..."
            style={{
              width: "100%", padding: "calc(10 * var(--u)) calc(12 * var(--u)) calc(10 * var(--u)) calc(36 * var(--u))",
              background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)",
              borderRadius: "calc(8 * var(--u))", color: "#fff", fontSize: "calc(13 * var(--u))",
              outline: "none"
            }}
          />
        </div>
        <button style={{ padding: "0 calc(16 * var(--u))", display: "flex", alignItems: "center", gap: "calc(8 * var(--u))", background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)", borderRadius: "calc(8 * var(--u))", color: "rgba(255,255,255,.9)", cursor: "pointer", fontSize: "calc(13 * var(--u))" }}>
          <Filter style={{ width: "calc(14 * var(--u))", height: "calc(14 * var(--u))" }} />
          Filter
        </button>
        <button style={{ padding: "0 calc(16 * var(--u))", display: "flex", alignItems: "center", gap: "calc(8 * var(--u))", background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)", borderRadius: "calc(8 * var(--u))", color: "rgba(255,255,255,.9)", cursor: "pointer", fontSize: "calc(13 * var(--u))" }}>
          <Calendar style={{ width: "calc(14 * var(--u))", height: "calc(14 * var(--u))" }} />
          Date Range
        </button>
      </div>

      {/* Reports List */}
      <div className="glass-card" style={{ display: "flex", flexDirection: "column", padding: "calc(4 * var(--u))", animation: "slideR .95s cubic-bezier(.16,1,.3,1) .3s both" }}>
        {REPORTS.map((report, idx) => (
          <div key={report.id} style={{ 
            display: "grid", gridTemplateColumns: "1fr auto auto auto", gap: "calc(24 * var(--u))", 
            alignItems: "center", padding: "calc(16 * var(--u)) calc(20 * var(--u))",
            borderBottom: idx !== REPORTS.length - 1 ? "1px solid rgba(255,255,255,.05)" : "none",
            transition: "background 0.2s",
            cursor: "pointer"
          }}
          onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,.03)")}
          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "calc(16 * var(--u))" }}>
              <div style={{ 
                width: "calc(40 * var(--u))", height: "calc(40 * var(--u))", 
                borderRadius: "calc(8 * var(--u))", background: "rgba(59,130,246,0.1)", 
                display: "flex", alignItems: "center", justifyContent: "center", color: "#60a5fa" 
              }}>
                <FileText style={{ width: "calc(20 * var(--u))", height: "calc(20 * var(--u))" }} />
              </div>
              <div>
                <h3 style={{ fontSize: "calc(15 * var(--u))", fontWeight: 600, color: "#fff", marginBottom: "calc(4 * var(--u))" }}>{report.title}</h3>
                <div style={{ display: "flex", alignItems: "center", gap: "calc(12 * var(--u))", fontSize: "calc(12 * var(--u))", color: "rgba(255,255,255,.6)" }}>
                  <span style={{ color: "rgba(255,255,255,.9)" }}>ID: {report.id}</span>
                  <span>•</span>
                  <span style={{ background: "rgba(255,255,255,.1)", padding: "calc(2 * var(--u)) calc(6 * var(--u))", borderRadius: "calc(4 * var(--u))", color: "rgba(255,255,255,.9)" }}>{report.type}</span>
                </div>
              </div>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "calc(4 * var(--u))" }}>
              <span style={{ fontSize: "calc(13 * var(--u))", color: "rgba(255,255,255,.9)" }}>{report.date}</span>
              <span style={{ fontSize: "calc(11 * var(--u))", color: "rgba(255,255,255,.5)" }}>{report.size}</span>
            </div>

            <div style={{ width: "calc(100 * var(--u))", display: "flex", justifyContent: "flex-start" }}>
              <span style={{ 
                display: "flex", alignItems: "center", gap: "calc(4 * var(--u))",
                padding: "calc(4 * var(--u)) calc(8 * var(--u))", borderRadius: "calc(12 * var(--u))",
                fontSize: "calc(11 * var(--u))", fontWeight: 600,
                ...(report.status === "Published" 
                  ? { color: "#4ade80", background: "rgba(74,222,128,0.15)" }
                  : report.status === "Draft" 
                    ? { color: "#94a3b8", background: "rgba(148,163,184,0.15)" }
                    : { color: "#fbbf24", background: "rgba(251,191,36,0.15)" })
              }}>
                {report.status === "Published" && <CheckCircle2 style={{ width: "calc(12 * var(--u))", height: "calc(12 * var(--u))" }} />}
                {report.status}
              </span>
            </div>

            <button style={{ 
              background: "transparent", border: "1px solid rgba(255,255,255,.2)", 
              color: "#fff", width: "calc(36 * var(--u))", height: "calc(36 * var(--u))",
              borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", transition: "all 0.2s"
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#000"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#fff"; }}
            >
              <Download style={{ width: "calc(16 * var(--u))", height: "calc(16 * var(--u))" }} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
