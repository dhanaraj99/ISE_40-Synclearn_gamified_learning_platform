const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    role: {
        type: String,
        enum: ['admin', 'teacher', 'student'],
        default: 'student'
    },

    // Teacher-specific fields
    classAssigned: { type: String, default: null },   // e.g. "10", "11"
    subject: { type: String, default: null },          // e.g. "Mathematics"
    section: { type: String, default: null },          // e.g. "A", "B"

    // Student-specific fields
    classEnrolled: { type: String, default: null },    // e.g. "10"
    studentSection: { type: String, default: null },   // e.g. "A"
    rollNo: { type: String, default: null }            // e.g. "23"
}, { timestamps: true })

module.exports = mongoose.model("User", userSchema)