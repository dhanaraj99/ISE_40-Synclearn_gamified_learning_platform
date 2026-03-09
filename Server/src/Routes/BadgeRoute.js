const express = require("express")
const { authenticate, authorizeRoles } = require("../Middleware/authMiddleware")
const { getBadges, create, award, getStudent, check } = require("../Controllers/BadgeController")

const router = express.Router()

// All authenticated users can view badges
router.get("/", authenticate, getBadges)

// Admin only: create badges
router.post("/", authenticate, authorizeRoles("admin"), create)

// Admin only: manually award badges
router.post("/award", authenticate, authorizeRoles("admin"), award)

// Get student's badges (student can view own, teachers/admins can view any)
router.get("/student/:studentId", authenticate, getStudent)

// Check and award badges (admin or internal)
router.post("/check/:studentId", authenticate, authorizeRoles("admin"), check)

module.exports = router