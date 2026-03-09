const asyncHandler = require("../Utils/catchAsync")
const { successResponse, errorResponse } = require("../Utils/ResponseUtils")
const { generateDailyQuests, getDailyQuests, completeQuest } = require("../Services/DailyQuestService")

// GET /api/v1/daily-quests (generate if needed)
const getQuests = asyncHandler(async (req, res) => {
    // First generate if not exist
    await generateDailyQuests(req.user.id)
    const result = await getDailyQuests(req.user.id)
    if (!result.success) return errorResponse(res, result.statusCode, result.message)
    return successResponse(res, result.statusCode, result.message, result.data)
})

// POST /api/v1/daily-quests/:id/complete
const complete = asyncHandler(async (req, res) => {
    const result = await completeQuest(req.user.id, req.params.id)
    if (!result.success) return errorResponse(res, result.statusCode, result.message)
    return successResponse(res, result.statusCode, result.message, result.data)
})

module.exports = { getQuests, complete }