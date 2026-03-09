const userModel = require("../Models/userModel")
const { hashPassword } = require("../Utils/passwordUtils")
const { serviceOk, serviceFail } = require("../Utils/ResponseUtils")

const addAdminService = async (name, email, password) => {
    const existing = await userModel.findOne({ email })
    if (existing) return serviceFail(409, "User with this email already exists")

    const hashedPassword = await hashPassword(password)
    const newUser = await userModel.create({ name, email, password: hashedPassword, role: "admin" })
    return serviceOk("Admin added successfully", { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role }, 201)
}

module.exports = addAdminService