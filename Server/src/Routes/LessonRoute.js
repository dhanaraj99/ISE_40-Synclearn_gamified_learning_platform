const express = require("express")
const router = express.Router()
const { getAll, getOne, create, update, remove } = require("../Controllers/LessonController")
const { authenticate, authorizeRoles } = require("../Middleware/authMiddleware")

// Public-like (all authenticated roles can read)
router.get("/", authenticate, authorizeRoles("student", "teacher", "admin"), getAll)
router.get("/:id", authenticate, authorizeRoles("student", "teacher", "admin"), getOne)

// Teacher / Admin only — create, update, delete
router.post("/", authenticate, authorizeRoles("teacher", "admin"), create)
router.put("/:id", authenticate, authorizeRoles("teacher", "admin"), update)
router.delete("/:id", authenticate, authorizeRoles("teacher", "admin"), remove)

module.exports = router
