const VideoClass = require("../Models/VideoClassModel")
const fs = require("fs")
const path = require("path")

// @desc    Upload a new video class
// @route   POST /api/videos/upload
// @access  Private (Teacher only)
const uploadVideo = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "Please upload a video file." })
        }

        const { title, description, className, subject } = req.body

        if (!title || !description || !className || !subject) {
            // Remove the uploaded file since validation failed
            fs.unlinkSync(req.file.path)
            return res.status(400).json({ success: false, message: "Please provide all required fields." })
        }

        // Construct video URL (relative path)
        const videoUrl = `/uploads/videos/${req.file.filename}`

        const videoClass = await VideoClass.create({
            title,
            description,
            className,
            subject,
            videoUrl,
            uploadedBy: req.user.id
        })

        res.status(201).json({
            success: true,
            data: videoClass,
            message: "Video uploaded successfully!"
        })
    } catch (error) {
        // Specifically catch multer error if we manually attach error.code inside multer error handler,
        // but here it's fine since we handle generic catch
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path)
        }
        next(error)
    }
}

// @desc    Get all video classes Filter via req.query
// @route   GET /api/videos
// @access  Private (Student & Teacher)
const getAllVideos = async (req, res, next) => {
    try {
        const { className, subject, search } = req.query
        
        let query = {}
        
        if (className) {
            query.className = className
        }
        
        if (subject) {
            query.subject = subject
        }
        
        if (search) {
            query.title = { $regex: search, $options: "i" }
        }

        const videos = await VideoClass.find(query)
            .populate("uploadedBy", "name email")
            .sort("-createdAt")

        res.status(200).json({
            success: true,
            count: videos.length,
            data: videos
        })
    } catch (error) {
        next(error)
    }
}

// @desc    Get videos uploaded by the logged-in teacher
// @route   GET /api/videos/my
// @access  Private (Teacher)
const getMyVideos = async (req, res, next) => {
    try {
        const videos = await VideoClass.find({ uploadedBy: req.user.id }).sort("-createdAt")
        res.status(200).json({
            success: true,
            count: videos.length,
            data: videos
        })
    } catch (error) {
        next(error)
    }
}

// @desc    Delete a video class
// @route   DELETE /api/videos/:id
// @access  Private (Teacher)
const deleteVideo = async (req, res, next) => {
    try {
        const video = await VideoClass.findById(req.params.id)

        if (!video) {
            return res.status(404).json({ success: false, message: "Video not found" })
        }

        // Make sure user is the video owner
        if (video.uploadedBy.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: "User not authorized to delete this video" })
        }

        // Delete the physical file synchronously
        const filePath = path.join(__dirname, "../../", video.videoUrl)
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath)
        }

        await video.deleteOne()

        res.status(200).json({ success: true, data: {} })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    uploadVideo,
    getAllVideos,
    getMyVideos,
    deleteVideo
}
