const { verifyToken } = require("../Utils/JwtUtils")

/**
 * Authenticate middleware — validates Bearer JWT and attaches req.user = { id, role }
 */
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ success: false, message: "No token provided" })
    }
    const token = authHeader.split(" ")[1]
    try {
        const decoded = verifyToken(token)
        req.user = { id: decoded.id, role: decoded.role }
        next()
    } catch (err) {
        return res.status(401).json({ success: false, message: "Invalid or expired token" })
    }
}

/**
 * Role guard middleware factory — call as authorizeRoles("admin") or authorizeRoles("admin","teacher")
 * Must be used AFTER authenticate
 */
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Access denied. Required role(s): ${roles.join(", ")}`
            })
        }
        next()
    }
}

module.exports = { authenticate, authorizeRoles }
