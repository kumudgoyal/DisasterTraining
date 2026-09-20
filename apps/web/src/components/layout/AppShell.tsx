"use client";

import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    /* Full-screen fixed stage with background */
    <div
      className="stage-vignette"
      style={{
        position: "fixed",
        inset: 0,
        overflow: "hidden",
        background: "#080f1c",
        backgroundImage: "url('/disaster-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center 25%",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Sidebar */}
      <Sidebar isOpen={isMobileMenuOpen} setIsOpen={setIsMobileMenuOpen} />

      {/* Main area — offset by sidebar width */}
      <div
        className="absolute top-0 bottom-0 right-0 flex flex-col"
        style={{ left: "calc(220 * var(--u))" }}
      >
        {/* Topbar */}
        <Topbar onMenuClick={() => setIsMobileMenuOpen(true)} />

        {/* Scrollable main content */}
        <main
          className="flex-1 overflow-y-auto overflow-x-hidden glass-rail"
          style={{ padding: "calc(24 * var(--u)) calc(32 * var(--u)) calc(32 * var(--u))" }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
