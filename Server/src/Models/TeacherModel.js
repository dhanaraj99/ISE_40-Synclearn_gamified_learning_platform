const mongoose = require("mongoose")

const teacherSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    classes: { type: [String], default: [] },   // e.g. ["10A", "11B"]
    subject: { type: String, required: true, trim: true }
}, { timestamps: true })

module.exports = mongoose.model("Teacher", teacherSchema)
