const mongoose = require("mongoose")

const quizAttemptSchema = new mongoose.Schema({
    quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    answers: { type: [Number], required: true },   // 0-indexed option chosen per question
    score: { type: Number, required: true },     // 0-5, auto-calculated server-side
}, { timestamps: true })

module.exports = mongoose.model("QuizAttempt", quizAttemptSchema)
