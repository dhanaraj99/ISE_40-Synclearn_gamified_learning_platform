const TournamentModel = require("../Models/TournamentModel")
const StudentModel = require("../Models/StudentModel")
const { serviceOk, serviceFail } = require("../Utils/ResponseUtils")

// Create a new tournament (admin only)
const createTournament = async (data) => {
    const tournament = await TournamentModel.create(data)
    return serviceOk("Tournament created", tournament, 201)
}

// Get all tournaments
const getTournaments = async () => {
    const tournaments = await TournamentModel.find()
        .populate('participants', 'name')
        .sort({ startDate: -1 })
    return serviceOk("Tournaments fetched", tournaments)
}

// Join tournament
const joinTournament = async (tournamentId, studentId) => {
    const tournament = await TournamentModel.findById(tournamentId)
    if (!tournament) return serviceFail(404, "Tournament not found")

    if (tournament.participants.length >= tournament.maxParticipants) {
        return serviceFail(400, "Tournament is full")
    }

    if (tournament.participants.includes(studentId)) {
        return serviceFail(400, "Already joined this tournament")
    }

    const student = await StudentModel.findById(studentId)
    if (student.coins < tournament.entryFee) {
        return serviceFail(400, "Not enough coins to join")
    }

    // Deduct entry fee
    await StudentModel.findByIdAndUpdate(studentId, {
        $inc: { coins: -tournament.entryFee }
    })

    tournament.participants.push(studentId)
    await tournament.save()

    return serviceOk("Joined tournament", tournament)
}

// Get tournament bracket/matches
const getTournamentMatches = async (tournamentId) => {
    const tournament = await TournamentModel.findById(tournamentId)
        .populate('matches.player1', 'name')
        .populate('matches.player2', 'name')
        .populate('matches.winner', 'name')
    if (!tournament) return serviceFail(404, "Tournament not found")

    return serviceOk("Tournament matches fetched", tournament.matches)
}

// Start tournament (generate matches)
const startTournament = async (tournamentId) => {
    const tournament = await TournamentModel.findById(tournamentId).populate('participants')
    if (!tournament) return serviceFail(404, "Tournament not found")

    if (tournament.status !== 'upcoming') return serviceFail(400, "Tournament already started")

    // Generate round-robin or single elimination matches
    const participants = tournament.participants
    const matches = []

    // Simple round-robin for now
    for (let i = 0; i < participants.length; i += 2) {
        if (i + 1 < participants.length) {
            matches.push({
                round: 1,
                player1: participants[i]._id,
                player2: participants[i + 1]._id,
                completed: false
            })
        }
    }

    tournament.matches = matches
    tournament.status = 'active'
    await tournament.save()

    return serviceOk("Tournament started", tournament)
}

// Record match result
const recordMatchResult = async (tournamentId, matchId, winnerId, score1, score2) => {
    const tournament = await TournamentModel.findById(tournamentId)
    if (!tournament) return serviceFail(404, "Tournament not found")

    const match = tournament.matches.id(matchId)
    if (!match) return serviceFail(404, "Match not found")

    match.winner = winnerId
    match.score1 = score1
    match.score2 = score2
    match.completed = true

    // Award prizes if tournament complete
    const completedMatches = tournament.matches.filter(m => m.completed)
    if (completedMatches.length === tournament.matches.length) {
        tournament.status = 'completed'
        // Award prizes to top players
        const winners = tournament.matches.map(m => m.winner).filter(w => w)
        // Simple: give coins to winner
        if (winners.length > 0) {
            await StudentModel.findByIdAndUpdate(winners[0], {
                $inc: { coins: tournament.prizePool }
            })
        }
    }

    await tournament.save()
    return serviceOk("Match result recorded", match)
}

module.exports = { createTournament, getTournaments, joinTournament, getTournamentMatches, startTournament, recordMatchResult }