import React, { useState, useEffect, useCallback } from 'react';
import Layout from '../components/Layout';
import { getAnnouncements, createAnnouncement, deleteAnnouncement } from '../api/missionService';
import { showToast } from '../utils/toast';

const AnnouncementsPage = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({ title: '', message: '' });
    const [creating, setCreating] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const load = useCallback(async () => {
        try {
            const res = await getAnnouncements();
            setAnnouncements(res.data || []);
        } catch { } finally { setLoading(false); }
    }, []);

    useEffect(() => { load(); }, [load]);

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!form.title.trim() || !form.message.trim()) {
            showToast.alert('Title and message are required.'); return;
        }
        setCreating(true);
        try {
            const res = await createAnnouncement(form);
            setAnnouncements(prev => [res.data, ...prev]);
            setForm({ title: '', message: '' });
            showToast.success('Announcement broadcast to all users!');
        } catch { } finally { setCreating(false); }
    };

    const handleDelete = async (id) => {
        setDeletingId(id);
        try {
            await deleteAnnouncement(id);
            setAnnouncements(prev => prev.filter(a => a._id !== id));
            showToast.success('Announcement removed.');
        } catch { } finally { setDeletingId(null); }
    };

    const formatDate = (iso) => new Date(iso).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    const inputCls = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-violet-500 transition-all";

    return (
        <Layout>
            <div className="max-w-3xl mx-auto px-6 py-10">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-white">Announcements</h1>
                    <p className="text-white/40 text-sm mt-1">Broadcast messages to all students and teachers.</p>
                </div>

                {/* Create Form */}
                <form onSubmit={handleCreate} className="glass-card border border-white/10 rounded-2xl p-6 mb-8">
                    <h2 className="text-base font-semibold text-white mb-5">New Announcement</h2>
                    <div className="space-y-3">
                        <input
                            className={inputCls}
                            placeholder="Title *"
                            value={form.title}
                            onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                            required
                        />
                        <textarea
                            className={`${inputCls} resize-none`}
                            placeholder="Message to broadcast… *"
                            rows={4}
                            value={form.message}
                            onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                            required
                        />
                    </div>
                    <button type="submit" disabled={creating}
                        className="mt-4 w-full py-3 rounded-xl font-semibold text-sm cursor-pointer disabled:opacity-50 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white transition-all">
                        {creating ? 'Broadcasting…' : 'Broadcast Announcement'}
                    </button>
                </form>

                {/* Announcement List */}
                <div className="glass-card border border-white/10 rounded-2xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-white/8 flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-white">Active Announcements</h3>
                        <span className="text-xs text-white/30">{announcements.length} total</span>
                    </div>

                    {loading ? (
                        <div className="p-8 text-center text-white/30 text-sm">Loading…</div>
                    ) : announcements.length === 0 ? (
                        <div className="p-8 text-center text-white/20 text-sm">No announcements yet.</div>
                    ) : (
                        <div className="divide-y divide-white/5">
                            {announcements.map(a => (
                                <div key={a._id} className="px-6 py-4 flex items-start justify-between gap-4 hover:bg-white/2">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-semibold text-white text-sm">{a.title}</span>
                                            <span className="text-xs text-white/25">{formatDate(a.createdAt)}</span>
                                        </div>
                                        <p className="text-white/55 text-sm">{a.message}</p>
                                        {a.adminId && (
                                            <p className="text-xs text-white/20 mt-1.5">via {a.adminId.name}</p>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => handleDelete(a._id)}
                                        disabled={deletingId === a._id}
                                        className="shrink-0 text-xs px-3 py-1.5 rounded-lg cursor-pointer border border-white/10 text-white/30 hover:text-red-400 hover:border-red-500/30 disabled:opacity-40 transition-colors">
                                        {deletingId === a._id ? '…' : 'Remove'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default AnnouncementsPage;
