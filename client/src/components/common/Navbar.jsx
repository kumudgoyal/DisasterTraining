import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import api from '../../api/client';
import { DEMO_USERS } from '../../utils/constants';
import { 
  Bell, 
  ShieldAlert, 
  Radio, 
  User, 
  LogOut, 
  Users, 
  ExternalLink,
  ChevronDown,
  CheckCircle2
} from 'lucide-react';

export default function Navbar() {
  const { user, logout, login } = useAuth();
  const { connected } = useSocket();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);
  const [activeAlerts, setActiveAlerts] = useState([]);

  useEffect(() => {
    // Fetch notifications
    if (user) {
      api.get('/notifications?limit=10')
        .then(res => {
          if (res?.success && res.data) {
            const list = Array.isArray(res.data)
              ? res.data
              : Array.isArray(res.data.notifications)
              ? res.data.notifications
              : [];
            setNotifications(list);
            setUnreadCount(typeof res.data.unread_count === 'number' ? res.data.unread_count : list.filter(n => !n.is_read).length);
          }
        })
        .catch(console.error);
    }

    // Fetch active alerts for ticker
    api.get('/alerts/active')
      .then(res => {
        if (res?.success) setActiveAlerts(Array.isArray(res.data) ? res.data : []);
      })
      .catch(console.error);
  }, [user]);

  const markAllRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const handleRoleSwitch = async (demoUser) => {
    try {
      await login(demoUser.email, demoUser.password);
      setShowRoleSwitcher(false);
      navigate('/');
    } catch (err) {
      console.error('Role switch error:', err);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-cream-50/90 backdrop-blur-md border-b border-cream-200/80 transition-all">
      {/* Active Alert Ticker Banner */}
      {activeAlerts.length > 0 && (
        <div className="bg-rose-50 border-b border-rose-200/60 px-6 py-2 flex items-center justify-between text-xs text-rose-800">
          <div className="flex items-center space-x-2.5 overflow-hidden">
            <span className="flex h-2 w-2 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-rose-600 bg-rose-100/80 px-2 py-0.5 rounded-full border border-rose-200">
              URGENT
            </span>
            <span className="truncate font-medium">{activeAlerts[0]?.title} — {activeAlerts[0]?.message}</span>
          </div>
          <Link to="/alerts" className="font-semibold text-rose-700 hover:text-rose-900 underline text-[11px] whitespace-nowrap ml-4">
            View All ({activeAlerts.length})
          </Link>
        </div>
      )}

      <div className="px-6 sm:px-8 h-20 flex items-center justify-between">
        {/* Brand & Live status */}
        <div className="flex items-center space-x-5">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-2xl bg-ink-900 flex items-center justify-center text-white shadow-soft group-hover:scale-105 transition-transform">
              <ShieldAlert className="w-5 h-5 text-cream-50" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-base tracking-tight text-ink-900">DMECS</span>
                <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full bg-cream-200 text-ink-700 border border-cream-300">
                  SEOC
                </span>
              </div>
              <p className="text-[11px] text-ink-400 hidden sm:block">Real-time Emergency Coordination</p>
            </div>
          </Link>

          {/* Connection status pill */}
          <div className="hidden lg:flex items-center space-x-2 px-3 py-1 rounded-full bg-white border border-ink-100 shadow-pill text-xs font-medium">
            <span className={`w-2 h-2 rounded-full ${connected ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
            <span className="text-[11px] text-ink-700 font-mono">{connected ? 'Live Sync' : 'Connecting...'}</span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-3">
          {/* Public Portal link */}
          <Link
            to="/public"
            target="_blank"
            className="hidden md:flex items-center space-x-2 px-4 py-2 rounded-full text-xs font-semibold text-slate-800 hover:text-slate-950 bg-white hover:bg-slate-50 border border-slate-200/90 shadow-sm transition"
          >
            <span>Public Portal</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
          </Link>

          {/* Role Switcher Pill */}
          <div className="relative">
            <button
              onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
              className="flex items-center space-x-2 px-4 py-2 rounded-full text-xs font-semibold bg-white hover:bg-slate-50 text-slate-800 border border-slate-200/90 shadow-sm transition"
              title="Switch demo user"
            >
              <Users className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">Role Switcher</span>
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </button>

            {showRoleSwitcher && (
              <div className="absolute right-0 mt-3 w-72 bg-white border border-slate-200 rounded-3xl shadow-xl p-3 z-50">
                <p className="text-[10px] font-bold text-slate-400 px-3 py-1 uppercase tracking-wider font-mono">Demo User Profiles</p>
                <div className="space-y-1 mt-1">
                  {DEMO_USERS.map((demo) => {
                    const isCurrent = user?.role === demo.role;
                    return (
                      <button
                        key={demo.role}
                        onClick={() => handleRoleSwitch(demo)}
                        className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs flex items-center justify-between transition ${
                          isCurrent 
                            ? 'bg-slate-900 text-white font-bold' 
                            : 'hover:bg-slate-100 text-slate-800'
                        }`}
                      >
                        <div>
                          <p className="font-semibold">{demo.role}</p>
                          <p className={`text-[11px] ${isCurrent ? 'text-slate-300' : 'text-slate-500'}`}>{demo.name}</p>
                        </div>
                        {isCurrent && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Notifications Pill */}
          <div className="relative">
            <button
              onClick={() => setShowNotifs(!showNotifs)}
              className="relative p-2.5 rounded-full text-slate-800 hover:text-slate-950 bg-white hover:bg-slate-50 border border-slate-200/90 shadow-sm transition flex items-center justify-center"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex min-w-[18px] h-[18px] px-1 items-center justify-center rounded-full bg-rose-600 text-[10px] font-extrabold text-white border-2 border-white shadow-md">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifs && (
              <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white border border-slate-200 rounded-3xl shadow-xl z-50 overflow-hidden">
                <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono">Notifications</h4>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="text-[11px] text-blue-600 hover:text-blue-800 font-bold"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {!Array.isArray(notifications) || notifications.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-6">No notifications</p>
                  ) : (
                    (notifications || []).map((n) => (
                      <div
                        key={n.id}
                        className={`p-3.5 text-xs transition ${n.is_read ? 'opacity-60 bg-white' : 'bg-slate-50/80 font-medium'}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            n.category === 'critical' ? 'bg-rose-100 text-rose-700' :
                            n.category === 'high' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {n.category}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="mt-1 text-slate-900 font-bold">{n.title}</p>
                        <p className="mt-0.5 text-slate-600 text-[11px] line-clamp-2">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Pill & Logout */}
          <div className="flex items-center space-x-3 bg-white pl-4 pr-2.5 py-1.5 rounded-full border border-slate-200/90 shadow-sm">
            <div className="hidden sm:block text-right">
              <p className="text-xs font-bold text-slate-900 leading-tight">{user?.full_name || 'Responder'}</p>
              <p className="text-[10px] text-slate-500 font-mono font-medium">{user?.role}</p>
            </div>
            <button
              onClick={logout}
              title="Logout"
              className="p-1.5 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
