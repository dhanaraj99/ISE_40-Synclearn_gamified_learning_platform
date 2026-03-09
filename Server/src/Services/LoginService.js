const userModel = require("../Models/userModel")
const { comparePassword } = require("../Utils/passwordUtils")
const { generateToken } = require("../Utils/JwtUtils")
const { serviceOk, serviceFail } = require("../Utils/ResponseUtils")

const loginService = async (email, password) => {
    const user = await userModel.findOne({ email }).select("+password")
    if (!user) return serviceFail(404, "User not found")

    const isMatch = await comparePassword(password, user.password)
    if (!isMatch) return serviceFail(401, "Invalid credentials")

    const token = generateToken(user)
    return serviceOk("Login successful", {
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role }
    })
}

module.exports = loginService
