const asyncHandler = require("../Utils/catchAsync")
const { successResponse, errorResponse } = require("../Utils/ResponseUtils")
const { createTournament, getTournaments, joinTournament, getTournamentMatches, startTournament, recordMatchResult } = require("../Services/TournamentService")

// GET /api/v1/tournaments
const getAll = asyncHandler(async (req, res) => {
    const result = await getTournaments()
    if (!result.success) return errorResponse(res, result.statusCode, result.message)
    return successResponse(res, result.statusCode, result.message, result.data)
})

// POST /api/v1/tournaments (admin)
const create = asyncHandler(async (req, res) => {
    const result = await createTournament(req.body)
    if (!result.success) return errorResponse(res, result.statusCode, result.message)
    return successResponse(res, result.statusCode, result.message, result.data)
})

// POST /api/v1/tournaments/:id/join
const join = asyncHandler(async (req, res) => {
    const result = await joinTournament(req.params.id, req.user.id)
    if (!result.success) return errorResponse(res, result.statusCode, result.message)
    return successResponse(res, result.statusCode, result.message, result.data)
})

// GET /api/v1/tournaments/:id/matches
const getMatches = asyncHandler(async (req, res) => {
    const result = await getTournamentMatches(req.params.id)
    if (!result.success) return errorResponse(res, result.statusCode, result.message)
    return successResponse(res, result.statusCode, result.message, result.data)
})

// POST /api/v1/tournaments/:id/start (admin)
const start = asyncHandler(async (req, res) => {
    const result = await startTournament(req.params.id)
    if (!result.success) return errorResponse(res, result.statusCode, result.message)
    return successResponse(res, result.statusCode, result.message, result.data)
})

// POST /api/v1/tournaments/:id/matches/:matchId/result (admin or system)
const recordResult = asyncHandler(async (req, res) => {
    const { winnerId, score1, score2 } = req.body
    const result = await recordMatchResult(req.params.id, req.params.matchId, winnerId, score1, score2)
    if (!result.success) return errorResponse(res, result.statusCode, result.message)
    return successResponse(res, result.statusCode, result.message, result.data)
})

module.exports = { getAll, create, join, getMatches, start, recordResult }