const jwt = require("jsonwebtoken")

/**
 * Generate a JWT token containing the user's id and role
 * @param {Object} user - Mongoose user document
 * @returns {string} signed JWT token
 */
const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    )
}

/**
 * Verify and decode a JWT token
 * @param {string} token
 * @returns {{ id: string, role: string }} decoded payload
 */
const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET)
}

module.exports = { generateToken, verifyToken }