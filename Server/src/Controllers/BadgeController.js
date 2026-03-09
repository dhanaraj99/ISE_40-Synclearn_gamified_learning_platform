const asyncHandler = require("../Utils/catchAsync")
const { successResponse, errorResponse } = require("../Utils/ResponseUtils")
const { createBadge, getAllBadges, awardBadge, getStudentBadges, checkAndAwardBadges } = require("../Services/BadgeService")

// GET /api/v1/badges (all authenticated)
const getBadges = asyncHandler(async (req, res) => {
    const result = await getAllBadges()
    if (!result.success) return errorResponse(res, result.statusCode, result.message)
    return successResponse(res, result.statusCode, result.message, result.data)
})

// POST /api/v1/badges (admin)
const create = asyncHandler(async (req, res) => {
    const { name, description, icon, criteria, xpReward } = req.body
    const result = await createBadge(name, description, icon, criteria, xpReward)
    if (!result.success) return errorResponse(res, result.statusCode, result.message)
    return successResponse(res, result.statusCode, result.message, result.data)
})

// POST /api/v1/badges/award (admin)
const award = asyncHandler(async (req, res) => {
    const { studentId, badgeId } = req.body
    const result = await awardBadge(studentId, badgeId)
    if (!result.success) return errorResponse(res, result.statusCode, result.message)
    return successResponse(res, result.statusCode, result.message, result.data)
})

// GET /api/v1/badges/student/:studentId (student, teacher, admin)
const getStudent = asyncHandler(async (req, res) => {
    const result = await getStudentBadges(req.params.studentId)
    if (!result.success) return errorResponse(res, result.statusCode, result.message)
    return successResponse(res, result.statusCode, result.message, result.data)
})

// POST /api/v1/badges/check/:studentId (internal or admin)
const check = asyncHandler(async (req, res) => {
    const result = await checkAndAwardBadges(req.params.studentId)
    if (!result.success) return errorResponse(res, result.statusCode, result.message)
    return successResponse(res, result.statusCode, result.message, result.data)
})

module.exports = { getBadges, create, award, getStudent, check }