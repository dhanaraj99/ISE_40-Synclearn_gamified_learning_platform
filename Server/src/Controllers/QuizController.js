const asyncHandler = require("../Utils/catchAsync")
const { successResponse, errorResponse } = require("../Utils/ResponseUtils")
const { createQuiz, getQuizByLesson, submitQuiz, deleteQuiz } = require("../Services/QuizService")

// GET /api/v1/quiz/lesson/:lessonId  (all authenticated roles)
const getByLesson = asyncHandler(async (req, res) => {
    const result = await getQuizByLesson(req.params.lessonId, req.user.role)
    if (!result.success) return errorResponse(res, result.statusCode, result.message)
    return successResponse(res, result.statusCode, result.message, result.data)
})

// POST /api/v1/quiz  (teacher, admin)
const create = asyncHandler(async (req, res) => {
    const { lessonId, questions } = req.body
    const result = await createQuiz(lessonId, questions)
    if (!result.success) return errorResponse(res, result.statusCode, result.message)
    return successResponse(res, result.statusCode, result.message, result.data)
})

// POST /api/v1/quiz/:id/submit  (student)
const submit = asyncHandler(async (req, res) => {
    const result = await submitQuiz(req.params.id, req.user.id, req.body.answers)
    if (!result.success) return errorResponse(res, result.statusCode, result.message)
    return successResponse(res, result.statusCode, result.message, result.data)
})

// DELETE /api/v1/quiz/:id  (teacher owner or admin)
const remove = asyncHandler(async (req, res) => {
    const result = await deleteQuiz(req.params.id, req.user.id, req.user.role)
    if (!result.success) return errorResponse(res, result.statusCode, result.message)
    return successResponse(res, result.statusCode, result.message, result.data)
})

module.exports = { getByLesson, create, submit, remove }
