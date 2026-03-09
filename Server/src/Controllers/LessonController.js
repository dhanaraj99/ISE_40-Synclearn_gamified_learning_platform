const asyncHandler = require("../Utils/catchAsync")
const { successResponse, errorResponse } = require("../Utils/ResponseUtils")
const { createLesson, getAllLessons, getLessonById, updateLesson, deleteLesson } = require("../Services/LessonService")

// GET /api/v1/lesson
const getAll = asyncHandler(async (req, res) => {
    const result = await getAllLessons(req.user.role, req.user.id)
    return successResponse(res, result.statusCode, result.message, result.data)
})

// GET /api/v1/lesson/:id
const getOne = asyncHandler(async (req, res) => {
    const result = await getLessonById(req.params.id, req.user.role, req.user.id)
    if (!result.success) return errorResponse(res, result.statusCode, result.message)
    return successResponse(res, result.statusCode, result.message, result.data)
})

// POST /api/v1/lesson  (teacher, admin)
const create = asyncHandler(async (req, res) => {
    const { title, content, category, isPublished, sequenceOrder, isBounty } = req.body

    // Teachers are always the owner of their lesson.
    // Admins must also supply a teacherId in the body (to attribute lessons to a teacher).
    // If no teacherId is provided by admin, fall back to the admin's own ID as a placeholder.
    let teacherId
    if (req.user.role === "teacher") {
        teacherId = req.user.id
    } else {
        // Admin: use provided teacherId or fall back to admin's own id
        teacherId = req.body.teacherId || req.user.id
    }

    if (!teacherId) {
        return errorResponse(res, 400, "teacherId is required for admin-created lessons")
    }

    const result = await createLesson(title, content, category, teacherId, isPublished, sequenceOrder, isBounty)
    if (!result.success) return errorResponse(res, result.statusCode, result.message)
    return successResponse(res, result.statusCode, result.message, result.data)
})

// PUT /api/v1/lesson/:id  (teacher owner or admin)
const update = asyncHandler(async (req, res) => {
    const result = await updateLesson(req.params.id, req.user.id, req.user.role, req.body)
    if (!result.success) return errorResponse(res, result.statusCode, result.message)
    return successResponse(res, result.statusCode, result.message, result.data)
})

// DELETE /api/v1/lesson/:id  (teacher owner or admin)
const remove = asyncHandler(async (req, res) => {
    const result = await deleteLesson(req.params.id, req.user.id, req.user.role)
    if (!result.success) return errorResponse(res, result.statusCode, result.message)
    return successResponse(res, result.statusCode, result.message, result.data)
})

module.exports = { getAll, getOne, create, update, remove }
