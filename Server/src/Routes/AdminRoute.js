const express = require("express")
const router = express.Router()
const { registerAdmin, login, createTeacher, createStudent, listTeachers, listStudents } = require("../Controllers/AdminController")
const { authenticate, authorizeRoles } = require("../Middleware/authMiddleware")

// Public
router.post("/register", registerAdmin)
router.post("/login", login)

// Admin only — create
router.post("/add-teacher", authenticate, authorizeRoles("admin"), createTeacher)
router.post("/add-student", authenticate, authorizeRoles("admin"), createStudent)

// Admin + Teacher — list
router.get("/teachers", authenticate, authorizeRoles("admin", "teacher"), listTeachers)
router.get("/students", authenticate, authorizeRoles("admin", "teacher"), listStudents)

module.exports = router