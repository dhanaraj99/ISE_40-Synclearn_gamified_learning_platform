const express = require("express")
const router = express.Router()
const { login, createStudent } = require("../Controllers/TeacherController")
const { authenticate, authorizeRoles } = require("../Middleware/authMiddleware")

// Public
router.post("/login", login)

// Teacher only
router.post("/add-student", authenticate, authorizeRoles("teacher"), createStudent)

module.exports = router
