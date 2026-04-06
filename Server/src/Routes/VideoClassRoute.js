const express = require("express")
const { uploadVideo, getAllVideos, getMyVideos, deleteVideo } = require("../Controllers/VideoClassController")
const { authenticate, authorizeRoles } = require("../Middleware/authMiddleware")
const upload = require("../Middleware/videoUpload")
const multer = require("multer")

const router = express.Router()

// Custom error handling for multer inside the route
const uploadMiddleware = (req, res, next) => {
    upload.single("video")(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading.
            return res.status(400).json({ success: false, message: err.message })
        } else if (err) {
            // An unknown error occurred when uploading.
            return res.status(400).json({ success: false, message: err.message })
        }
        // Everything went fine.
        next()
    })
}

// Upload a new video
// Only teachers can upload
router.post(
    "/upload",
    authenticate,
    authorizeRoles("teacher"),
    uploadMiddleware,
    uploadVideo
)

// Get all videos uploaded by the logged-in teacher
router.get(
    "/my",
    authenticate,
    authorizeRoles("teacher"),
    getMyVideos
)

// Delete a video
// Only teachers can delete
router.delete(
    "/:id",
    authenticate,
    authorizeRoles("teacher"),
    deleteVideo
)

// Get all videos with optional filters
// Anyone logged in can view
router.get(
    "/",
    authenticate,
    getAllVideos
)

module.exports = router
