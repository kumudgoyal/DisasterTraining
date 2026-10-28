export const SEVERITY_COLORS = {
  critical: {
    bg: 'bg-red-500/10 text-red-400 border-red-500/30',
    badge: 'bg-red-600 text-white',
    hex: '#ef4444',
    border: 'border-red-500',
    ring: 'ring-red-500/50',
  },
  high: {
    bg: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
    badge: 'bg-orange-600 text-white',
    hex: '#f97316',
    border: 'border-orange-500',
    ring: 'ring-orange-500/50',
  },
  moderate: {
    bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    badge: 'bg-amber-600 text-white',
    hex: '#eab308',
    border: 'border-amber-500',
    ring: 'ring-amber-500/50',
  },
  low: {
    bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    badge: 'bg-emerald-600 text-white',
    hex: '#10b981',
    border: 'border-emerald-500',
    ring: 'ring-emerald-500/50',
  },
};

export const STATUS_COLORS = {
  reported: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
  under_verification: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  verified: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  responding: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
  contained: 'bg-teal-500/10 text-teal-400 border-teal-500/30',
  resolved: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  closed: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
  available: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  deployed: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
  active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  full: 'bg-red-500/10 text-red-400 border-red-500/30',
  pending: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  assigned: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  fulfilled: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
};

export const DISASTER_ICONS = {
  Flood: '🌊',
  Earthquake: '🏚️',
  Cyclone: '🌀',
  Landslide: '⛰️',
  Fire: '🔥',
  Heatwave: '🌡️',
  Cloudburst: '⛈️',
  'Industrial Accident': '🏭',
  'Building Collapse': '🏗️',
  Epidemic: '🦠',
  'Road/Transport': '🚗',
  Other: '⚠️',
};

export const DEMO_USERS = [
  { role: 'Super Admin', email: 'admin@dmp.gov.in', password: 'admin123', name: 'Dr. Rajesh Kumar (SDMA Lead)' },
  { role: 'EOC Operator', email: 'eoc@dmp.gov.in', password: 'eoc123', name: 'Priya Sharma (State EOC)' },
  { role: 'District Admin', email: 'district@dmp.gov.in', password: 'district123', name: 'Anil Verma (DDMA Rohtak)' },
  { role: 'Field Officer', email: 'field@dmp.gov.in', password: 'field123', name: 'Vikram Singh (NDRF Battalion)' },
  { role: 'NGO Admin', email: 'ngo@relief.org', password: 'ngo123', name: 'Sanjay Gupta (Red Cross)' },
  { role: 'Volunteer', email: 'volunteer@dmp.gov.in', password: 'volunteer123', name: 'Meera Patel (Goonj Relief)' },
  { role: 'Public User', email: 'citizen@example.com', password: 'citizen123', name: 'Amit Citizen' },
];
