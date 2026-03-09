const { errorResponse } = require("../Utils/ResponseUtils")

/**
 * Global error handler — must be registered LAST in app.js (4-arg middleware)
 * Catches anything forwarded via next(err) or thrown inside asyncHandler
 */
const errorHandler = (err, req, res, next) => {
    console.error(`[ERROR] ${req.method} ${req.originalUrl} →`, err.message || err)

    // Mongoose validation error
    if (err.name === "ValidationError") {
        const errors = Object.values(err.errors).map((e) => e.message)
        return errorResponse(res, 400, "Validation failed", errors)
    }

    // Mongoose duplicate key (e.g. unique email)
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0]
        return errorResponse(res, 409, `Duplicate value for field: ${field}`)
    }

    // JWT errors (propagated from authMiddleware if someone re-throws)
    if (err.name === "JsonWebTokenError") {
        return errorResponse(res, 401, "Invalid token")
    }
    if (err.name === "TokenExpiredError") {
        return errorResponse(res, 401, "Token expired")
    }

    // Generic fallback
    const statusCode = err.statusCode || 500
    const message = err.message || "Internal Server Error"
    return errorResponse(res, statusCode, message)
}

module.exports = errorHandler
