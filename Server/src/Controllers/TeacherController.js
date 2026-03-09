const asyncHandler = require("../Utils/catchAsync")
const { successResponse, errorResponse } = require("../Utils/ResponseUtils")
const { loginTeacher } = require("../Services/TeacherService")
const { addStudent } = require("../Services/StudentService")

// POST /api/teacher/login
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    const result = await loginTeacher(email, password)
    if (!result.success) return errorResponse(res, result.statusCode, result.message)
    return successResponse(res, result.statusCode, result.message, result.data)
})

// POST /api/teacher/add-student  (teacher only)
const createStudent = asyncHandler(async (req, res) => {
    const { name, email, password, class: studentClass, rollNumber } = req.body
    const result = await addStudent(name, email, password, studentClass, rollNumber)
    if (!result.success) return errorResponse(res, result.statusCode, result.message)
    return successResponse(res, result.statusCode, result.message, result.data)
})

module.exports = { login, createStudent }
