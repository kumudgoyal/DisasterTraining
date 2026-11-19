import React from 'react';
import { Link } from 'react-router-dom';
import {
  Award,
  Users,
  Target,
  CheckCircle2,
  MapPin,
  BarChart3,
  ShieldCheck,
  FileText,
  Radio,
  ExternalLink,
  Code,
  Sparkles,
  Smartphone,
  Globe,
  Database,
  Layers,
  ArrowRight
} from 'lucide-react';

export default function ProjectObjectivePage() {
  const teamMembers = [
    {
      name: 'Kumud Goyal',
      rollNo: '23BDA70133',
      role: 'Lead Full-Stack Architect & System Coordinator',
      badge: 'Architecture & Full-Stack',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      initials: 'KG',
      contributions: [
        'End-to-end full-stack platform architecture and data model design',
        'Real-time multi-agency data pipelines for SDMAs, ATIs, and NGOs',
        'Vercel static hosting and Render backend deployment pipelines',
        'Component modularity, API client resiliency, and error boundaries'
      ],
      email: 'kumudgoyal@users.noreply.github.com'
    },
    {
      name: 'Hardik Manchanda',
      rollNo: '23BIS70002',
      role: 'GIS Systems, Real-Time Synchronization & EOC Analytics',
      badge: 'GIS & Real-Time Engine',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      initials: 'HM',
      contributions: [
        'Interactive Leaflet GIS map with multi-layer disaster and training spread',
        'Dynamic data visualizers for thematic coverage, drills, and impact tracking',
        'Socket.IO live operational event feed and simulated client event bus',
        'Official State SITREP executive report generator and CSV export tools'
      ],
      email: 'hardikmanchanda2007@gmail.com'
    },
    {
      name: 'Nitin Verma',
      rollNo: '23IBD70002',
      role: 'Mobile Interface, UI/UX & Responsive Engineering',
      badge: 'UI/UX & Mobile Interface',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
      initials: 'NV',
      contributions: [
        'Clean, enterprise design system with Apple SF Pro typography and cream palette',
        'Mobile-optimized field data entry portal with GPS and offline localStorage cache',
        'Responsive layout engineering across desktop, tablet, and smartphone screens',
        'Tactical KPI cards and real-time incident verification workflow'
      ],
      email: '23ibd70002@cuchd.in'
    },
    {
      name: 'Sahil Kumar',
      rollNo: '23BIS70067',
      role: 'RBAC Security, Systems Integration & Audit Engine',
      badge: 'RBAC & NDMA Integration',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      initials: 'SK',
      contributions: [
        '8-tier Role-Based Access Control matrix (Super Admin to Community Volunteer)',
        'Immutable security audit trail logging transactions, IPs, and timestamps',
        'NDMA & State-level integration schemas and OpenAPI standard readiness',
        'In-browser mock engine parity for offline and static serverless execution'
      ],
      email: 'sahilkumar@sahil7274.local'
    }
  ];

  const objectivesMapping = [
    {
      number: '01',
      title: 'Real-Time Data Entry & Multi-Agency Access',
      mandate: 'Enables real-time data entry and access for SDMAs, ATIs, and NGOs etc.',
      icon: Smartphone,
      accent: 'text-blue-600 bg-blue-50 border-blue-200',
      status: 'Fully Operational',
      features: [
        'Preparedness Drills logging console for State & District authorities',
        'Mobile-first Field Reporting tool with automated GPS coordinates capture',
        'Offline caching queue: logs reports locally when connectivity drops',
        'Agencies Coordination Hub connecting NDRF battalions, SDMAs, and NGOs'
      ],
      link: '/field-report',
      linkText: 'Explore Field Data Entry'
    },
    {
      number: '02',
      title: 'GIS Mapping & Training Spread Visualization',
      mandate: 'Integrates GIS mapping to visualize the spread of trainings.',
      icon: MapPin,
      accent: 'text-indigo-600 bg-indigo-50 border-indigo-200',
      status: 'Fully Operational',
      features: [
        'High-precision Leaflet GIS map with OpenStreetMap & CartoDB tiles',
        'Geospatial training footprints showing mock drills and attendee reach',
        'Multi-layer toggles for incidents, safe shelters, and emergency assets',
        'Automated spatial radius rendering for disaster alert broadcast zones'
      ],
      link: '/map',
      linkText: 'Launch Live GIS Map'
    },
    {
      number: '03',
      title: 'Analytics Dashboards, Thematic Coverage & Alerts',
      mandate: 'Offers analytics dashboards for impact tracking, thematic coverage, and alerts.',
      icon: BarChart3,
      accent: 'text-amber-600 bg-amber-50 border-amber-200',
      status: 'Fully Operational',
      features: [
        'Thematic coverage tracking: Flood, Fire, Earthquake, and Cyclone drills',
        'Impact metrics: Trained personnel, district reach, and community participation',
        'Interactive Recharts charts: Incident frequencies, severity, and economic damage',
        'Emergency broadcast console with broadcast radius in kilometers'
      ],
      link: '/analytics',
      linkText: 'View Analytics Dashboard'
    },
    {
      number: '04',
      title: 'Report Generation, Access Control & Notifications',
      mandate: 'Includes report generation, user access control, and notifications.',
      icon: FileText,
      accent: 'text-purple-600 bg-purple-50 border-purple-200',
      status: 'Fully Operational',
      features: [
        'One-click State Emergency SITREP generator formatted for executive print',
        'Instant CSV export across agencies, training programs, and damage records',
        '8-tier Role-Based Access Control (Admin, Operator, District, Field, NGO, Citizen)',
        'Real-time notifications tray with instant critical broadcast alerts'
      ],
      link: '/training',
      linkText: 'Inspect Preparedness Drills'
    },
    {
      number: '05',
      title: 'NDMA & State-Level System Integration',
      mandate: 'Can be integrated with existing NDMA and state-level systems.',
      icon: Globe,
      accent: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      status: 'Fully Operational',
      features: [
        'Standardized JSON REST API endpoints mirroring NDMA disaster classification',
        'Modular architecture facilitating single sign-on (SSO) with State portals',
        'Immutable audit logs storing user ID, action, timestamp, and IP addresses',
        'Dual deployment model: Cloud API backend + In-browser mock engine parity'
      ],
      link: '/organizations',
      linkText: 'Review Agencies Directory'
    }
  ];

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center space-x-2.5">
            <span className="p-2.5 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100">
              <Award className="w-5 h-5" />
            </span>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Project Charter & Team Dossier
              </h1>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 font-mono">
                FINAL YEAR PROJECT
              </span>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            Real-Time Monitoring System for Disaster Management Trainings & Emergency Operations Coordination.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <Link
            to="/"
            className="px-4 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition"
          >
            ← Back to Console
          </Link>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition flex items-center space-x-1.5"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Print Project Charter</span>
          </button>
        </div>
      </div>

      {/* Official Project Objective Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-blue-400" />
            <span className="text-xs font-mono uppercase font-bold tracking-widest text-blue-300">
              Official Project Mandate
            </span>
          </div>
          <span className="text-[11px] font-semibold text-emerald-400 flex items-center space-x-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>100% Objectives Achieved</span>
          </span>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight leading-snug">
            Intermediate Project Objective
          </h2>
          <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
            Develop a robust, user-friendly digital platform (web-based + mobile interface) that:
            <ul className="mt-3 space-y-2 pl-2">
              <li className="flex items-start space-x-2">
                <span className="text-blue-400 font-bold">•</span>
                <span><strong>Enables real-time data entry and access</strong> for SDMAs, ATIs, and NGOs etc.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-indigo-400 font-bold">•</span>
                <span><strong>Integrates GIS mapping</strong> to visualize the spread of trainings.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-amber-400 font-bold">•</span>
                <span><strong>Offers analytics dashboards</strong> for impact tracking, thematic coverage, and alerts.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-purple-400 font-bold">•</span>
                <span><strong>Includes report generation</strong>, user access control, and notifications.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span><strong>Can be integrated</strong> with existing NDMA and state-level systems.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Team Members Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <Users className="w-5 h-5 text-slate-700" />
            <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
              Project Engineering Team
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-mono">4 Core Contributors</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {teamMembers.map((member) => (
            <div
              key={member.name}
              className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm hover:shadow-md transition space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3.5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white font-extrabold flex items-center justify-center font-mono text-base shadow-sm">
                      {member.initials}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-base text-slate-900">{member.name}</h3>
                      <p className="text-xs text-slate-500 font-mono font-medium">
                        Roll No: <strong>{member.rollNo}</strong>
                      </p>
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-xl text-[10px] font-bold border ${member.badgeColor}`}
                  >
                    {member.badge}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono block mb-1">
                    Designation & Role
                  </span>
                  <p className="text-xs font-semibold text-slate-800">{member.role}</p>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono block mb-2">
                    Key Architectural Contributions
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    {member.contributions.map((c, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>Verified Contributor</span>
                <span className="text-slate-600">{member.email}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Deliverables Mapping Matrix (The 5 Core Objectives) */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2.5">
          <Layers className="w-5 h-5 text-slate-700" />
          <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
            Objective-to-Implementation Architecture Matrix
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {objectivesMapping.map((obj) => {
            const Icon = obj.icon;
            return (
              <div
                key={obj.number}
                className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-black text-slate-400">
                      OBJECTIVE {obj.number}
                    </span>
                    <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{obj.status}</span>
                    </span>
                  </div>

                  <div className="flex items-start space-x-3">
                    <span className={`p-2.5 rounded-2xl border ${obj.accent} shrink-0`}>
                      <Icon className="w-4 h-4" />
                    </span>
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-900 leading-snug">
                        {obj.title}
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-1 italic">
                        "{obj.mandate}"
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono block">
                      Delivered Capabilities
                    </span>
                    <ul className="space-y-1 text-xs text-slate-600">
                      {obj.features.map((f, i) => (
                        <li key={i} className="flex items-start space-x-1.5">
                          <span className="text-blue-500 font-bold">•</span>
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <Link
                    to={obj.link}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center justify-between group"
                  >
                    <span>{obj.linkText}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
