"use client";

import React, { useState } from "react";
import { Users, Search, Filter, Shield, MoreVertical, Mail, Phone, MapPin } from "lucide-react";

const MOCK_PARTICIPANTS = [
  { id: "1", name: "Ravi Kumar", role: "First Responder", org: "NDRF", district: "Ludhiana", phone: "+91 98765 43210", email: "ravi.k@example.com", status: "Active" },
  { id: "2", name: "Priya Singh", role: "Medical Officer", org: "State Health Dept", district: "Patiala", phone: "+91 98765 43211", email: "priya.s@example.com", status: "Active" },
  { id: "3", name: "Amit Sharma", role: "Volunteer", org: "Red Cross", district: "Amritsar", phone: "+91 98765 43212", email: "amit.s@example.com", status: "Inactive" },
  { id: "4", name: "Sandeep Kaur", role: "Fire Officer", org: "State Fire Service", district: "Mohali", phone: "+91 98765 43213", email: "sandeep.k@example.com", status: "Active" },
  { id: "5", name: "Vikram Jeet", role: "Rescue Specialist", org: "SDRF", district: "Jalandhar", phone: "+91 98765 43214", email: "vikram.j@example.com", status: "Active" },
];

export default function ParticipantsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = MOCK_PARTICIPANTS.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.org.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "calc(20 * var(--u))" }}>
      {/* ── Header ── */}
      <div style={{ animation: "wipeRight .80s cubic-bezier(.22,.61,.36,1) .1s both", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <h1 style={{
            fontFamily: "var(--font-tight, 'Inter Tight', 'Inter', sans-serif)",
            fontSize: "calc(32 * var(--u))",
            fontWeight: 700,
            color: "#fff",
            lineHeight: 1.08,
            letterSpacing: "-0.02em",
          }}>
            Participants Directory
          </h1>
          <p style={{
            marginTop: "calc(8 * var(--u))",
            fontSize: "calc(13.5 * var(--u))",
            color: "rgba(255,255,255,.9)",
            lineHeight: "calc(22 * var(--u))",
          }}>
            Manage and view personnel across various disaster response units.
          </p>
        </div>
        <button className="glass-chip" style={{
          padding: "calc(8 * var(--u)) calc(16 * var(--u))",
          display: "flex", alignItems: "center", gap: "calc(8 * var(--u))",
          color: "#fff", fontWeight: 600, fontSize: "calc(12 * var(--u))",
          cursor: "pointer", border: "1px solid rgba(255,255,255,0.15)"
        }}>
          <Users style={{ width: "calc(14 * var(--u))", height: "calc(14 * var(--u))" }} />
          Add Participant
        </button>
      </div>

      {/* ── Toolbar ── */}
      <div className="glass-card" style={{ padding: "calc(12 * var(--u)) calc(16 * var(--u))", display: "flex", gap: "calc(12 * var(--u))", animation: "slideR .95s cubic-bezier(.16,1,.3,1) .2s both" }}>
        <div style={{
          flex: 1, display: "flex", alignItems: "center", gap: "calc(8 * var(--u))",
          background: "rgba(255,255,255,.05)", borderRadius: "calc(8 * var(--u))",
          padding: "calc(8 * var(--u)) calc(12 * var(--u))", border: "1px solid rgba(255,255,255,.1)"
        }}>
          <Search style={{ width: "calc(14 * var(--u))", height: "calc(14 * var(--u))", color: "rgba(255,255,255,.5)" }} />
          <input
            type="text"
            placeholder="Search participants or organizations..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{
              background: "transparent", border: "none", color: "#fff",
              fontSize: "calc(13 * var(--u))", width: "100%", outline: "none"
            }}
          />
        </div>
        <button style={{
          display: "flex", alignItems: "center", gap: "calc(8 * var(--u))",
          background: "rgba(255,255,255,.05)", borderRadius: "calc(8 * var(--u))",
          padding: "calc(8 * var(--u)) calc(16 * var(--u))", border: "1px solid rgba(255,255,255,.1)",
          color: "#fff", cursor: "pointer", fontWeight: 500, fontSize: "calc(13 * var(--u))"
        }}>
          <Filter style={{ width: "calc(14 * var(--u))", height: "calc(14 * var(--u))" }} />
          Filters
        </button>
      </div>

      {/* ── Grid ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(calc(300 * var(--u)), 1fr))", gap: "calc(16 * var(--u))", animation: "slideR .95s cubic-bezier(.16,1,.3,1) .3s both" }}>
        {filtered.map(p => (
          <div key={p.id} className="glass-card" style={{ padding: "calc(16 * var(--u))", display: "flex", flexDirection: "column", gap: "calc(12 * var(--u))" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ display: "flex", gap: "calc(12 * var(--u))", alignItems: "center" }}>
                <div style={{
                  width: "calc(40 * var(--u))", height: "calc(40 * var(--u))",
                  borderRadius: "50%", background: "rgba(255,255,255,.1)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "calc(16 * var(--u))", fontWeight: 700, color: "#fff"
                }}>
                  {p.name.charAt(0)}
                </div>
                <div>
                  <h3 style={{ fontSize: "calc(14 * var(--u))", fontWeight: 600, color: "#fff" }}>{p.name}</h3>
                  <span style={{ fontSize: "calc(11 * var(--u))", color: "rgba(255,255,255,.9)" }}>{p.role}</span>
                </div>
              </div>
              <button style={{ background: "transparent", border: "none", color: "rgba(255,255,255,.5)", cursor: "pointer" }}>
                <MoreVertical style={{ width: "calc(16 * var(--u))", height: "calc(16 * var(--u))" }} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "calc(8 * var(--u))", marginTop: "calc(4 * var(--u))" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "calc(8 * var(--u))", fontSize: "calc(12 * var(--u))", color: "rgba(255,255,255,.95)" }}>
                <Shield style={{ width: "calc(12 * var(--u))", height: "calc(12 * var(--u))", color: "rgba(255,255,255,.8)" }} />
                {p.org}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "calc(8 * var(--u))", fontSize: "calc(12 * var(--u))", color: "rgba(255,255,255,.95)" }}>
                <MapPin style={{ width: "calc(12 * var(--u))", height: "calc(12 * var(--u))", color: "rgba(255,255,255,.8)" }} />
                {p.district}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "calc(8 * var(--u))", fontSize: "calc(12 * var(--u))", color: "rgba(255,255,255,.95)" }}>
                <Mail style={{ width: "calc(12 * var(--u))", height: "calc(12 * var(--u))", color: "rgba(255,255,255,.8)" }} />
                {p.email}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "calc(8 * var(--u))", fontSize: "calc(12 * var(--u))", color: "rgba(255,255,255,.95)" }}>
                <Phone style={{ width: "calc(12 * var(--u))", height: "calc(12 * var(--u))", color: "rgba(255,255,255,.8)" }} />
                {p.phone}
              </div>
            </div>

            <div style={{ marginTop: "calc(8 * var(--u))", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(255,255,255,.1)", paddingTop: "calc(12 * var(--u))" }}>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: "calc(6 * var(--u))",
                fontSize: "calc(11 * var(--u))", fontWeight: 600,
                color: p.status === "Active" ? "#4ade80" : "rgba(255,255,255,.5)",
              }}>
                <span style={{ width: "calc(6 * var(--u))", height: "calc(6 * var(--u))", borderRadius: "50%", background: p.status === "Active" ? "#4ade80" : "rgba(255,255,255,.5)" }} />
                {p.status}
              </span>
              <button style={{
                background: "rgba(255,255,255,.1)", border: "none", color: "#fff",
                fontSize: "calc(11 * var(--u))", fontWeight: 500, padding: "calc(4 * var(--u)) calc(12 * var(--u))",
                borderRadius: "calc(6 * var(--u))", cursor: "pointer"
              }}>
                View Profile
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

