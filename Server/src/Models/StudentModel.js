const mongoose = require("mongoose")

const studentSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    class: { type: String, required: true, trim: true },           // e.g. "10A"
    rollNumber: { type: String, required: true, trim: true },       // e.g. "23"
    totalScore: { type: Number, default: 0 },
    completedLessons: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lesson" }],
    level: { type: Number, default: 1 },
    badges: [{ type: mongoose.Schema.Types.ObjectId, ref: "Badge" }],
    lastLogin: { type: Date },
    loginStreak: { type: Number, default: 0 },
    coins: { type: Number, default: 100 }, // starting coins
    avatar: { type: String, default: "🧑" } // simple emoji avatar, student can change
}, { timestamps: true })

module.exports = mongoose.model("Student", studentSchema)
