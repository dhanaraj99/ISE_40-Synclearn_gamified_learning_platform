const express = require("express")
const { authenticate } = require("../Middleware/authMiddleware")
const { getQuests, complete } = require("../Controllers/DailyQuestController")

const router = express.Router()

// Get daily quests
router.get("/", authenticate, getQuests)

// Complete a quest
router.post("/:id/complete", authenticate, complete)

module.exports = router