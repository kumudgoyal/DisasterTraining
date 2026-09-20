"use client";

import React from "react";

const LINKS = ["About", "Help", "Privacy", "Terms"];

export function FooterLinks() {
  return (
    <div style={{ display: "flex", gap: "calc(16 * var(--u))" }}>
      {LINKS.map((l) => (
        <a
          key={l}
          href="#"
          style={{
            fontSize: "calc(10.5 * var(--u))",
            color: "rgba(255,255,255,.65)",
            textDecoration: "none",
            fontWeight: 500,
            transition: "color 0.18s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,.65)")}
        >
          {l}
        </a>
      ))}
    </div>
  );
}
