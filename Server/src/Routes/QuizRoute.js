const express = require("express")
const router = express.Router()
const { getByLesson, create, submit, remove } = require("../Controllers/QuizController")
const { authenticate, authorizeRoles } = require("../Middleware/authMiddleware")

// All authenticated roles can GET quiz for a lesson
router.get("/lesson/:lessonId", authenticate, authorizeRoles("student", "teacher", "admin"), getByLesson)

// Teacher / Admin create & delete the quiz
router.post("/", authenticate, authorizeRoles("teacher", "admin"), create)
router.delete("/:id", authenticate, authorizeRoles("teacher", "admin"), remove)

// Student submits answers
router.post("/:id/submit", authenticate, authorizeRoles("student"), submit)

module.exports = router
