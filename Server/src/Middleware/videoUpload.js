const multer = require("multer")
const path = require("path")
const fs = require("fs")

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "../../uploads/videos")
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
}

// Multer config
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir)
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + "-" + file.originalname.replace(/\s+/g, "_"))
    }
})

// File filter for videos
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ["video/mp4", "video/webm", "video/quicktime"] // quicktime is .mov
    
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(new Error("Invalid file type. Only mp4, webm and mov video files are allowed."), false)
    }
}

// Init upload
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 50 * 1024 * 1024 // 50 MB
    },
    fileFilter: fileFilter
})

module.exports = upload
