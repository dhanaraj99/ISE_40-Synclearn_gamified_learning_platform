const mongoose = require("mongoose")

const studentBadgeSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    badgeId: { type: mongoose.Schema.Types.ObjectId, ref: "Badge", required: true },
    awardedAt: { type: Date, default: Date.now },
}, { timestamps: true })

// Ensure a student can't get the same badge twice
studentBadgeSchema.index({ studentId: 1, badgeId: 1 }, { unique: true })

module.exports = mongoose.model("StudentBadge", studentBadgeSchema)