import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginTeacher, loginAdmin } from '../api/authService';
import { showToast } from '../utils/toast';

const ROLES = [
    {
        id: 'teacher',
        label: 'Teacher',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
        ),
        gradient: 'from-emerald-500 to-teal-500',
        accent: 'emerald',
        placeholder: 'teacher@school.edu',
    },
    {
        id: 'admin',
        label: 'Admin',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
        ),
        gradient: 'from-violet-500 to-purple-600',
        accent: 'violet',
        placeholder: 'admin@school.edu',
    },
];

const WebsiteLoginPage = () => {
    const navigate = useNavigate();
    const [activeRole, setActiveRole] = useState('teacher');
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const role = ROLES.find((r) => r.id === activeRole);

    const handleRoleSwitch = (id) => {
        setActiveRole(id);
        setFormData({ email: '', password: '' });
    };

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Route to the correct service method based on active role tab
            if (activeRole === 'admin') {
                await loginAdmin(formData);
            } else {
                await loginTeacher(formData);
            }

            showToast.success(`Welcome back! Signed in as ${role.label}.`);
            // Keep spinner ON during the 800ms delay for a smooth UX.
            // navigate() unmounts the component, so no need to call setLoading(false).
            setTimeout(() => navigate('/home', { replace: true }), 800);
        } catch {
            // Error toast is fired automatically by the Axios response interceptor.
            setLoading(false); // Only reset spinner on failure, not on success.
        }
    };

    const isAdmin = activeRole === 'admin';

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">

            {/* Background orbs */}
            <div
                className={`absolute top-[-10rem] left-[-10rem] w-[35rem] h-[35rem] rounded-full blur-3xl pointer-events-none transition-all duration-700 ${isAdmin ? 'bg-violet-500/10' : 'bg-emerald-500/10'
                    }`}
            />
            <div
                className={`absolute bottom-[-10rem] right-[-10rem] w-[35rem] h-[35rem] rounded-full blur-3xl pointer-events-none transition-all duration-700 ${isAdmin ? 'bg-purple-500/10' : 'bg-teal-500/10'
                    }`}
            />

            <div className="relative w-full max-w-md animate-fade-in">
                <div
                    className={`glass-card border rounded-2xl p-8 transition-all duration-500 ${isAdmin
                        ? 'border-violet-500/20 shadow-violet-glow'
                        : 'border-emerald-500/20 shadow-emerald-glow'
                        }`}
                >
                    {/* Brand */}
                    <div className="text-center mb-6">
                        <div
                            className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl border mb-3 transition-all duration-500 ${isAdmin
                                ? 'bg-violet-500/10 border-violet-500/30'
                                : 'bg-emerald-500/10 border-emerald-500/30'
                                }`}
                        >
                            <svg className={`w-7 h-7 transition-colors duration-500 ${isAdmin ? 'text-violet-400' : 'text-emerald-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                    d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-violet-500 bg-clip-text text-transparent">
                            SyncLearn
                        </h1>
                        <p className="text-white/40 text-xs mt-0.5">Management Portal</p>
                    </div>

                    {/* Role Toggle */}
                    <div className="flex bg-white/5 rounded-xl p-1 mb-6 border border-white/10">
                        {ROLES.map((r) => (
                            <button
                                key={r.id}
                                type="button"
                                onClick={() => handleRoleSwitch(r.id)}
                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium cursor-pointer transition-all duration-300 ${activeRole === r.id
                                    ? `bg-gradient-to-r ${r.gradient} text-white shadow-lg`
                                    : 'text-white/40 hover:text-white/70'
                                    }`}
                            >
                                {r.icon}
                                {r.label}
                            </button>
                        ))}
                    </div>

                    <h2 className="text-xl font-semibold text-white mb-1">
                        {isAdmin ? 'Admin Sign In' : 'Teacher Sign In'}
                    </h2>
                    <p className="text-white/50 text-sm mb-5">
                        {isAdmin
                            ? 'Access school-wide management tools'
                            : 'Access your classroom and student data'}
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Email */}
                        <div>
                            <label className="block text-sm text-white/60 mb-1.5 font-medium">Email Address</label>
                            <div className="relative">
                                <span className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-500 ${isAdmin ? 'text-violet-400/60' : 'text-emerald-400/60'}`}>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </span>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder={role.placeholder}
                                    className={`w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-white/20 focus:outline-none text-sm transition-all duration-500 ${isAdmin
                                        ? 'focus:border-violet-500/50'
                                        : 'focus:border-emerald-500/50'
                                        }`}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm text-white/60 mb-1.5 font-medium">Password</label>
                            <div className="relative">
                                <span className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-500 ${isAdmin ? 'text-violet-400/60' : 'text-emerald-400/60'}`}>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </span>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    placeholder="••••••••"
                                    className={`w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-10 text-white placeholder-white/20 focus:outline-none text-sm transition-all duration-500 ${isAdmin
                                        ? 'focus:border-violet-500/50'
                                        : 'focus:border-emerald-500/50'
                                        }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((p) => !p)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 cursor-pointer"
                                >
                                    {showPassword ? (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3 rounded-xl font-semibold text-sm text-white bg-gradient-to-r ${role.gradient} hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer mt-2 transition-all duration-500 ${isAdmin ? 'shadow-violet-glow' : 'shadow-emerald-glow'
                                }`}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Signing in…
                                </span>
                            ) : (
                                `Sign in as ${role.label}`
                            )}
                        </button>
                    </form>

                    <p className="text-center text-white/30 text-xs mt-6">
                        © 2025 SyncLearn · Management Portal
                    </p>
                </div>
            </div>
        </div>
    );
};

export default WebsiteLoginPage;
