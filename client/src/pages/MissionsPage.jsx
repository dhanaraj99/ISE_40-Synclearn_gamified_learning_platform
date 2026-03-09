import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { getAllLessons, getQuizForLesson, submitQuiz, getAnnouncements } from '../api/missionService';
import { showToast } from '../utils/toast';
import { useMissionLock } from '../../../shared/hooks/useMissionLock';
import QuizDuelView from '../components/QuizDuelView';

// ─── Helpers ───────────────────────────────────────────────────────────────────
const fireConfetti = () => {
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 }, colors: ['#8b5cf6', '#10b981', '#f59e0b', '#fff'] });
    setTimeout(() =>
        confetti({ particleCount: 60, spread: 120, origin: { y: 0.5 }, colors: ['#8b5cf6', '#10b981'] }), 300);
};

// ─── Quiz Modal ────────────────────────────────────────────────────────────────
const QuizModal = ({ lesson, onClose, onQuestComplete }) => {
    const [quiz, setQuiz] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState(null);   // { score, total, bonusXP, isFirstCompletion, rank }

    useEffect(() => {
        getQuizForLesson(lesson._id)
            .then(res => {
                setQuiz(res.data);
                setAnswers(new Array(res.data.questions.length).fill(null));
            })
            .catch(() => { showToast.error('Could not load quiz.'); onClose(); })
            .finally(() => setLoading(false));
    }, [lesson._id, onClose]);

    const handleSelect = (qi, oi) =>
        setAnswers(prev => { const n = [...prev]; n[qi] = oi; return n; });

    const handleSubmit = async () => {
        if (answers.some(a => a === null)) {
            showToast.alert('Answer all questions before submitting.'); return;
        }
        setSubmitting(true);
        try {
            const res = await submitQuiz(quiz._id, answers);
            setResult(res.data);
            if (res.data.isPassed) showToast.success(`Score: ${res.data.score}/${res.data.total} — Quest complete!`);
            else showToast.error(`Score: ${res.data.score}/${res.data.total} — Try again!`);
        } catch { } finally { setSubmitting(false); }
    };

    const handleClaim = () => {

        fireConfetti();
        // Sync completedLessons & totalScore from the submit response directly into localStorage
        if (result?.completedLessons) {
            try {
                const stored = JSON.parse(localStorage.getItem('user') || '{}');
                const updated = {
                    ...stored,
                    completedLessons: result.completedLessons,
                    totalScore: result.totalScore,
                    rank: result.rank,
                    badges: result.awardedBadges ? [...(stored.badges || []), ...result.awardedBadges] : stored.badges,
                };
                localStorage.setItem('user', JSON.stringify(updated));
            } catch { }
        }
        onQuestComplete();
    };

    const OPTS = ['A', 'B', 'C', 'D'];
    const passed = result && result.isPassed;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(3,7,18,0.92)', backdropFilter: 'blur(8px)' }}>
            <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-slate-900 shadow-2xl">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/8">
                    <div>
                        <p className="text-xs text-emerald-400 mb-0.5">Quiz · {lesson.category}</p>
                        <h2 className="text-lg font-bold text-white">{lesson.title}</h2>
                    </div>
                    <button onClick={onClose} className="text-white/30 hover:text-white/70 cursor-pointer text-xl ml-4">✕</button>
                </div>

                <div className="p-6">
                    {result ? (
                        /* ── Result Screen ── */
                        <div className="text-center py-8">
                            {/* Score */}
                            <div className={`text-6xl font-black bg-gradient-to-r ${passed ? 'from-emerald-400 to-violet-500' : 'from-red-400 to-orange-500'} bg-clip-text text-transparent mb-2`}>
                                {result.score}/{result.total}
                            </div>
                            <p className="text-white/50 text-sm mb-5">Assessment complete</p>

                            {/* Progress bar */}
                            <div className="w-full rounded-full h-2.5 bg-white/5 mb-5">
                                <div className={`h-2.5 rounded-full transition-all duration-1000 bg-gradient-to-r ${passed ? 'from-emerald-500 to-violet-500' : 'from-red-500 to-orange-500'}`}
                                    style={{ width: `${(result.score / result.total) * 100}%` }} />
                            </div>

                            {/* Bonus XP banner — only on first completion */}
                            {result.isFirstCompletion && (
                                <div className="mb-5 inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-yellow-500/30 bg-yellow-500/10 text-yellow-300 text-sm font-semibold">
                                    🎯 +{result.bonusXP} Bonus XP — First Completion!
                                </div>
                            )}

                            {/* Result message */}
                            <p className="text-sm text-white/40 mb-8">
                                {result.score === result.total ? '🏆 Perfect! Outstanding work.' :
                                    passed ? '✅ Well done! Mission accomplished.' : '📚 Keep studying. You can do better!'}
                            </p>

                            {/* Rank display after submission */}
                            {result.rank && (
                                <p className="text-xs text-white/30 mb-6">
                                    Current Rank: <span className="font-semibold text-white/60">{result.rank.emoji} {result.rank.label}</span>
                                    {' · '}{result.totalScore} XP
                                </p>
                            )}

                            {/* Awarded Badges */}
                            {result.awardedBadges && result.awardedBadges.length > 0 && (
                                <div className="mb-6">
                                    <p className="text-sm text-emerald-400 mb-3">🎉 New Badges Earned!</p>
                                    <div className="flex gap-3 justify-center">
                                        {result.awardedBadges.map(badge => (
                                            <div key={badge._id} className="text-center">
                                                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500/20 to-violet-500/20 border border-emerald-500/30 flex items-center justify-center text-2xl mb-1">
                                                    {badge.icon}
                                                </div>
                                                <p className="text-xs text-white/70 font-medium">{badge.name}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Completed Daily Quests */}
                            {result.completedQuests && result.completedQuests.length > 0 && (
                                <div className="mb-6">
                                    <p className="text-sm text-violet-400 mb-3">🎯 Daily Quests Completed!</p>
                                    <div className="flex gap-3 justify-center">
                                        {result.completedQuests.map(quest => (
                                            <div key={quest.quest._id} className="text-center">
                                                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-violet-500/20 to-blue-500/20 border border-violet-500/30 flex items-center justify-center text-2xl mb-1">
                                                    ✓
                                                </div>
                                                <p className="text-xs text-white/70 font-medium">{quest.quest.description}</p>
                                                <p className="text-xs text-emerald-400">+{quest.xpReward} XP</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* CTA buttons */}
                            {passed ? (
                                <button onClick={handleClaim}
                                    className="px-8 py-3 rounded-xl font-semibold cursor-pointer bg-gradient-to-r from-yellow-500 to-emerald-500 hover:from-yellow-400 hover:to-emerald-400 text-white text-sm transition-all shadow-lg shadow-emerald-500/20">
                                    🎖️ Claim Rewards &amp; Finish Mission
                                </button>
                            ) : (
                                <button onClick={onClose}
                                    className="px-8 py-3 rounded-xl font-semibold cursor-pointer bg-white/8 border border-white/10 hover:bg-white/12 text-white text-sm transition-all">
                                    Close — Try Again Later
                                </button>
                            )}
                        </div>
                    ) : loading ? (
                        <div className="flex justify-center py-16">
                            <svg className="animate-spin w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                        </div>
                    ) : quiz ? (
                        <>
                            {quiz.questions.map((q, qi) => (
                                <div key={qi} className="mb-5 p-4 rounded-xl border border-white/8 bg-white/2">
                                    <p className="text-xs text-emerald-400 mb-1">Question {qi + 1}</p>
                                    <p className="text-white font-semibold text-sm mb-3">{q.questionText}</p>
                                    <div className="grid grid-cols-1 gap-2">
                                        {q.options.map((opt, oi) => {
                                            const selected = answers[qi] === oi;
                                            return (
                                                <button key={oi} onClick={() => handleSelect(qi, oi)}
                                                    className={`text-left px-4 py-2.5 rounded-lg text-sm border cursor-pointer transition-all ${selected
                                                        ? 'border-violet-500 bg-violet-500/15 text-violet-300'
                                                        : 'border-white/8 bg-white/2 text-white/60 hover:border-white/20 hover:text-white/80'
                                                        }`}>
                                                    <span className={`font-mono mr-2 ${selected ? 'text-violet-400' : 'text-emerald-400/60'}`}>
                                                        {OPTS[oi]}.
                                                    </span>
                                                    {opt}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                            <button onClick={handleSubmit} disabled={submitting}
                                className="w-full py-3.5 rounded-xl font-semibold text-sm cursor-pointer disabled:opacity-50 bg-gradient-to-r from-emerald-600 to-violet-600 text-white mt-2">
                                {submitting ? 'Submitting…' : 'Submit Assessment'}
                            </button>
                        </>
                    ) : (
                        <p className="text-center text-white/30 py-12 text-sm">No quiz attached to this lesson yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

// ─── Lesson Modal ──────────────────────────────────────────────────────────────
const LessonModal = ({ lesson, onClose, onStartQuiz }) => (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4"
        style={{ background: 'rgba(3,7,18,0.88)', backdropFilter: 'blur(6px)' }}>
        <div className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl border border-white/10 bg-slate-900 shadow-2xl">
            <div className="flex items-start justify-between px-6 py-5 border-b border-white/8">
                <div>
                    <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/20">
                        {lesson.category}
                    </span>
                    <h2 className="text-xl font-bold text-white mt-2">{lesson.title}</h2>
                    {lesson.teacherId && (
                        <p className="text-sm text-white/35 mt-1">by {lesson.teacherId.name} · {lesson.teacherId.subject}</p>
                    )}
                </div>
                <button onClick={onClose} className="text-white/30 hover:text-white/70 cursor-pointer text-xl ml-4 shrink-0">✕</button>
            </div>
            <div className="px-6 py-5">
                <p className="text-white/75 text-sm leading-relaxed whitespace-pre-wrap">{lesson.content}</p>
                <div className="mt-8 flex gap-4">
                    <button onClick={() => onStartQuiz('solo')}
                        className="flex-1 py-3.5 rounded-xl font-semibold text-sm cursor-pointer border border-emerald-500/50 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-all">
                        Start Solo Quiz
                    </button>
                    <button onClick={() => onStartQuiz('duel')}
                        className="flex-1 py-3.5 rounded-xl font-semibold text-sm cursor-pointer bg-gradient-to-r from-emerald-600 to-violet-600 text-white hover:from-emerald-500 hover:to-violet-500 transition-all shadow-lg shadow-violet-500/20">
                        ⚔️ Start Duel
                    </button>
                </div>
            </div>
        </div>
    </div>
);

// ─── Lesson Card ───────────────────────────────────────────────────────────────
const LessonCard = ({ lesson, onOpen, isCompleted, isLocked }) => (
    <div onClick={() => !isLocked && onOpen(lesson)}
        className={`group p-5 rounded-2xl border transition-all duration-200 ${isLocked
            ? 'border-white/5 bg-white/5 opacity-50 cursor-not-allowed'
            : isCompleted
                ? 'border-yellow-500/40 bg-yellow-500/5 hover:bg-yellow-500/8 hover:border-yellow-500/60 cursor-pointer'
                : 'border-white/8 bg-white/2 hover:bg-white/5 hover:border-white/15 cursor-pointer'
            }`}>
        <div className="flex items-center justify-between mb-3">
            <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/20">
                {lesson.category}
            </span>
            <div className="flex items-center gap-2">
                {isLocked && (
                    <span className="text-xs flex items-center gap-1 text-red-400 font-semibold bg-red-500/10 px-2 py-0.5 rounded-md border border-red-500/20">
                        🔒 Locked
                    </span>
                )}
                {isCompleted && (
                    <span className="text-xs flex items-center gap-1 text-yellow-400 font-semibold">
                        ✅ Completed
                    </span>
                )}
                {lesson.isActive && !isCompleted && !isLocked && (
                    <span className="text-xs flex items-center gap-1 text-emerald-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live
                    </span>
                )}
            </div>
        </div>
        <h3 className={`font-semibold text-sm mb-1.5 transition-colors ${isLocked ? 'text-white/50' : isCompleted ? 'text-yellow-200 group-hover:text-yellow-100' : 'text-white group-hover:text-emerald-300'
            }`}>
            {lesson.title}
        </h3>
        <p className="text-white/35 text-xs line-clamp-2 mb-4">{lesson.content?.slice(0, 120)}…</p>
        {lesson.teacherId && (
            <p className="text-xs text-white/25">{lesson.teacherId.name} · {lesson.teacherId.subject}</p>
        )}
        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
            <span className="text-xs text-white/30">
                {isLocked ? 'Complete previous to unlock' : isCompleted ? 'Revisit lesson' : 'Open lesson'}
            </span>
            {!isLocked && (
                <span className={`text-sm group-hover:translate-x-1 transition-transform ${isCompleted ? 'text-yellow-400' : 'text-violet-400'}`}>→</span>
            )}
            {isLocked && (
                <span className="text-sm text-red-500/50">🔒</span>
            )}
        </div>
    </div>
);

// ─── Main Page ─────────────────────────────────────────────────────────────────
const MissionsPage = () => {
    const navigate = useNavigate();
    const [lessons, setLessons] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedLesson, setSelectedLesson] = useState(null);
    const [quizLesson, setQuizLesson] = useState(null);
    const [duelLesson, setDuelLesson] = useState(null);

    const { isLocked } = useMissionLock();

    // Read completedLessons from localStorage — refreshed after quest completion
    const getCompletedIds = () => {
        try {
            return JSON.parse(localStorage.getItem('user') || '{}').completedLessons || [];
        } catch { return []; }
    };
    const [completedIds, setCompletedIds] = useState(getCompletedIds);

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const load = useCallback(async () => {
        try {
            const [lesRes, annRes] = await Promise.all([getAllLessons(), getAnnouncements()]);
            setLessons(lesRes.data || []);
            setAnnouncements(annRes.data || []);
        } catch { } finally { setLoading(false); }
    }, []);

    useEffect(() => { load(); }, [load]);

    // Called by QuizModal after "Claim Rewards" — refreshes both lesson list and completedIds
    const handleQuestComplete = useCallback(() => {
        setCompletedIds(getCompletedIds());  // pick up the just-refreshed localStorage
        setQuizLesson(null);
        setDuelLesson(null);
        setSelectedLesson(null);
        load();
    }, [load]);

    const filtered = lessons.filter(l =>
        l.title.toLowerCase().includes(search.toLowerCase()) ||
        l.category.toLowerCase().includes(search.toLowerCase())
    );

    const completedCount = filtered.filter(l => completedIds.includes(l._id)).length;

    return (
        <div className="min-h-screen bg-slate-900 text-white">
            {/* Top bar */}
            <header className="border-b border-white/8 bg-slate-900/80 backdrop-blur sticky top-0 z-10">
                <div className="max-w-5xl mx-auto px-5 py-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button onClick={() => navigate('/home')} className="text-white/40 hover:text-white/70 cursor-pointer text-sm transition-colors">← Home</button>
                        <span className="text-white/15">|</span>
                        <span className="font-semibold text-white text-sm">My Lessons</span>
                    </div>
                    <div className="flex items-center gap-3">
                        {completedCount > 0 && (
                            <span className="text-xs text-yellow-400/80 font-medium">
                                ✅ {completedCount} completed
                            </span>
                        )}
                        <span className="text-xs text-white/30">{user.name}</span>
                    </div>
                </div>
            </header>

            <div className="max-w-5xl mx-auto px-5 py-8">

                {/* Announcements strip */}
                {announcements.length > 0 && (
                    <div className="mb-8 rounded-2xl border border-violet-500/20 bg-violet-500/5 p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500" />
                            </span>
                            <p className="text-xs font-semibold text-violet-300">Admin Broadcasts</p>
                        </div>
                        <div className="space-y-2">
                            {announcements.slice(0, 2).map(a => (
                                <div key={a._id} className="text-sm">
                                    <span className="font-medium text-white">{a.title}: </span>
                                    <span className="text-white/55">{a.message}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Title + Search */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Lessons</h1>
                        <p className="text-white/35 text-sm mt-0.5">{filtered.length} available</p>
                    </div>
                    <input
                        type="text"
                        placeholder="Search lessons…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="px-4 py-2.5 rounded-xl text-sm text-white placeholder-white/20 outline-none border border-white/10 bg-white/5 focus:border-emerald-500 transition-colors w-full sm:w-64"
                    />
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-44 rounded-2xl animate-pulse bg-white/3 border border-white/5" />
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-24">
                        <p className="text-4xl mb-3">📚</p>
                        <p className="text-white/25 text-sm">No lessons found.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filtered.map(lesson => {
                            // MissionsPage is ONLY used by students (client app)
                            const locked = isLocked(lesson, false);
                            return (
                                <LessonCard
                                    key={lesson._id}
                                    lesson={lesson}
                                    onOpen={setSelectedLesson}
                                    isCompleted={completedIds.includes(lesson._id)}
                                    isLocked={locked}
                                />
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Modals */}
            {selectedLesson && !quizLesson && !duelLesson && (
                <LessonModal lesson={selectedLesson}
                    onClose={() => setSelectedLesson(null)}
                    onStartQuiz={(mode) => {
                        if (mode === 'duel') {
                            setDuelLesson(selectedLesson);
                        } else {
                            setQuizLesson(selectedLesson);
                        }
                        setSelectedLesson(null);
                    }} />
            )}

            {quizLesson && (
                <QuizModal lesson={quizLesson}
                    onClose={() => setQuizLesson(null)}
                    onQuestComplete={handleQuestComplete} />
            )}

            {duelLesson && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/95 backdrop-blur-sm">
                    <div className="w-full max-w-2xl">
                        <QuizDuelView
                            lesson={duelLesson}
                            quiz={duelLesson} // Simplified; the View hooks to the API internally or we just pass the ID.
                            onClose={() => setDuelLesson(null)}
                            onMatchComplete={(scores) => {
                                // If they win, you could trigger handleQuestComplete. For now, just close.
                                if (scores.me >= 4) {
                                    showToast.success('Victory! Bonus XP unlocked.');
                                }
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default MissionsPage;
