const express = require("express")
const { authenticate, authorizeRoles } = require("../Middleware/authMiddleware")
const { getAll, create, join, getMatches, start, recordResult } = require("../Controllers/TournamentController")

const router = express.Router()

// Get all tournaments
router.get("/", authenticate, getAll)

// Create tournament (admin)
router.post("/", authenticate, authorizeRoles("admin"), create)

// Join tournament
router.post("/:id/join", authenticate, join)

// Get tournament matches
router.get("/:id/matches", authenticate, getMatches)

// Start tournament (admin)
router.post("/:id/start", authenticate, authorizeRoles("admin"), start)

// Record match result (admin)
router.post("/:id/matches/:matchId/result", authenticate, authorizeRoles("admin"), recordResult)

module.exports = router