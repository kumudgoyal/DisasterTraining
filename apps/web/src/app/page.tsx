import React from "react";
import { KPIS } from "@/services/mockData";
import { StatCard } from "@/components/dashboard/StatCard";
import { TrainingActivityChart } from "@/components/dashboard/TrainingActivityChart";
import { ThematicCoverageChart } from "@/components/dashboard/ThematicCoverageChart";
import { DistrictWiseTrainings } from "@/components/dashboard/DistrictWiseTrainings";
import { RecentTrainingsTable } from "@/components/dashboard/RecentTrainingsTable";
import { RecentNotifications } from "@/components/dashboard/RecentNotifications";
import { DashboardMap } from "@/components/map/DashboardMap";
import { Users, GraduationCap, MapPin, CheckCircle, TrendingUp, Building2 } from "lucide-react";

const KPI_CARDS = [
  { title: "Total Trainings",   value: KPIS.totalTrainings,                    icon: GraduationCap, trend: KPIS.totalTrainingsTrend,      delay: ".10s" },
  { title: "Participants",      value: KPIS.totalParticipants.toLocaleString(), icon: Users,         trend: KPIS.totalParticipantsTrend,   delay: ".16s" },
  { title: "Districts Covered", value: KPIS.districtsCovered,                  icon: MapPin,        trend: KPIS.districtsCoveredTrend,    delay: ".22s" },
  { title: "Avg. Attendance",   value: `${KPIS.averageAttendance}%`,           icon: CheckCircle,   trend: KPIS.averageAttendanceTrend,   delay: ".28s" },
  { title: "Impact Score",      value: `+${KPIS.impactImprovement}%`,         icon: TrendingUp,    trend: KPIS.impactImprovementTrend,   delay: ".34s" },
  { title: "Active Orgs",       value: KPIS.activeOrganizations,              icon: Building2,     trend: KPIS.activeOrganizationsTrend, delay: ".40s" },
];

export default function Dashboard() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "calc(24 * var(--u))" }}>

      {/* ── Page Header ── */}
      <div style={{ animation: "riseIn .55s cubic-bezier(.16,1,.3,1) .05s both" }}>
        <p style={{
          fontSize: "calc(11.5 * var(--u))",
          fontWeight: 500,
          color: "rgba(255,255,255,0.40)",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          marginBottom: "calc(6 * var(--u))",
        }}>
          Overview
        </p>
        <h1 style={{
          fontSize: "calc(24 * var(--u))",
          fontWeight: 700,
          color: "#fff",
          letterSpacing: "-0.025em",
          lineHeight: 1.15,
          marginBottom: "calc(6 * var(--u))",
        }}>
          Disaster Training Dashboard
        </h1>
        <p style={{
          fontSize: "calc(13 * var(--u))",
          color: "rgba(255,255,255,0.50)",
          lineHeight: 1.5,
        }}>
          Tracking {KPIS.totalTrainings} trainings across {KPIS.districtsCovered} districts.
          Avg. attendance {KPIS.averageAttendance}% · Last updated {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}.
        </p>
      </div>

      {/* ── KPI Strip ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(calc(170 * var(--u)), 1fr))",
        gap: "calc(12 * var(--u))",
        animation: "riseIn .55s cubic-bezier(.16,1,.3,1) .15s both",
      }}>
        {KPI_CARDS.map((kpi) => (
          <StatCard
            key={kpi.title}
            title={kpi.title}
            value={kpi.value}
            icon={kpi.icon}
            trend={kpi.trend}
            animDelay={kpi.delay}
          />
        ))}
      </div>

      {/* ── Activity chart + Notifications ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "2fr 1fr",
        gap: "calc(12 * var(--u))",
        animation: "riseIn .55s cubic-bezier(.16,1,.3,1) .25s both",
      }}>
        <div className="glass-card">
          <TrainingActivityChart />
        </div>
        <div className="glass-card">
          <RecentNotifications />
        </div>
      </div>

      {/* ── Map + Side widgets ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "2fr 1fr",
        gap: "calc(12 * var(--u))",
        alignItems: "start",
        animation: "riseIn .55s cubic-bezier(.16,1,.3,1) .35s both",
      }}>
        <div className="glass-card">
          <DashboardMap />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "calc(12 * var(--u))" }}>
          <div className="glass-card">
            <ThematicCoverageChart />
          </div>
          <div className="glass-card">
            <DistrictWiseTrainings />
          </div>
        </div>
      </div>

      {/* ── Recent trainings ── */}
      <div className="glass-card" style={{ animation: "riseIn .55s cubic-bezier(.16,1,.3,1) .45s both" }}>
        <RecentTrainingsTable />
      </div>

      {/* ── Footer ── */}
      <footer style={{
        paddingTop: "calc(16 * var(--u))",
        paddingBottom: "calc(8 * var(--u))",
        borderTop: "1px solid rgba(255,255,255,.07)",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "calc(12 * var(--u))",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "calc(6 * var(--u))" }}>
          <span style={{ width: "calc(6 * var(--u))", height: "calc(6 * var(--u))", borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 5px #22c55e" }} />
          <span style={{ fontSize: "calc(11 * var(--u))", fontWeight: 500, color: "rgba(255,255,255,0.45)", letterSpacing: "0.05em" }}>
            System Operational
          </span>
        </div>
        <p style={{ fontSize: "calc(11 * var(--u))", color: "rgba(255,255,255,0.30)" }}>
          National Disaster Management Authority (NDMA) · India
        </p>
      </footer>
    </div>
  );
}

