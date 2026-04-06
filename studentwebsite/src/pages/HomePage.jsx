import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAnnouncements, getStudentBadges, getLeaderboard, getMyRank, getDailyQuests, completeDailyQuest, getTournaments } from '../api/missionService';
import { getRank, getLevel } from '../utils/rankUtils';
import { showToast } from '../utils/toast';

// ─── Broadcast Feed ────────────────────────────────────────────────────────────
const BroadcastFeed = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAnnouncements()
            .then(res => setAnnouncements(res.data || []))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="glass-card border border-white/10 rounded-2xl p-5 animate-pulse">
                <div className="h-3 w-24 bg-white/10 rounded mb-4" />
                <div className="space-y-3">
                    {[1, 2].map(i => <div key={i} className="h-14 bg-white/5 rounded-xl" />)}
                </div>
            </div>
        );
    }

    return (
        <div className="glass-card border border-white/10 rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="px-5 py-4 border-b border-white/8 flex items-center gap-2.5">
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500" />
                </span>
                <p className="text-sm font-semibold text-white">Admin Broadcasts</p>
                {announcements.length > 0 && (
                    <span className="ml-auto text-xs bg-violet-500/20 text-violet-300 px-2 py-0.5 rounded-full border border-violet-500/20">
                        {announcements.length} active
                    </span>
                )}
            </div>

            {/* List */}
            {announcements.length === 0 ? (
                <div className="px-5 py-8 text-center text-white/25 text-sm">
                    No broadcasts yet. Check back soon.
                </div>
            ) : (
                <div className="divide-y divide-white/5 max-h-72 overflow-y-auto">
                    {announcements.map(a => (
                        <div key={a._id} className="px-5 py-4">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-violet-500/15 border border-violet-500/20 flex items-center justify-center shrink-0 mt-0.5">
                                    <span className="text-sm">📡</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-white text-sm mb-0.5">{a.title}</p>
                                    <p className="text-white/55 text-sm leading-relaxed">{a.message}</p>
                                    <p className="text-white/25 text-xs mt-1.5">
                                        {new Date(a.createdAt).toLocaleDateString('en-IN', {
                                            day: 'numeric', month: 'short', year: 'numeric',
                                            hour: '2-digit', minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// ─── Badges Section ───────────────────────────────────────────────────────────
const BadgesSection = ({ user }) => {
    const [badges, setBadges] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user.id) {
            getStudentBadges(user.id)
                .then(res => setBadges(res.data || []))
                .catch(() => setBadges([]))
                .finally(() => setLoading(false));
        }
    }, [user.id]);

    if (loading) {
        return (
            <div className="glass-card border border-white/10 rounded-2xl p-5 animate-pulse">
                <div className="h-3 w-16 bg-white/10 rounded mb-4" />
                <div className="flex gap-3">
                    {[1, 2, 3].map(i => <div key={i} className="w-12 h-12 bg-white/5 rounded-lg" />)}
                </div>
            </div>
        );
    }

    return (
        <div className="glass-card border border-white/10 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-semibold text-white">Your Badges</p>
                <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    {badges.length} earned
                </span>
            </div>
            {badges.length === 0 ? (
                <p className="text-white/25 text-sm">No badges yet. Complete quizzes to earn them!</p>
            ) : (
                <div className="flex gap-3 overflow-x-auto">
                    {badges.map(badge => (
                        <div key={badge._id} className="flex-shrink-0 text-center">
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500/20 to-violet-500/20 border border-emerald-500/30 flex items-center justify-center text-2xl mb-1">
                                {badge.icon}
                            </div>
                            <p className="text-xs text-white/70 font-medium">{badge.name}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// ─── Daily Quests Section ─────────────────────────────────────────────────────
const DailyQuestsSection = () => {
    const [quests, setQuests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getDailyQuests()
            .then(res => setQuests(res.data || []))
            .catch(() => setQuests([]))
            .finally(() => setLoading(false));
    }, []);

    const handleComplete = async (questId) => {
        try {
            await completeDailyQuest(questId);
            // Update local state
            setQuests(prev => prev.map(q => q._id === questId ? { ...q, isCompleted: true } : q));
            showToast.success('Quest completed! +XP earned');
        } catch (error) {
            showToast.error('Failed to complete quest');
        }
    };

    if (loading) {
        return (
            <div className="glass-card border border-white/10 rounded-2xl p-5 animate-pulse">
                <div className="h-3 w-24 bg-white/10 rounded mb-4" />
                <div className="space-y-3">
                    {[1, 2].map(i => <div key={i} className="h-8 bg-white/5 rounded-lg" />)}
                </div>
            </div>
        );
    }

    const completedCount = quests.filter(q => q.isCompleted).length;

    return (
        <div className="glass-card border border-white/10 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-semibold text-white">Daily Quests</p>
                <span className="text-xs bg-violet-500/20 text-violet-300 px-2 py-0.5 rounded-full border border-violet-500/20">
                    {completedCount}/{quests.length} completed
                </span>
            </div>
            {quests.length === 0 ? (
                <p className="text-white/25 text-sm">No quests available today.</p>
            ) : (
                <div className="space-y-3">
                    {quests.map(quest => (
                        <div key={quest._id} className="flex items-center gap-3 p-3 rounded-lg bg-white/3 border border-white/5">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${quest.isCompleted ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-white/40'}`}>
                                {quest.isCompleted ? '✓' : '○'}
                            </div>
                            <div className="flex-1">
                                <p className={`text-sm font-medium ${quest.isCompleted ? 'text-white/60 line-through' : 'text-white'}`}>
                                    {quest.description}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-emerald-400">+{quest.xpReward} XP</span>
                                {!quest.isCompleted && (
                                    <button
                                        onClick={() => handleComplete(quest._id)}
                                        className="text-xs px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 cursor-pointer"
                                    >
                                        Complete
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
const LeaderboardSection = () => {
    const [leaderboard, setLeaderboard] = useState([]);
    const [myRank, setMyRank] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            getLeaderboard(5),
            getMyRank()
        ]).then(([boardRes, rankRes]) => {
            setLeaderboard(boardRes.data || []);
            setMyRank(rankRes.data);
        }).catch(() => {
            setLeaderboard([]);
            setMyRank(null);
        }).finally(() => setLoading(false));
    }, []);


    if (loading) {
        return (
            <div className="glass-card border border-white/10 rounded-2xl p-5 animate-pulse">
                <div className="h-3 w-20 bg-white/10 rounded mb-4" />
                <div className="space-y-3">
                    {[1, 2, 3].map(i => <div key={i} className="h-12 bg-white/5 rounded-lg" />)}
                </div>
            </div>
        );
    }

    return (
        <div className="glass-card border border-white/10 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-semibold text-white">Leaderboard</p>
                {myRank && (
                    <span className="text-xs bg-violet-500/20 text-violet-300 px-2 py-0.5 rounded-full border border-violet-500/20">
                        Your rank: #{myRank.rank}
                    </span>
                )}
            </div>
            {leaderboard.length === 0 ? (
                <p className="text-white/25 text-sm">No data available.</p>
            ) : (
                <div className="space-y-2">
                    {leaderboard.map((student, index) => (
                        <div key={student._id} className="flex items-center gap-3 p-3 rounded-lg bg-white/3 border border-white/5">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500 to-violet-600 flex items-center justify-center text-xs font-bold text-white">
                                {index + 1}
                            </div>
                            <div className="flex-1 flex items-center gap-2">
                                <div>
                                    <p className="text-sm font-medium text-white">{student.name}</p>
                                    <p className="text-xs text-white/40">Class {student.class}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-bold text-emerald-400">{student.totalScore} XP</p>
                                <div className="flex gap-1 mt-1">
                                    {student.badges?.slice(0, 3).map(badge => (
                                        <span key={badge._id} className="text-xs">{badge.icon}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// ─── Main HomePage ─────────────────────────────────────────────────────────────
const HomePage = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const handleLogout = () => {
        localStorage.clear();
        window.location.replace('/login');
    };

    const QUICK_LINKS = [
        { label: 'My Missions', icon: '🎯', path: '/missions', desc: 'View lessons & take quizzes' },
        { label: 'My Profile', icon: '👤', path: '/profile', desc: 'View stats, badges & progress' },
        { label: 'Tournaments', icon: '🏆', path: '/tournaments', desc: 'Join competitive tournaments' },
        { label: 'Video Classes', icon: '📺', path: '/videos', desc: 'Watch recorded video lessons' },
    ];

    return (
        <div className="min-h-screen bg-slate-900 text-white">
            {/* Top bar */}
            <header className="border-b border-white/8 bg-slate-900/80 backdrop-blur sticky top-0 z-10">
                <div className="max-w-3xl mx-auto px-5 py-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-violet-600 flex items-center justify-center font-black text-sm text-white">S</div>
                        <span className="font-semibold text-white text-sm">SyncLearn</span>
                    </div>
                    <button onClick={handleLogout}
                        className="text-xs px-3 py-1.5 rounded-lg border border-red-500/25 text-red-400/70 hover:text-red-400 hover:border-red-500/40 cursor-pointer transition-colors">
                        Logout
                    </button>
                </div>
            </header>

            <div className="max-w-3xl mx-auto px-5 py-8 space-y-6">
                {/* Welcome */}
                <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-violet-500 bg-clip-text text-transparent">
                        Welcome back, {user.name?.split(' ')[0] || 'Student'}! 👋
                    </h1>
                    <p className="text-white/40 text-sm mt-1">Here's what's happening in your school today.</p>
                </div>

                {/* Broadcasts */}
                <BroadcastFeed />

                {/* Quick nav */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {QUICK_LINKS.map(link => (
                        <button key={link.path} onClick={() => navigate(link.path)}
                            className="group text-left p-5 rounded-2xl border border-white/8 bg-white/3 hover:bg-white/6 hover:border-white/15 cursor-pointer transition-all duration-200">
                            <div className="text-2xl mb-3">{link.icon}</div>
                            <p className="font-semibold text-white text-sm mb-0.5">{link.label}</p>
                            <p className="text-white/40 text-xs">{link.desc}</p>
                        </button>
                    ))}
                </div>

                {/* Student info */}
                <div className="glass-card border border-white/10 rounded-2xl px-5 py-4">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-white/40 text-xs mb-0.5">Logged in as</p>
                            <p className="font-medium text-sm text-white">{user.name || user.email}</p>
                            <p className="text-white/30 text-xs">{user.email} · Class {user.class}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-white/40 text-xs mb-1">Total XP</p>
                            <p className="text-2xl font-black text-emerald-400">{user.totalScore ?? 0}</p>
                            <p className="text-white/40 text-xs mt-1">💰 {user.coins ?? 0} coins</p>
                            {(() => {
                                const rank = user.rank || getRank(user.totalScore ?? 0);
                                return (
                                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border font-semibold mt-1 ${rank.bg} ${rank.color}`}>
                                        {rank.emoji} {rank.label}
                                    </span>
                                );
                            })()}
                        </div>
                    </div>

                    {/* Level Progress */}
                    <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-white/60 text-xs">Level {user.levelInfo?.level || getLevel(user.totalScore ?? 0).level}</p>
                            <p className="text-white/40 text-xs">{user.levelInfo?.xpToNext || getLevel(user.totalScore ?? 0).xpToNext} XP to next</p>
                        </div>
                        <div className="w-full rounded-full h-2 bg-white/5">
                            <div className="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-violet-500 transition-all duration-500"
                                style={{ width: `${user.levelInfo?.progressPercent || getLevel(user.totalScore ?? 0).progressPercent}%` }} />
                        </div>
                    </div>

                    {/* Streak */}
                    {user.loginStreak && (
                        <div className="flex items-center gap-2">
                            <span className="text-lg">🔥</span>
                            <p className="text-white/60 text-xs">{user.loginStreak} day streak</p>
                        </div>
                    )}
                </div>

                {/* Badges */}
                <BadgesSection user={user} />

                {/* Daily Quests */}
                <DailyQuestsSection />

                {/* Leaderboard */}
                <LeaderboardSection />
            </div>
        </div>
    );
};

export default HomePage;
