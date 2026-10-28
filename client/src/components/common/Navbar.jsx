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
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      {/* Active Alert Ticker Banner */}
      {activeAlerts.length > 0 && (
        <div className="bg-red-950/80 border-b border-red-800/40 px-4 py-1.5 flex items-center justify-between text-xs text-red-200">
          <div className="flex items-center space-x-2 overflow-hidden">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <span className="font-bold uppercase tracking-wider text-red-400">EMERGENCY ALERT:</span>
            <span className="truncate">{activeAlerts[0]?.title} — {activeAlerts[0]?.message}</span>
          </div>
          <Link to="/alerts" className="font-semibold text-red-300 hover:text-white underline text-[11px] whitespace-nowrap ml-4">
            View All ({activeAlerts.length})
          </Link>
        </div>
      )}

      <div className="px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <Link to="/" className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20 border border-blue-400/40">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-slate-100 tracking-tight text-base sm:text-lg">DMECS</span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  SEOC PLATFORM
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block">Emergency Operations Command & Coordination</p>
            </div>
          </Link>

          {/* Connection badge */}
          <div className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700/60 text-xs">
            <Radio className={`w-3.5 h-3.5 ${connected ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
            <span className="text-[11px] text-slate-300">{connected ? 'Live Sync Active' : 'Connecting...'}</span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Public portal link */}
          <Link
            to="/public"
            target="_blank"
            className="hidden md:flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 transition"
          >
            <span>Public Portal</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          {/* Quick Role Switcher Button (Demo convenience) */}
          <div className="relative">
            <button
              onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-indigo-950/60 hover:bg-indigo-900/60 text-indigo-300 border border-indigo-700/50 transition"
              title="Switch demo user"
            >
              <Users className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">Role Switcher</span>
              <ChevronDown className="w-3 h-3 text-indigo-400" />
            </button>

            {showRoleSwitcher && (
              <div className="absolute right-0 mt-2 w-72 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl p-2 z-50">
                <p className="text-xs font-semibold text-slate-400 px-3 py-1.5 uppercase tracking-wider">Demo User Roles</p>
                <div className="space-y-1">
                  {DEMO_USERS.map((demo) => {
                    const isCurrent = user?.role === demo.role;
                    return (
                      <button
                        key={demo.role}
                        onClick={() => handleRoleSwitch(demo)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition ${
                          isCurrent 
                            ? 'bg-blue-600/20 text-blue-400 border border-blue-500/40' 
                            : 'hover:bg-slate-700/60 text-slate-200'
                        }`}
                      >
                        <div>
                          <p className="font-semibold">{demo.role}</p>
                          <p className="text-[11px] text-slate-400">{demo.name}</p>
                        </div>
                        {isCurrent && <CheckCircle2 className="w-4 h-4 text-blue-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifs(!showNotifs)}
              className="relative p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/40 transition"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white shadow-lg">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifs && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden">
                <div className="px-4 py-3 bg-slate-850 border-b border-slate-700 flex items-center justify-between">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">Notifications</h4>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="text-[11px] text-blue-400 hover:text-blue-300 font-medium"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-slate-700/50">
                  {!Array.isArray(notifications) || notifications.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-6">No notifications</p>
                  ) : (
                    (notifications || []).map((n) => (
                      <div
                        key={n.id}
                        className={`p-3 text-xs transition ${n.is_read ? 'opacity-70 bg-slate-800/60' : 'bg-slate-800 font-medium'}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                            n.category === 'critical' ? 'bg-red-500/20 text-red-400' :
                            n.category === 'high' ? 'bg-orange-500/20 text-orange-400' : 'bg-blue-500/20 text-blue-400'
                          }`}>
                            {n.category}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="mt-1 text-slate-200 font-semibold">{n.title}</p>
                        <p className="mt-0.5 text-slate-300 text-[11px] line-clamp-2">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile / Logout */}
          <div className="flex items-center space-x-2 border-l border-slate-800 pl-2 sm:pl-3">
            <div className="hidden sm:block text-right">
              <p className="text-xs font-bold text-slate-200 leading-tight">{user?.full_name || 'Responder'}</p>
              <p className="text-[10px] text-blue-400">{user?.role} • {user?.organization_name || 'State SEOC'}</p>
            </div>
            <button
              onClick={logout}
              title="Logout"
              className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
