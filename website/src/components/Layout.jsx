import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
    { path: '/home', label: 'Dashboard', icon: '⬡', roles: ['admin', 'teacher'] },
    { path: '/missions', label: 'Missions', icon: '🎯', roles: ['admin', 'teacher'] },
    { path: '/students', label: 'Students', icon: '🎓', roles: ['admin', 'teacher'] },
    { path: '/teachers', label: 'Teachers', icon: '👨‍🏫', roles: ['admin'] },
    { path: '/announcements', label: 'Broadcasts', icon: '📡', roles: ['admin'] },
];

const Layout = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const role = user.role || 'teacher';
    const [collapsed, setCollapsed] = useState(false);

    const visible = NAV_ITEMS.filter(item => item.roles.includes(role));
    const isAdmin = role === 'admin';

    const handleLogout = () => {
        localStorage.clear();
        window.location.replace('/login');
    };

    return (
        <div className="flex min-h-screen bg-slate-900">
            {/* Sidebar */}
            <aside
                className="flex flex-col border-r border-white/10 shrink-0 transition-all duration-300"
                style={{
                    width: collapsed ? '64px' : '220px',
                    background: 'rgba(15,23,42,0.95)',
                    backdropFilter: 'blur(12px)',
                }}>

                {/* Brand */}
                <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
                    <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center font-black text-sm bg-gradient-to-br ${isAdmin ? 'from-violet-500 to-purple-600' : 'from-emerald-500 to-teal-500'}`}>
                        <span className="text-white">S</span>
                    </div>
                    {!collapsed && (
                        <div className="min-w-0">
                            <p className="text-white font-bold text-sm truncate">SyncLearn</p>
                            <p className={`text-xs font-mono truncate capitalize ${isAdmin ? 'text-violet-400' : 'text-emerald-400'}`}>{role}</p>
                        </div>
                    )}
                </div>

                {/* Nav */}
                <nav className="flex-1 py-4 px-2 space-y-1">
                    {visible.map(item => {
                        const active = location.pathname === item.path;
                        return (
                            <button key={item.path}
                                onClick={() => navigate(item.path)}
                                title={collapsed ? item.label : ''}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium cursor-pointer transition-all duration-200"
                                style={{
                                    background: active
                                        ? (isAdmin ? 'rgba(139,92,246,0.15)' : 'rgba(52,211,153,0.1)')
                                        : 'transparent',
                                    color: active
                                        ? (isAdmin ? '#a78bfa' : '#34d399')
                                        : 'rgba(255,255,255,0.4)',
                                    borderLeft: active
                                        ? `2px solid ${isAdmin ? '#8b5cf6' : '#10b981'}`
                                        : '2px solid transparent',
                                }}>
                                <span className="text-base shrink-0">{item.icon}</span>
                                {!collapsed && <span className="truncate">{item.label}</span>}
                            </button>
                        );
                    })}
                </nav>

                {/* Bottom */}
                <div className="px-2 pb-4 space-y-1 border-t border-white/5 pt-3">
                    <button onClick={() => setCollapsed(p => !p)}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs cursor-pointer text-white/20 hover:text-white/40">
                        <span>{collapsed ? '→' : '←'}</span>
                        {!collapsed && <span>Collapse</span>}
                    </button>
                    <button onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs cursor-pointer text-red-400/60 hover:text-red-400">
                        <span>⏻</span>
                        {!collapsed && <span>Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Content */}
            <main className="flex-1 overflow-auto">
                {children}
            </main>
        </div>
    );
};

export default Layout;
