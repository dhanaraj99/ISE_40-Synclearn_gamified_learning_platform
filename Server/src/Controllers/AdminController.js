const asyncHandler = require("../Utils/catchAsync")
const { successResponse, errorResponse } = require("../Utils/ResponseUtils")
const { addAdmin, loginAdmin, getAllTeachers, getAllStudents } = require("../Services/AdminService")
const { addTeacher } = require("../Services/TeacherService")
const { addStudent } = require("../Services/StudentService")

// POST /api/v1/admin/register
const registerAdmin = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body
    const result = await addAdmin(name, email, password)
    if (!result.success) return errorResponse(res, result.statusCode, result.message)
    return successResponse(res, result.statusCode, result.message, result.data)
})

// POST /api/v1/admin/login
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    const result = await loginAdmin(email, password)
    if (!result.success) return errorResponse(res, result.statusCode, result.message)
    return successResponse(res, result.statusCode, result.message, result.data)
})

// POST /api/v1/admin/add-teacher  (admin only)
const createTeacher = asyncHandler(async (req, res) => {
    const { name, email, password, classes, subject } = req.body
    const result = await addTeacher(name, email, password, classes, subject)
    if (!result.success) return errorResponse(res, result.statusCode, result.message)
    return successResponse(res, result.statusCode, result.message, result.data)
})

// POST /api/v1/admin/add-student  (admin only)
const createStudent = asyncHandler(async (req, res) => {
    const { name, email, password, class: studentClass, rollNumber } = req.body
    const result = await addStudent(name, email, password, studentClass, rollNumber)
    if (!result.success) return errorResponse(res, result.statusCode, result.message)
    return successResponse(res, result.statusCode, result.message, result.data)
})

// GET /api/v1/admin/teachers  (admin only)
const listTeachers = asyncHandler(async (req, res) => {
    const result = await getAllTeachers()
    return successResponse(res, result.statusCode, result.message, result.data)
})

// GET /api/v1/admin/students  (admin only)
const listStudents = asyncHandler(async (req, res) => {
    const result = await getAllStudents()
    return successResponse(res, result.statusCode, result.message, result.data)
})

module.exports = { registerAdmin, login, createTeacher, createStudent, listTeachers, listStudents }