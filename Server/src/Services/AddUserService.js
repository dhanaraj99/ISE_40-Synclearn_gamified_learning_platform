const userModel = require("../Models/userModel")
const { hashPassword } = require("../Utils/passwordUtils")
const { serviceOk, serviceFail } = require("../Utils/ResponseUtils")

/**
 * Generic service to add a user with any role.
 * @param {string} name
 * @param {string} email
 * @param {string} password
 * @param {"admin"|"teacher"|"student"} role
 * @param {Object} extraFields - role-specific fields
 */
const addUserService = async (name, email, password, role, extraFields = {}) => {
    const existing = await userModel.findOne({ email })
    if (existing) return serviceFail(409, "User with this email already exists")

    const hashedPassword = await hashPassword(password)
    const newUser = await userModel.create({ name, email, password: hashedPassword, role, ...extraFields })

    const roleName = role.charAt(0).toUpperCase() + role.slice(1)
    return serviceOk(`${roleName} added successfully`, {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        ...extraFields
    }, 201)
}

module.exports = addUserService
