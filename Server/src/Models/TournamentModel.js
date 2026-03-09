const mongoose = require("mongoose")

const tournamentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: { type: String, enum: ['upcoming', 'active', 'completed'], default: 'upcoming' },
    entryFee: { type: Number, default: 0 }, // coins required to enter
    prizePool: { type: Number, default: 0 }, // total coins to distribute
    maxParticipants: { type: Number, default: 32 },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
    matches: [{
        round: { type: Number, required: true },
        player1: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
        player2: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
        winner: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
        score1: { type: Number, default: 0 },
        score2: { type: Number, default: 0 },
        completed: { type: Boolean, default: false }
    }],
    rules: {
        questionsPerMatch: { type: Number, default: 5 },
        timeLimit: { type: Number, default: 30 }, // seconds per question
        powerUpsAllowed: { type: Boolean, default: true }
    }
}, { timestamps: true })

module.exports = mongoose.model("Tournament", tournamentSchema)