// ─── HTTP layer helpers (used in controllers / error handler) ────────────────

const successResponse = (res, statusCode = 200, message = "Success", data = null) => {
    return res.status(statusCode).json({ success: true, statusCode, message, data })
}

const errorResponse = (res, statusCode = 500, message = "Internal Server Error", errors = null) => {
    return res.status(statusCode).json({ success: false, statusCode, message, errors })
}

// ─── Service layer helpers (used inside service files) ───────────────────────

/**
 * Return a successful service result — controllers can spread this directly.
 * @param {string} message
 * @param {*}      data
 * @param {number} statusCode  defaults to 200; use 201 for created resources
 */
const serviceOk = (message, data = null, statusCode = 200) => ({
    success: true,
    statusCode,
    message,
    data
})

/**
 * Return a failed service result — controllers forward this to errorResponse.
 * @param {number} statusCode
 * @param {string} message
 */
const serviceFail = (statusCode, message) => ({
    success: false,
    statusCode,
    message
})

module.exports = { successResponse, errorResponse, serviceOk, serviceFail }
