const express = require("express")
const router = express.Router()
const { getAll, create, remove } = require("../Controllers/AnnouncementController")
const { authenticate, authorizeRoles } = require("../Middleware/authMiddleware")

// All roles can read announcements
router.get("/", authenticate, authorizeRoles("student", "teacher", "admin"), getAll)

// Admin only — create and delete
router.post("/", authenticate, authorizeRoles("admin"), create)
router.delete("/:id", authenticate, authorizeRoles("admin"), remove)

module.exports = router
