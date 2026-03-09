import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTournaments, joinTournament, getTournamentMatches } from '../api/missionService';
import { showToast } from '../utils/toast';

// ─── TournamentPage ───────────────────────────────────────────────────────────
const TournamentPage = () => {
    const navigate = useNavigate();
    const [tournaments, setTournaments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTournament, setSelectedTournament] = useState(null);
    const [matches, setMatches] = useState([]);

    useEffect(() => {
        loadTournaments();
    }, []);

    const loadTournaments = async () => {
        try {
            const res = await getTournaments();
            setTournaments(res.data || []);
        } catch (error) {
            showToast.error('Failed to load tournaments');
        } finally {
            setLoading(false);
        }
    };

    const handleJoin = async (tournamentId) => {
        try {
            await joinTournament(tournamentId);
            showToast.success('Joined tournament!');
            loadTournaments(); // Refresh to show updated participants
        } catch (error) {
            showToast.error('Failed to join tournament');
        }
    };

    const handleViewMatches = async (tournament) => {
        try {
            const res = await getTournamentMatches(tournament._id);
            setMatches(res.data || []);
            setSelectedTournament(tournament);
        } catch (error) {
            showToast.error('Failed to load matches');
        }
    };

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
                    <span className="font-semibold text-white text-sm">Tournaments</span>
                    <div></div>
                </div>
            </header>

            <div className="max-w-3xl mx-auto px-5 py-8 space-y-6">
                {selectedTournament ? (
                    // Tournament Matches View
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h1 className="text-xl font-bold text-white">{selectedTournament.name}</h1>
                                <p className="text-white/40 text-sm">{selectedTournament.description}</p>
                            </div>
                            <button
                                onClick={() => setSelectedTournament(null)}
                                className="text-white/60 hover:text-white cursor-pointer"
                            >
                                ← Back
                            </button>
                        </div>

                        <div className="space-y-4">
                            {matches.length === 0 ? (
                                <p className="text-white/25 text-center py-8">No matches yet. Tournament hasn't started.</p>
                            ) : (
                                matches.map((match, index) => (
                                    <div key={match._id} className="glass-card border border-white/10 rounded-2xl p-5">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-8 h-8 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-sm font-bold text-violet-300">
                                                    {index + 1}
                                                </div>
                                                <div>
                                                    <p className="text-white font-medium">
                                                        {match.player1?.name || 'TBD'} vs {match.player2?.name || 'TBD'}
                                                    </p>
                                                    <p className="text-white/40 text-sm">
                                                        Round {match.round} • {match.completed ? 'Completed' : 'Pending'}
                                                    </p>
                                                </div>
                                            </div>
                                            {match.completed && (
                                                <div className="text-right">
                                                    <p className="text-emerald-400 font-bold">
                                                        Winner: {match.winner?.name}
                                                    </p>
                                                    <p className="text-white/40 text-sm">
                                                        {match.score1} - {match.score2}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                ) : (
                    // Tournaments List
                    <div>
                        <div className="mb-6">
                            <h1 className="text-2xl font-bold text-white mb-2">🏆 Tournaments</h1>
                            <p className="text-white/40">Join competitive tournaments and prove your skills!</p>
                        </div>

                        <div className="space-y-4">
                            {tournaments.length === 0 ? (
                                <p className="text-white/25 text-center py-8">No tournaments available right now.</p>
                            ) : (
                                tournaments.map(tournament => (
                                    <div key={tournament._id} className="glass-card border border-white/10 rounded-2xl p-5">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h3 className="text-lg font-bold text-white mb-1">{tournament.name}</h3>
                                                <p className="text-white/60 text-sm mb-3">{tournament.description}</p>
                                                <div className="flex items-center gap-4 text-xs text-white/40">
                                                    <span>📅 {new Date(tournament.startDate).toLocaleDateString()}</span>
                                                    <span>👥 {tournament.participants?.length || 0}/{tournament.maxParticipants}</span>
                                                    <span>💰 Entry: {tournament.entryFee} coins</span>
                                                    <span>🏆 Prize: {tournament.prizePool} coins</span>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 ml-4">
                                                <button
                                                    onClick={() => handleViewMatches(tournament)}
                                                    className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm hover:bg-white/20 cursor-pointer"
                                                >
                                                    View Bracket
                                                </button>
                                                {tournament.status === 'upcoming' && (
                                                    <button
                                                        onClick={() => handleJoin(tournament._id)}
                                                        className="px-4 py-2 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-sm hover:bg-emerald-500/30 cursor-pointer"
                                                    >
                                                        Join ({tournament.entryFee} coins)
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        <div className="mt-3">
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                tournament.status === 'active' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                                                tournament.status === 'completed' ? 'bg-gray-500/20 text-gray-300 border border-gray-500/30' :
                                                'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                            }`}>
                                                {tournament.status.charAt(0).toUpperCase() + tournament.status.slice(1)}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TournamentPage;