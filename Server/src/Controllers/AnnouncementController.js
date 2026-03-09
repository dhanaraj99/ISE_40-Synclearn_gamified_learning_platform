const asyncHandler = require("../Utils/catchAsync")
const { successResponse, errorResponse } = require("../Utils/ResponseUtils")
const { createAnnouncement, getAllAnnouncements, deleteAnnouncement } = require("../Services/AnnouncementService")

// GET /api/v1/announcement  (all authenticated roles)
const getAll = asyncHandler(async (req, res) => {
    const result = await getAllAnnouncements()
    return successResponse(res, result.statusCode, result.message, result.data)
})

// POST /api/v1/announcement  (admin only)
const create = asyncHandler(async (req, res) => {
    const { title, message } = req.body
    const result = await createAnnouncement(title, message, req.user.id)
    if (!result.success) return errorResponse(res, result.statusCode, result.message)
    return successResponse(res, result.statusCode, result.message, result.data)
})

// DELETE /api/v1/announcement/:id  (admin only)
const remove = asyncHandler(async (req, res) => {
    const result = await deleteAnnouncement(req.params.id)
    if (!result.success) return errorResponse(res, result.statusCode, result.message)
    return successResponse(res, result.statusCode, result.message, result.data)
})

module.exports = { getAll, create, remove }
