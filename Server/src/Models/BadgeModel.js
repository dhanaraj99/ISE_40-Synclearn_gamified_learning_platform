const mongoose = require("mongoose")

const badgeSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    icon: { type: String, required: true }, // emoji or icon name
    criteria: { type: String, required: true }, // e.g., "Complete 5 lessons"
    xpReward: { type: Number, default: 0 },
}, { timestamps: true })

module.exports = mongoose.model("Badge", badgeSchema)