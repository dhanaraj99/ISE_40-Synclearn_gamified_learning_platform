import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

const ADMIN_QUICK_LINKS = [
    { label: 'Mission Control', icon: '🎯', path: '/missions', desc: 'Deploy lessons & quizzes', color: 'from-emerald-500 to-teal-500' },
    { label: 'Teachers', icon: '👨‍🏫', path: '/teachers', desc: 'Recruit & manage faculty', color: 'from-violet-500 to-purple-600' },
    { label: 'Students', icon: '🎓', path: '/students', desc: 'Enroll student recruits', color: 'from-blue-500 to-indigo-600' },
    { label: 'Broadcasts', icon: '📡', path: '/announcements', desc: 'Push global announcements', color: 'from-pink-500 to-rose-600' },
];

const TEACHER_QUICK_LINKS = [
    { label: 'Mission Control', icon: '🎯', path: '/missions', desc: 'Deploy lessons & quizzes', color: 'from-emerald-500 to-teal-500' },
    { label: 'Students', icon: '🎓', path: '/students', desc: 'Add students to your class', color: 'from-blue-500 to-indigo-600' },
];

const HomePage = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isAdmin = user.role === 'admin';
    const links = isAdmin ? ADMIN_QUICK_LINKS : TEACHER_QUICK_LINKS;

    return (
        <Layout>
            <div className="max-w-4xl mx-auto px-6 py-10">
                {/* Welcome */}
                <div className="mb-10">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-violet-500 bg-clip-text text-transparent">
                        {isAdmin ? 'Admin Dashboard' : 'Teacher Dashboard'}
                    </h1>
                    <p className="text-white/40 text-sm mt-1">
                        Welcome back, <span className={`font-medium ${isAdmin ? 'text-violet-400' : 'text-emerald-400'}`}>{user.name || user.email}</span>!
                    </p>
                </div>

                {/* Quick-launch grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {links.map(link => (
                        <button key={link.path} onClick={() => navigate(link.path)}
                            className="group text-left p-6 rounded-2xl border border-white/8 bg-white/3 hover:bg-white/6 hover:border-white/15 cursor-pointer transition-all duration-200">
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${link.color} flex items-center justify-center text-xl mb-4`}>
                                {link.icon}
                            </div>
                            <p className="font-semibold text-white text-base mb-0.5">{link.label}</p>
                            <p className="text-white/40 text-sm">{link.desc}</p>
                        </button>
                    ))}
                </div>
            </div>
        </Layout>
    );
};

export default HomePage;
