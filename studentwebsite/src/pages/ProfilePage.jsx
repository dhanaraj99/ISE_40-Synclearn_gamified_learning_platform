import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStudentBadges, getMyRank, updateAvatar } from '../api/missionService';
import { getRank, getLevel } from '../utils/rankUtils';
import { showToast } from '../utils/toast';

// ─── ProfilePage ─────────────────────────────────────────────────────────────
const ProfilePage = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [badges, setBadges] = useState([]);
    const [myRank, setMyRank] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editingAvatar, setEditingAvatar] = useState(false);
    const [selectedAvatar, setSelectedAvatar] = useState(user.avatar || user.name?.charAt(0)?.toUpperCase() || '🧑');

    useEffect(() => {
        if (user.id) {
            Promise.all([
                getStudentBadges(user.id),
                getMyRank()
            ]).then(([badgeRes, rankRes]) => {
                setBadges(badgeRes.data || []);
                setMyRank(rankRes.data);
            }).catch(() => {
                setBadges([]);
                setMyRank(null);
            }).finally(() => setLoading(false));
        }
    }, [user.id]);

    const levelInfo = user.levelInfo || getLevel(user.totalScore ?? 0);
    const rank = user.rank || getRank(user.totalScore ?? 0);

    const AVATAR_OPTIONS = ['🧑','🧑‍🎓','🧙','🧝‍♀️','🤖','🐱','🐶','🦄','👾','👻'];

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
                <div className="animate-spin w-8 h-8 text-emerald-400"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900 text-white">
            {/* Top bar */}
            <header className="border-b border-white/8 bg-slate-900/80 backdrop-blur sticky top-0 z-10">
                <div className="max-w-3xl mx-auto px-5 py-3.5 flex items-center justify-between">
                    <button onClick={() => navigate(-1)} className="text-white/60 hover:text-white cursor-pointer text-lg">←</button>
                    <span className="font-semibold text-white text-sm">My Profile</span>
                    <div></div>
                </div>
            </header>

            <div className="max-w-3xl mx-auto px-5 py-8 space-y-6">
                {/* Profile Header */}
                <div className="glass-card border border-white/10 rounded-2xl p-6 text-center">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-violet-600 flex items-center justify-center text-3xl font-bold text-white mx-auto mb-4 cursor-pointer" onClick={() => setEditingAvatar(true)}>
                        {user.avatar || user.name?.charAt(0)?.toUpperCase() || 'S'}
                    </div>
                    <h1 className="text-xl font-bold text-white mb-1">{user.name}</h1>
                    <p className="text-white/40 text-sm mb-4">{user.email} · Class {user.class}</p>

                    {/* Rank Badge */}
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border font-semibold ${rank.bg} ${rank.color}`}>
                        {rank.emoji} {rank.label}
                    </div>
                </div>

                {/* Avatar Editor */}
                {editingAvatar && (
                    <div className="glass-card border border-white/10 rounded-2xl p-5">
                        <p className="text-white/60 text-sm mb-3">Choose your avatar</p>
                        <div className="flex flex-wrap gap-3">
                            {AVATAR_OPTIONS.map(av => (
                                <button key={av}
                                    onClick={() => setSelectedAvatar(av)}
                                    className={`w-12 h-12 flex items-center justify-center text-2xl rounded-lg text-white ${selectedAvatar===av? 'border-2 border-emerald-400' : 'border border-white/20'} cursor-pointer`}
                                >{av}</button>
                            ))}
                        </div>
                        <div className="mt-4 text-right">
                            <button onClick={() => setEditingAvatar(false)} className="px-4 py-2 text-sm text-white/60 hover:text-white">Cancel</button>
                            <button onClick={async () => {
                                try {
                                    const res = await updateAvatar(selectedAvatar);
                                    showToast.success('Avatar updated');
                                    const updated = { ...user, avatar: selectedAvatar };
                                    localStorage.setItem('user', JSON.stringify(updated));
                                    window.location.reload(); // simple refresh to show change
                                } catch (err) {
                                    showToast.error('Failed to update avatar');
                                }
                            }} className="ml-2 px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-sm rounded-lg hover:bg-emerald-500/30">Save</button>
                        </div>
                    </div>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="glass-card border border-white/10 rounded-2xl p-5 text-center">
                        <p className="text-3xl font-black text-emerald-400 mb-1">{user.totalScore ?? 0}</p>
                        <p className="text-white/40 text-xs">Total XP</p>
                    </div>
                    <div className="glass-card border border-white/10 rounded-2xl p-5 text-center">
                        <p className="text-3xl font-black text-violet-400 mb-1">{user.loginStreak ?? 0}</p>
                        <p className="text-white/40 text-xs">Day Streak</p>
                    </div>
                    <div className="glass-card border border-white/10 rounded-2xl p-5 text-center">
                        <p className="text-3xl font-black text-blue-400 mb-1">{levelInfo.level}</p>
                        <p className="text-white/40 text-xs">Level</p>
                    </div>
                    <div className="glass-card border border-white/10 rounded-2xl p-5 text-center">
                        <p className="text-3xl font-black text-yellow-400 mb-1">{myRank?.rank || '?'}</p>
                        <p className="text-white/40 text-xs">Global Rank</p>
                    </div>
                </div>

                {/* Level Progress */}
                <div className="glass-card border border-white/10 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-white/60 text-sm font-medium">Level Progress</p>
                        <p className="text-white/40 text-xs">Level {levelInfo.level}</p>
                    </div>
                    <div className="w-full rounded-full h-3 bg-white/5 mb-2">
                        <div className="h-3 rounded-full bg-gradient-to-r from-emerald-500 to-violet-500 transition-all duration-500"
                            style={{ width: `${levelInfo.progressPercent}%` }} />
                    </div>
                    <p className="text-white/40 text-xs">{levelInfo.xpToNext} XP to next level</p>
                </div>

                {/* Badges */}
                <div className="glass-card border border-white/10 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-white/60 text-sm font-medium">Achievements</p>
                        <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/20">
                            {badges.length} earned
                        </span>
                    </div>
                    {badges.length === 0 ? (
                        <p className="text-white/25 text-sm text-center py-8">No badges yet. Complete quizzes to earn them!</p>
                    ) : (
                        <div className="grid grid-cols-3 gap-4">
                            {badges.map(badge => (
                                <div key={badge._id} className="text-center p-4 rounded-lg bg-white/3 border border-white/5">
                                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500/20 to-violet-500/20 border border-emerald-500/30 flex items-center justify-center text-2xl mb-2 mx-auto">
                                        {badge.icon}
                                    </div>
                                    <p className="text-xs text-white/70 font-medium">{badge.name}</p>
                                    <p className="text-xs text-white/40 mt-1">{badge.description}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;