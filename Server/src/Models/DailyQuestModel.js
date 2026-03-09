const mongoose = require("mongoose")

const dailyQuestSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    questType: { type: String, required: true }, // e.g., 'login', 'quiz_complete', 'lesson_read'
    description: { type: String, required: true },
    xpReward: { type: Number, default: 5 },
    isCompleted: { type: Boolean, default: false },
    date: { type: Date, default: () => new Date().toISOString().split('T')[0] }, // YYYY-MM-DD
}, { timestamps: true })

module.exports = mongoose.model("DailyQuest", dailyQuestSchema)