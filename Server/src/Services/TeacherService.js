const TeacherModel = require("../Models/TeacherModel")
const { hashPassword, comparePassword } = require("../Utils/passwordUtils")
const { generateToken } = require("../Utils/JwtUtils")
const { serviceOk, serviceFail } = require("../Utils/ResponseUtils")

const addTeacher = async (name, email, password, classes, subject) => {
    const existing = await TeacherModel.findOne({ email })
    if (existing) return serviceFail(409, "Teacher with this email already exists")
    const hashed = await hashPassword(password)
    const teacher = await TeacherModel.create({ name, email, password: hashed, classes, subject })
    return serviceOk("Teacher created successfully", {
        id: teacher._id, name: teacher.name, email: teacher.email,
        classes: teacher.classes, subject: teacher.subject, role: "teacher"
    }, 201)
}

const loginTeacher = async (email, password) => {
    const teacher = await TeacherModel.findOne({ email }).select("+password")
    if (!teacher) return serviceFail(404, "Teacher not found")
    const isMatch = await comparePassword(password, teacher.password)
    if (!isMatch) return serviceFail(401, "Invalid credentials")
    const token = generateToken({ _id: teacher._id, role: "teacher" })
    return serviceOk("Login successful", {
        token,
        user: { id: teacher._id, name: teacher.name, email: teacher.email, classes: teacher.classes, subject: teacher.subject, role: "teacher" }
    })
}

module.exports = { addTeacher, loginTeacher }
