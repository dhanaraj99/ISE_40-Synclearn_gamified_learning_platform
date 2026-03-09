const asyncHandler = require("../Utils/catchAsync")
const { successResponse, errorResponse } = require("../Utils/ResponseUtils")
const { getLeaderboard, getStudentRank } = require("../Services/LeaderboardService")

// GET /api/v1/leaderboard?limit=10&class=10A (all authenticated)
const getBoard = asyncHandler(async (req, res) => {
    const limit = parseInt(req.query.limit) || 10
    const classFilter = req.query.class || null
    const result = await getLeaderboard(limit, classFilter)
    if (!result.success) return errorResponse(res, result.statusCode, result.message)
    return successResponse(res, result.statusCode, result.message, result.data)
})

// GET /api/v1/leaderboard/rank (student gets own rank)
const getRank = asyncHandler(async (req, res) => {
    const result = await getStudentRank(req.user.id)
    if (!result.success) return errorResponse(res, result.statusCode, result.message)
    return successResponse(res, result.statusCode, result.message, result.data)
})

module.exports = { getBoard, getRank }