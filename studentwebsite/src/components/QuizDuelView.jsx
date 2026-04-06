import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { showToast } from '../utils/toast';
import { getQuizForLesson } from '../api/missionService';

const QuizDuelView = ({ lesson, onClose, onMatchComplete }) => {

    const [socket, setSocket] = useState(null);
    const [matchState, setMatchState] = useState('joining'); // joining, waiting, active, finished
    const [roomId, setRoomId] = useState(null);
    const [scores, setScores] = useState({ me: 0, opponent: 0 });
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [quiz, setQuiz] = useState(null);


    // Wait! Since quizzes do not send `correctAns` to students, we rely wholly on the socket
    // state to update scores. We don't technically know if an answer is right until the server
    // broadcasts `update_score`. But that's fine—we can show options selected.

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            showToast.error("You must be logged in to duel.");
            onClose();
            return;
        }

        let newSocket;

        const initialize = async () => {
            try {
                // Fetch the actual quiz for this lesson
                const res = await getQuizForLesson(lesson._id);
                const fetchedQuiz = res.data;
                setQuiz(fetchedQuiz);
                setAnswers(new Array(fetchedQuiz.questions.length).fill(null));



                // Connect to socket
                const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1/';
                // Extract base URL from API route. Quick split to get domain.
                const baseURL = API_URL.split('/api')[0];

                newSocket = io(baseURL, {
                    auth: { token }
                });

                // Event listeners
                newSocket.on('connect', () => {
                    console.log('Connected to duel server.');
                    newSocket.emit('join_match', { quizId: fetchedQuiz._id });
                });

                newSocket.on('queue_status', (data) => {
                    setMatchState('waiting');
                });

                newSocket.on('match_found', (data) => {
                    setRoomId(data.roomId);
                    setMatchState('active');
                    showToast.success('Opponent found! Match starting.');
                });

                newSocket.on('update_score', (playersData) => {
                    try {
                        const user = JSON.parse(localStorage.getItem('user'));
                        const myId = user.id;
                        let myScore = 0;
                        let opScore = 0;

                        Object.keys(playersData).forEach(uid => {
                            if (uid === myId) myScore = playersData[uid].score;
                            else opScore = playersData[uid].score;
                        });

                        setScores({ me: myScore, opponent: opScore });
                    } catch (err) { }
                });

                newSocket.on('opponent_disconnected', (msg) => {
                    showToast.alert(msg);
                    setMatchState('finished');
                });

                newSocket.on('error_msg', (msg) => {
                    showToast.error(msg);
                    if (matchState !== 'active') onClose();
                });

                setSocket(newSocket);
            } catch (err) {
                showToast.error('Could not load quiz for duel.');
                onClose();
            }
        };

        initialize();

        return () => {
            if (newSocket) newSocket.disconnect();
        };
    }, []);

    const handleSelectOption = (index) => {
        if (answers[currentQuestion] !== null) return; // already answered

        const newAnswers = [...answers];
        newAnswers[currentQuestion] = index;
        setAnswers(newAnswers);

        socket.emit("send_answer", {
            roomId,
            questionIndex: currentQuestion,
            selectedOption: index
        });

        // Auto move to next question if possible
        if (currentQuestion < quiz.questions.length - 1) {
            setTimeout(() => setCurrentQuestion(p => p + 1), 600);
        } else {
            // Last question
            setTimeout(() => setMatchState('finished'), 600);
        }
    };



    if (matchState === 'joining') {
        return (
            <div className="text-center py-10">
                <div className="animate-spin w-8 h-8 rounded-full border-t-2 border-emerald-500 mx-auto mb-4" />
                <p>Connecting to Duel Server...</p>
            </div>
        );
    }

    if (matchState === 'waiting') {
        return (
            <div className="text-center py-10">
                <div className="animate-pulse flex items-center justify-center gap-2 mb-4">
                    <span className="w-3 h-3 rounded-full bg-violet-500"></span>
                    <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                </div>
                <h2 className="text-xl font-bold mb-2">Finding Opponent</h2>
                <p className="text-white/50 text-sm mb-6">Waiting for a worthy challenger to play `{lesson.title}`...</p>
                <button onClick={onClose} className="px-5 py-2 glass-card rounded-lg text-sm border-white/10 hover:bg-white/5 transition-colors">
                    Cancel Matchmaking
                </button>
            </div>
        );
    }

    const totalQ = quiz ? quiz.questions.length : 1;
    const q = quiz ? quiz.questions[currentQuestion] : null;

    // Convert current score to max width of bar (5 questions = max 5 points for logic, visually translate to 100%)
    const myPercent = Math.min(100, Math.max(0, (scores.me / totalQ) * 100));
    const opPercent = Math.min(100, Math.max(0, (scores.opponent / totalQ) * 100));

    return (
        <div className="max-w-2xl mx-auto p-4 md:p-6 pb-8 border border-white/10 rounded-2xl bg-slate-800 shadow-2xl relative">
            <button onClick={onClose} className="absolute right-4 top-4 text-white/30 hover:text-white/70">✕</button>
            <h2 className="text-xl font-bold text-center mb-6 neon-text-green">⚔️ Real-Time Duel ⚔️</h2>

            <div className="grid grid-cols-2 gap-6 mb-8 mt-2 px-2 md:px-6">
                {/* My Score */}
                <div className="flex flex-col items-center">
                    <span className="text-xs font-semibold text-emerald-400 mb-2 uppercase tracking-wide">Me (You)</span>
                    <div className="w-full h-3 rounded-full bg-slate-700/50 mb-2 relative overflow-hidden border border-white/5">
                        <div className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-emerald-500 to-green-400 shadow-[0_0_10px_rgba(52,211,153,0.5)] transition-all duration-500" style={{ width: `${myPercent}%` }}></div>
                    </div>
                    <span className="text-xl font-black">{scores.me}</span>
                </div>

                {/* Opponent Score */}
                <div className="flex flex-col items-center">
                    <span className="text-xs font-semibold text-pink-400 mb-2 uppercase tracking-wide">Opponent</span>
                    <div className="w-full h-3 rounded-full bg-slate-700/50 mb-2 relative overflow-hidden border border-white/5">
                        <div className="absolute right-0 top-0 bottom-0 bg-gradient-to-r from-pink-500 to-red-400 shadow-[0_0_10px_rgba(236,72,153,0.5)] transition-all duration-500" style={{ width: `${opPercent}%` }}></div>
                    </div>
                    <span className="text-xl font-black">{scores.opponent}</span>
                </div>
            </div>

            {matchState === 'active' && q ? (
                <div className="mt-8 quiz-body animation-fade-in mx-2">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-xs text-white/50 tracking-wider">QUESTION {currentQuestion + 1} OF {totalQ}</span>
                    </div>                    <p className="text-lg font-medium mb-6 leading-relaxed border-l-4 border-violet-500 pl-4 py-1">{q.questionText}</p>
                    <div className="space-y-3">
                        {q.options.map((opt, i) => {
                            const selected = answers[currentQuestion] === i;
                            return (
                                <button
                                    key={i}
                                    onClick={() => handleSelectOption(i)}
                                    disabled={answers[currentQuestion] !== null}
                                    className={`w-full text-left p-4 rounded-xl border text-sm md:text-base font-medium flex items-center group transition-all duration-200
                                    ${selected
                                            ? 'border-violet-500 bg-violet-600/20 text-white translate-x-2'
                                            : 'border-white/10 bg-white/5 text-white/80 hover:bg-white/10 hover:border-white/20'}`}
                                >
                                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center mr-4 text-xs font-bold font-mono transition-colors
                                        ${selected ? 'bg-violet-500 text-white' : 'bg-white/10 text-white/50 group-hover:bg-white/20 group-hover:text-white'}`}>
                                        {['A', 'B', 'C', 'D'][i]}
                                    </span>
                                    {opt}
                                </button>
                            );
                        })}
                    </div>
                </div>
            ) : matchState === 'finished' ? (
                <div className="text-center py-10 animation-fade-in">
                    <h3 className="text-3xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-emerald-400">Match Finished!</h3>
                    <p className="mb-4 text-white/70">
                        {scores.me > scores.opponent
                            ? "You emerged victorious! 🏆"
                            : scores.me < scores.opponent
                                ? "You were defeated. Better luck next time! 💀"
                                : "It's a tie! 🤝"}
                    </p>
                    <button
                        onClick={() => {
                            onMatchComplete && onMatchComplete(scores);
                            onClose();
                        }}
                        className="px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 font-semibold transition-all">
                        Exit Duel
                    </button>
                </div>
            ) : null}

        </div>
    );
};

export default QuizDuelView;
