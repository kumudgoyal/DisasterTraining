import React from "react";

export default function UsersPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "calc(20 * var(--u))", height: "100%", justifyContent: "center", alignItems: "center" }}>
      <div className="glass-card" style={{ padding: "calc(40 * var(--u))", textAlign: "center", animation: "popIn .58s cubic-bezier(.16,1,.3,1) both" }}>
        <h1 style={{ fontSize: "calc(32 * var(--u))", fontWeight: 700, color: "#fff" }}>
          Users
        </h1>
        <p style={{ marginTop: "calc(10 * var(--u))", fontSize: "calc(14 * var(--u))", color: "rgba(255,255,255,.7)" }}>
          This section is currently under construction.
        </p>
      </div>
    </div>
  );
}
