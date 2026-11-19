import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { SeverityBadge } from '../components/common/Badge';
import {
  ShieldAlert,
  PhoneCall,
  AlertTriangle,
  Home,
  MapPin,
  LifeBuoy,
  FileEdit,
  ArrowRight,
  HeartHandshake,
  CheckCircle2,
  Target,
  Users,
  Award
} from 'lucide-react';
import LiveGpsMapWidget from '../components/map/LiveGpsMapWidget';

export default function PublicPage() {
  const [alerts, setAlerts] = useState([]);
  const [shelters, setShelters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/alerts/active').catch(() => ({ success: false })),
      api.get('/shelters?status=active').catch(() => ({ success: false })),
    ])
      .then(([alertRes, shelterRes]) => {
        if (alertRes?.success) setAlerts(Array.isArray(alertRes.data) ? alertRes.data : []);
        if (shelterRes?.success) setShelters(Array.isArray(shelterRes.data) ? shelterRes.data : []);
      })
      .catch((err) => {
        console.error('Failed to fetch public alerts/shelters:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-red-950/70 via-slate-900 to-slate-950 border border-red-500/30 p-6 sm:p-10 shadow-2xl">
        <div className="max-w-2xl space-y-4">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-red-600/20 text-red-400 border border-red-500/40">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span>State Emergency Public Portal</span>
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Disaster Safety, Public Alerts & Emergency Shelter Network
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Real-time verified information on flood warnings, safe relief camps, road closures, and medical assistance for citizens.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              to="/public/report"
              className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-xl shadow-red-600/30 flex items-center space-x-2 transition"
            >
              <LifeBuoy className="w-4 h-4" />
              <span>Report Emergency / Request Rescue</span>
            </Link>

            <a
              href="tel:112"
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs flex items-center space-x-2 transition"
            >
              <PhoneCall className="w-4 h-4 text-emerald-400" />
              <span>Dial 112 (National Disaster Line)</span>
            </a>
          </div>
        </div>
      </div>

      {/* Emergency Helplines Fast Access Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl text-center">
          <p className="text-[10px] text-slate-400 uppercase font-bold">State Disaster Helpline</p>
          <p className="text-lg font-bold text-red-400 mt-1">1070</p>
          <p className="text-[10px] text-slate-500">24x7 Toll Free</p>
        </div>
        <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl text-center">
          <p className="text-[10px] text-slate-400 uppercase font-bold">District Emergency Line</p>
          <p className="text-lg font-bold text-orange-400 mt-1">1077</p>
          <p className="text-[10px] text-slate-500">Collectorate Control</p>
        </div>
        <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl text-center">
          <p className="text-[10px] text-slate-400 uppercase font-bold">Ambulance Service</p>
          <p className="text-lg font-bold text-emerald-400 mt-1">108</p>
          <p className="text-[10px] text-slate-500">Medical Transport</p>
        </div>
        <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl text-center">
          <p className="text-[10px] text-slate-400 uppercase font-bold">Fire & Rescue</p>
          <p className="text-lg font-bold text-blue-400 mt-1">101</p>
          <p className="text-[10px] text-slate-500">Fire Response</p>
        </div>
      </div>

      {/* Active Public Warnings */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          <h2 className="text-lg font-bold text-white">Active High-Priority Warnings</h2>
        </div>

        {loading ? (
          <p className="text-xs text-slate-400 py-4">Checking live alerts...</p>
        ) : !Array.isArray(alerts) || alerts.length === 0 ? (
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
            No active red or orange disaster warnings issued for the general public right now.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(alerts || []).map((al) => (
              <div key={al.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-red-400 font-mono">
                    {al.alert_type?.replace('_', ' ')}
                  </span>
                  <SeverityBadge severity={al.severity} />
                </div>
                <h3 className="font-bold text-sm text-white">{al.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{al.message}</p>
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Target Area: <strong className="text-slate-200">{al.affected_area}</strong></span>
                  <span>Authority: {al.issuing_authority}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Live Operations & Safe Haven GPS Map */}
      <div className="space-y-4">
        <LiveGpsMapWidget className="h-96" />
      </div>

      {/* Safe Relief Shelters Locator */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Home className="w-5 h-5 text-emerald-400" />
          <h2 className="text-lg font-bold text-white">Emergency Relief Shelters Open to Citizens</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(Array.isArray(shelters) ? shelters : []).slice(0, 6).map((s) => (
            <div key={s.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shadow-lg">
              <div>
                <h3 className="font-bold text-sm text-slate-100">{s.name}</h3>
                <p className="text-xs text-slate-400 flex items-center space-x-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span>{s.location_name || s.district}</span>
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-850 border border-slate-800 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Available Beds:</span>
                  <span className="font-bold text-emerald-400">{s.available_capacity} / {s.capacity}</span>
                </div>
                <div className="flex items-center space-x-3 text-[10px] text-slate-400 pt-1 border-t border-slate-800">
                  <span>Food Kitchen: {s.food_available ? '✅' : '❌'}</span>
                  <span>Water: {s.water_available ? '✅' : '❌'}</span>
                  <span>Medic: {s.medical_facility ? '✅' : '❌'}</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-400">
                Contact: <strong className="text-slate-300">{s.contact_person}</strong> ({s.contact_phone})
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Institutional Project Objective & Engineering Team Charter */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-blue-400" />
              <span className="text-xs font-mono uppercase font-bold tracking-widest text-blue-300">
                Project Accreditation
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-white">
              Intermediate Project Objective & Engineering Deliverables
            </h2>
          </div>
          <Link
            to="/public/project-info"
            className="px-4 py-2 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center space-x-1.5 transition self-start sm:self-auto"
          >
            <span>Read Full Charter</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
          <p className="font-bold text-white mb-2">
            Develop a robust, user-friendly digital platform (web-based + mobile interface) that:
          </p>
          <ul className="space-y-1.5 pl-2 text-slate-300">
            <li>• <strong>Enables real-time data entry and access</strong> for SDMAs, ATIs, and NGOs etc.</li>
            <li>• <strong>Integrates GIS mapping</strong> to visualize the spread of trainings.</li>
            <li>• <strong>Offers analytics dashboards</strong> for impact tracking, thematic coverage, and alerts.</li>
            <li>• <strong>Includes report generation</strong>, user access control, and notifications.</li>
            <li>• <strong>Can be integrated</strong> with existing NDMA and state-level systems.</li>
          </ul>
        </div>

        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono block mb-3">
            Core Project Engineering Team
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
              <span className="font-extrabold text-white text-sm block">Kumud Goyal</span>
              <span className="text-[11px] text-blue-400 font-mono font-semibold block">Roll: 23BDA70133</span>
              <p className="text-[10px] text-slate-400">Lead Full-Stack Architect</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
              <span className="font-extrabold text-white text-sm block">Hardik Manchanda</span>
              <span className="text-[11px] text-indigo-400 font-mono font-semibold block">Roll: 23BIS70002</span>
              <p className="text-[10px] text-slate-400">GIS & Real-Time Engine</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
              <span className="font-extrabold text-white text-sm block">Nitin Verma</span>
              <span className="text-[11px] text-purple-400 font-mono font-semibold block">Roll: 23IBD70002</span>
              <p className="text-[10px] text-slate-400">UI/UX & Mobile Interface</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
              <span className="font-extrabold text-white text-sm block">Sahil Kumar</span>
              <span className="text-[11px] text-emerald-400 font-mono font-semibold block">Roll: 23BIS70067</span>
              <p className="text-[10px] text-slate-400">RBAC & NDMA Systems</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
