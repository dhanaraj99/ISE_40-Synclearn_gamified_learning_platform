const mongoose = require("mongoose")

const lessonSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    category: { type: String, required: true, trim: true },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },
    isActive: { type: Boolean, default: true },
    isPublished: { type: Boolean, default: false },
    sequenceOrder: { type: Number, default: 0 },
    isBounty: { type: Boolean, default: false },
}, { timestamps: true })

module.exports = mongoose.model("Lesson", lessonSchema)
