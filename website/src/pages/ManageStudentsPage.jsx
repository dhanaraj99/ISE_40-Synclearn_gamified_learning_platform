import React, { useState, useEffect, useCallback } from 'react';
import Layout from '../components/Layout';
import { addStudent, listStudents } from '../api/userService';
import { showToast } from '../utils/toast';

const EMPTY_FORM = { name: '', email: '', password: '', class: '', rollNumber: '' };

const AddStudentForm = ({ onSuccess }) => {
    const [form, setForm] = useState(EMPTY_FORM);
    const [loading, setLoading] = useState(false);
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

    const handleSubmit = async e => {
        e.preventDefault();
        const { name, email, password, class: cls, rollNumber } = form;
        if (!name || !email || !password || !cls || !rollNumber) {
            showToast.alert('All fields are required.'); return;
        }
        setLoading(true);
        try {
            await addStudent({ name, email, password, class: cls, rollNumber }, user.role);
            showToast.success(`Student "${name}" enrolled successfully!`);
            setForm(EMPTY_FORM);
            onSuccess();
        } catch { } finally { setLoading(false); }
    };

    const inputCls = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-emerald-500 focus:bg-white/8 transition-all";

    return (
        <form onSubmit={handleSubmit}
            className="glass-card border border-white/10 rounded-2xl p-6 mb-8">
            <h2 className="text-base font-semibold text-white mb-5">Enroll New Student</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input name="name" className={inputCls} placeholder="Full Name *" value={form.name} onChange={handleChange} required />
                <input name="email" className={inputCls} placeholder="Email *" value={form.email} onChange={handleChange} required type="email" />
                <input name="password" className={inputCls} placeholder="Password *" value={form.password} onChange={handleChange} required type="password" />
                <input name="rollNumber" className={inputCls} placeholder="Roll Number *" value={form.rollNumber} onChange={handleChange} required />
                <input name="class" className={`${inputCls} sm:col-span-2`}
                    placeholder="Class (e.g. 10A) *"
                    value={form.class} onChange={handleChange} required />
            </div>
            <button type="submit" disabled={loading}
                className="mt-5 w-full py-3 rounded-xl font-semibold text-sm cursor-pointer disabled:opacity-50 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white transition-all">
                {loading ? 'Enrolling…' : 'Enroll Student'}
            </button>
        </form>
    );
};

const StudentTable = ({ students, loading }) => (
    <div className="glass-card border border-white/10 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/8 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">All Students</h3>
            <span className="text-xs text-white/30">{students.length} total</span>
        </div>
        {loading ? (
            <div className="p-8 text-center text-white/30 text-sm">Loading…</div>
        ) : students.length === 0 ? (
            <div className="p-8 text-center text-white/20 text-sm">No students enrolled yet.</div>
        ) : (
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-white/8 bg-white/2 text-white/40 text-xs">
                            {['Name', 'Email', 'Class', 'Roll No.', 'Score', 'Enrolled'].map(h => (
                                <th key={h} className="text-left px-6 py-3 font-medium">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((s) => (
                            <tr key={s._id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                                <td className="px-6 py-3 font-medium text-white">{s.name}</td>
                                <td className="px-6 py-3 text-white/50">{s.email}</td>
                                <td className="px-6 py-3">
                                    <span className="px-2 py-0.5 rounded-md text-xs bg-emerald-500/15 text-emerald-300 border border-emerald-500/20">
                                        {s.class}
                                    </span>
                                </td>
                                <td className="px-6 py-3 text-white/40 font-mono text-xs">{s.rollNumber}</td>
                                <td className="px-6 py-3 font-bold text-emerald-400">{s.totalScore ?? 0}</td>
                                <td className="px-6 py-3 text-white/30 text-xs">
                                    {new Date(s.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
    </div>
);

const ManageStudentsPage = () => {
    const [students, setStudents] = useState([]);
    const [loadingList, setLoadingList] = useState(true);
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isAdmin = user.role === 'admin';

    const load = useCallback(async () => {
        setLoadingList(true);
        try {
            const res = await listStudents();
            setStudents(res.data || []);
        } catch { } finally { setLoadingList(false); }
    }, []);

    useEffect(() => { load(); }, [load]);

    return (
        <Layout>
            <div className="max-w-4xl mx-auto px-6 py-10">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-white">Manage Students</h1>
                    <p className="text-white/40 text-sm mt-1">Enroll students and view the full class roster.</p>
                </div>
                <AddStudentForm onSuccess={load} />
                <StudentTable students={students} loading={loadingList} />
            </div>
        </Layout>
    );
};

export default ManageStudentsPage;
