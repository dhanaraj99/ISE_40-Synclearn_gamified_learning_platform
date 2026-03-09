const AdminModel = require("../Models/AdminModel")
const TeacherModel = require("../Models/TeacherModel")
const StudentModel = require("../Models/StudentModel")
const { hashPassword, comparePassword } = require("../Utils/passwordUtils")
const { generateToken } = require("../Utils/JwtUtils")
const { serviceOk, serviceFail } = require("../Utils/ResponseUtils")

const addAdmin = async (name, email, password) => {
    const existing = await AdminModel.findOne({ email })
    if (existing) return serviceFail(409, "Admin with this email already exists")
    const hashed = await hashPassword(password)
    const admin = await AdminModel.create({ name, email, password: hashed })
    return serviceOk("Admin created successfully", { id: admin._id, name: admin.name, email: admin.email, role: "admin" }, 201)
}

const loginAdmin = async (email, password) => {
    const admin = await AdminModel.findOne({ email }).select("+password")
    if (!admin) return serviceFail(404, "Admin not found")
    const isMatch = await comparePassword(password, admin.password)
    if (!isMatch) return serviceFail(401, "Invalid credentials")
    const token = generateToken({ _id: admin._id, role: "admin" })
    return serviceOk("Login successful", { token, user: { id: admin._id, name: admin.name, email: admin.email, role: "admin" } })
}

// Get all teachers (list view, no passwords)
const getAllTeachers = async () => {
    const teachers = await TeacherModel.find().select("-password").sort({ createdAt: -1 })
    return serviceOk("Teachers fetched", teachers)
}

// Get all students (list view, no passwords)
const getAllStudents = async () => {
    const students = await StudentModel.find().select("-password").sort({ createdAt: -1 })
    return serviceOk("Students fetched", students)
}

module.exports = { addAdmin, loginAdmin, getAllTeachers, getAllStudents }
