import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { io } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styled } from 'nativewind';
import Constants from 'expo-constants'; // fallback for API url

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

const QuizDuelView = ({ lesson, quiz, onClose, onMatchComplete }) => {
    const [socket, setSocket] = useState(null);
    const [matchState, setMatchState] = useState('joining'); // joining, waiting, active, finished
    const [roomId, setRoomId] = useState(null);
    const [scores, setScores] = useState({ me: 0, opponent: 0 });
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState(new Array(quiz.questions?.length || 5).fill(null));

    useEffect(() => {
        let newSocket;

        const connectSocket = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                if (!token) {
                    Alert.alert('Error', 'You must be logged in to duel.');
                    onClose();
                    return;
                }

                // In React Native, localhost doesn't work out of the box for Android emulators.
                // We assume there's an API config or use a generic local IP.
                // Fallback to a common expo local ip or API URL.
                const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:5000/api/v1/';
                const baseURL = API_URL.split('/api')[0];

                newSocket = io(baseURL, {
                    auth: { token }
                });

                newSocket.on('connect', () => {
                    console.log('Connected to duel server.');
                    newSocket.emit('join_match', { quizId: quiz._id });
                });

                newSocket.on('queue_status', (data) => {
                    setMatchState('waiting');
                });

                newSocket.on('match_found', (data) => {
                    setRoomId(data.roomId);
                    setMatchState('active');
                    Alert.alert('Match Found!', 'Your duel is starting now!');
                });

                newSocket.on('update_score', async (playersData) => {
                    try {
                        const userStr = await AsyncStorage.getItem('user');
                        if (userStr) {
                            const user = JSON.parse(userStr);
                            const myId = user.id;
                            let myScore = 0;
                            let opScore = 0;

                            Object.keys(playersData).forEach(uid => {
                                if (uid === myId) myScore = playersData[uid].score;
                                else opScore = playersData[uid].score;
                            });

                            setScores({ me: myScore, opponent: opScore });
                        }
                    } catch (err) {
                        console.error("Error reading user from async storage", err);
                    }
                });

                newSocket.on('opponent_disconnected', (msg) => {
                    Alert.alert('Notice', msg);
                    setMatchState('finished');
                });

                newSocket.on('error_msg', (msg) => {
                    Alert.alert('Error', msg);
                    if (matchState !== 'active') onClose();
                });

                setSocket(newSocket);
            } catch (err) {
                console.error("Socket connection setup block error", err);
            }
        };

        connectSocket();

        return () => {
            if (newSocket) newSocket.disconnect();
        };
    }, []);

    const handleSelectOption = (index) => {
        if (answers[currentQuestion] !== null) return;

        const newAnswers = [...answers];
        newAnswers[currentQuestion] = index;
        setAnswers(newAnswers);

        socket.emit("send_answer", {
            roomId,
            questionIndex: currentQuestion,
            selectedOption: index
        });

        // Auto move to next question if possible
        if (currentQuestion < (quiz.questions?.length || 5) - 1) {
            setTimeout(() => setCurrentQuestion(p => p + 1), 600);
        } else {
            setTimeout(() => setMatchState('finished'), 600);
        }
    };

    if (matchState === 'joining') {
        return (
            <StyledView className="flex-1 bg-slate-900 justify-center items-center p-6">
                <ActivityIndicator size="large" color="#10b981" className="mb-4" />
                <StyledText className="text-white text-base">Connecting to Duel Server...</StyledText>
            </StyledView>
        );
    }

    if (matchState === 'waiting') {
        return (
            <StyledView className="flex-1 bg-slate-900 justify-center items-center p-6">
                <ActivityIndicator size="large" color="#8b5cf6" className="mb-4" />
                <StyledText className="text-2xl font-bold text-white mb-2">Finding Opponent</StyledText>
                <StyledText className="text-white/50 text-center mb-8">Waiting for a worthy challenger to play '{lesson.title}'...</StyledText>
                <StyledTouchableOpacity onPress={onClose} className="px-6 py-3 bg-white/10 rounded-xl">
                    <StyledText className="text-white font-semibold">Cancel Matchmaking</StyledText>
                </StyledTouchableOpacity>
            </StyledView>
        );
    }

    const totalQ = quiz.questions?.length || 5;
    const q = quiz.questions?.[currentQuestion];

    const myPercent = Math.min(100, Math.max(0, (scores.me / totalQ) * 100));
    const opPercent = Math.min(100, Math.max(0, (scores.opponent / totalQ) * 100));

    return (
        <StyledView className="flex-1 bg-slate-900 p-4 pt-12">
            <StyledView className="flex-row justify-between items-center mb-6">
                <StyledText className="text-2xl font-bold text-emerald-400">⚔️ Duel ⚔️</StyledText>
                <StyledTouchableOpacity onPress={onClose}>
                    <StyledText className="text-white/50 text-lg">✕</StyledText>
                </StyledTouchableOpacity>
            </StyledView>

            <StyledView className="flex-row justify-between mb-8 px-2">
                {/* My Score */}
                <StyledView className="flex-1 items-center mr-2">
                    <StyledText className="text-xs font-semibold text-emerald-400 mb-2 uppercase">Me (You)</StyledText>
                    <StyledView className="w-full h-3 rounded-full bg-slate-700/50 mb-2 overflow-hidden border border-white/5">
                        <StyledView className="h-full bg-emerald-500" style={{ width: `${myPercent}%` }}></StyledView>
                    </StyledView>
                    <StyledText className="text-2xl font-black text-white">{scores.me}</StyledText>
                </StyledView>

                {/* Opponent Score */}
                <StyledView className="flex-1 items-center ml-2">
                    <StyledText className="text-xs font-semibold text-pink-400 mb-2 uppercase">Opponent</StyledText>
                    <StyledView className="w-full h-3 rounded-full bg-slate-700/50 mb-2 overflow-hidden border border-white/5">
                        <StyledView className="h-full bg-pink-500" style={{ width: `${opPercent}%` }}></StyledView>
                    </StyledView>
                    <StyledText className="text-2xl font-black text-white">{scores.opponent}</StyledText>
                </StyledView>
            </StyledView>

            {matchState === 'active' && q ? (
                <ScrollView className="flex-1 mt-4">
                    <StyledText className="text-xs text-white/50 mb-4 tracking-widest uppercase">QUESTION {currentQuestion + 1} OF {totalQ}</StyledText>
                    <StyledText className="text-xl font-medium text-white mb-8 border-l-4 border-violet-500 pl-4">{q.questionText}</StyledText>

                    <StyledView className="space-y-4">
                        {q.options.map((opt, i) => {
                            const selected = answers[currentQuestion] === i;
                            return (
                                <StyledTouchableOpacity
                                    key={i}
                                    onPress={() => handleSelectOption(i)}
                                    disabled={answers[currentQuestion] !== null}
                                    className={`w-full flex-row p-4 rounded-xl border items-center mb-3
                                    ${selected
                                            ? 'border-violet-500 bg-violet-600/20'
                                            : 'border-white/10 bg-white/5'}`}
                                >
                                    <StyledView className={`w-8 h-8 rounded-lg items-center justify-center mr-4 
                                        ${selected ? 'bg-violet-500' : 'bg-white/10'}`}>
                                        <StyledText className={`font-bold ${selected ? 'text-white' : 'text-white/50'}`}>
                                            {['A', 'B', 'C', 'D'][i]}
                                        </StyledText>
                                    </StyledView>
                                    <StyledText className={`flex-1 font-medium ${selected ? 'text-white' : 'text-white/80'}`}>
                                        {opt}
                                    </StyledText>
                                </StyledTouchableOpacity>
                            );
                        })}
                    </StyledView>
                </ScrollView>
            ) : matchState === 'finished' ? (
                <StyledView className="flex-1 justify-center items-center pb-20">
                    <StyledText className="text-4xl font-black text-violet-400 mb-4">Match Finished!</StyledText>
                    <StyledText className="mb-8 text-white/70 text-lg text-center px-4">
                        {scores.me > scores.opponent
                            ? "You emerged victorious! 🏆"
                            : scores.me < scores.opponent
                                ? "You were defeated. Better luck next time! 💀"
                                : "It's a tie! 🤝"}
                    </StyledText>
                    <StyledTouchableOpacity
                        onPress={() => {
                            onMatchComplete && onMatchComplete(scores);
                            onClose();
                        }}
                        className="px-8 py-4 rounded-xl bg-violet-600">
                        <StyledText className="text-white font-semibold text-base">Exit Duel</StyledText>
                    </StyledTouchableOpacity>
                </StyledView>
            ) : null}
        </StyledView>
    );
};

export default QuizDuelView;
