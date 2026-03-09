const express = require("express")
const router = express.Router()
const { login, getProfile } = require("../Controllers/StudentController")
const { authenticate, authorizeRoles } = require("../Middleware/authMiddleware")

// Public
router.post("/login", login)

// Authenticated student
router.get("/profile", authenticate, authorizeRoles("student"), getProfile)
// Update avatar
router.put("/avatar", authenticate, authorizeRoles("student"), require('../Controllers/StudentController').changeAvatar)

module.exports = router
