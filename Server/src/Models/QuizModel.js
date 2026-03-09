const mongoose = require("mongoose")

const questionSchema = new mongoose.Schema({
    questionText: { type: String, required: true },
    options: { type: [String], required: true, validate: v => v.length === 4 },
    correctAns: { type: Number, required: true, min: 0, max: 3 },
}, { _id: false })

const quizSchema = new mongoose.Schema({
    lessonId: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson", required: true, unique: true },
    questions: {
        type: [questionSchema],
        required: true,
        validate: v => v.length > 0,
    },
}, { timestamps: true })

module.exports = mongoose.model("Quiz", quizSchema)
