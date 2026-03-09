const AnnouncementModel = require("../Models/AnnouncementModel")
const { serviceOk, serviceFail } = require("../Utils/ResponseUtils")

// Admin broadcasts a site-wide announcement
const createAnnouncement = async (title, message, adminId) => {
    const announcement = await AnnouncementModel.create({ title, message, adminId })
    return serviceOk("Announcement published", announcement, 201)
}

// Get all announcements (newest first)
const getAllAnnouncements = async () => {
    const announcements = await AnnouncementModel.find()
        .populate("adminId", "name")
        .sort({ createdAt: -1 })
    return serviceOk("Announcements fetched", announcements)
}

// Delete an announcement
const deleteAnnouncement = async (id) => {
    const found = await AnnouncementModel.findByIdAndDelete(id)
    if (!found) return serviceFail(404, "Announcement not found")
    return serviceOk("Announcement deleted")
}

module.exports = { createAnnouncement, getAllAnnouncements, deleteAnnouncement }
