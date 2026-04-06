import React, { useState, useEffect, useCallback } from 'react';
import Layout from '../components/Layout';
import { addTeacher, listTeachers } from '../api/userService';
import { showToast } from '../utils/toast';

const EMPTY_FORM = { name: '', email: '', password: '', subject: '', classes: '' };

const AddTeacherForm = ({ onSuccess }) => {
    const [form, setForm] = useState(EMPTY_FORM);
    const [loading, setLoading] = useState(false);

    const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

    const handleSubmit = async e => {
        e.preventDefault();
        const { name, email, password, subject, classes } = form;
        if (!name || !email || !password || !subject || !classes) {
            showToast.alert('All fields are required.'); return;
        }
        setLoading(true);
        try {
            const classesArr = classes.split(',').map(c => c.trim()).filter(Boolean);
            await addTeacher({ name, email, password, subject, classes: classesArr });
            showToast.success(`Teacher "${name}" added successfully!`);
            setForm(EMPTY_FORM);
            onSuccess();
        } catch { } finally { setLoading(false); }
    };

    const inputCls = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-violet-500 focus:bg-white/8 transition-all";

    return (
        <form onSubmit={handleSubmit}
            className="glass-card border border-white/10 rounded-2xl p-6 mb-8">
            <h2 className="text-base font-semibold text-white mb-5">Add New Teacher</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input name="name" className={inputCls} placeholder="Full Name *" value={form.name} onChange={handleChange} required />
                <input name="email" className={inputCls} placeholder="Email *" value={form.email} onChange={handleChange} required type="email" />
                <input name="password" className={inputCls} placeholder="Password *" value={form.password} onChange={handleChange} required type="password" />
                <input name="subject" className={inputCls} placeholder="Subject (e.g. Math) *" value={form.subject} onChange={handleChange} required />
                <input name="classes" className={`${inputCls} sm:col-span-2`}
                    placeholder="Classes — comma separated (e.g. 10A, 11B) *"
                    value={form.classes} onChange={handleChange} required />
            </div>
            <button type="submit" disabled={loading}
                className="mt-5 w-full py-3 rounded-xl font-semibold text-sm cursor-pointer disabled:opacity-50 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white transition-all">
                {loading ? 'Adding teacher…' : 'Add Teacher'}
            </button>
        </form>
    );
};

const TeacherTable = ({ teachers, loading }) => (
    <div className="glass-card border border-white/10 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/8 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">All Teachers</h3>
            <span className="text-xs text-white/30">{teachers.length} total</span>
        </div>
        {loading ? (
            <div className="p-8 text-center text-white/30 text-sm">Loading…</div>
        ) : teachers.length === 0 ? (
            <div className="p-8 text-center text-white/20 text-sm">No teachers added yet.</div>
        ) : (
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-white/8 bg-white/2 text-white/40 text-xs">
                            {['Name', 'Email', 'Subject', 'Classes', 'Joined'].map(h => (
                                <th key={h} className="text-left px-6 py-3 font-medium">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {teachers.map((t, i) => (
                            <tr key={t._id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                                <td className="px-6 py-3 font-medium text-white">{t.name}</td>
                                <td className="px-6 py-3 text-white/50">{t.email}</td>
                                <td className="px-6 py-3">
                                    <span className="px-2 py-0.5 rounded-md text-xs bg-violet-500/15 text-violet-300 border border-violet-500/20">
                                        {t.subject}
                                    </span>
                                </td>
                                <td className="px-6 py-3 text-white/40 text-xs">{Array.isArray(t.classes) ? t.classes.join(', ') : t.classes}</td>
                                <td className="px-6 py-3 text-white/30 text-xs">
                                    {new Date(t.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
    </div>
);

const ManageTeachersPage = () => {
    const [teachers, setTeachers] = useState([]);
    const [loadingList, setLoadingList] = useState(true);

    const load = useCallback(async () => {
        setLoadingList(true);
        try {
            const res = await listTeachers();
            setTeachers(res.data || []);
        } catch { } finally { setLoadingList(false); }
    }, []);

    useEffect(() => { load(); }, [load]);

    return (
        <Layout>
            <div className="max-w-4xl mx-auto px-6 py-10">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-white">Manage Teachers</h1>
                    <p className="text-white/40 text-sm mt-1">Add faculty accounts and view the full teacher roster.</p>
                </div>
                <AddTeacherForm onSuccess={load} />
                <TeacherTable teachers={teachers} loading={loadingList} />
            </div>
        </Layout>
    );
};

export default ManageTeachersPage;
