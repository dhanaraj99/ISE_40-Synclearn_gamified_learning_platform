const express = require("express")
const { authenticate } = require("../Middleware/authMiddleware")
const { getBoard, getRank } = require("../Controllers/LeaderboardController")

const router = express.Router()

// Get leaderboard
router.get("/", authenticate, getBoard)

// Get student's rank
router.get("/rank", authenticate, getRank)

module.exports = router