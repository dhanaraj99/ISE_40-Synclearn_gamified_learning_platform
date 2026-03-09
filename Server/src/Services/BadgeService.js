const BadgeModel = require("../Models/BadgeModel")
const StudentBadgeModel = require("../Models/StudentBadgeModel")
const StudentModel = require("../Models/StudentModel")
const { serviceOk, serviceFail } = require("../Utils/ResponseUtils")

// Create a new badge (admin only)
const createBadge = async (name, description, icon, criteria, xpReward = 0) => {
    const existing = await BadgeModel.findOne({ name })
    if (existing) return serviceFail(409, "Badge with this name already exists")

    const badge = await BadgeModel.create({ name, description, icon, criteria, xpReward })
    return serviceOk("Badge created", badge, 201)
}

// Get all badges
const getAllBadges = async () => {
    const badges = await BadgeModel.find()
    return serviceOk("Badges fetched", badges)
}

// Award badge to student if not already awarded
const awardBadge = async (studentId, badgeId) => {
    const student = await StudentModel.findById(studentId)
    if (!student) return serviceFail(404, "Student not found")

    const badge = await BadgeModel.findById(badgeId)
    if (!badge) return serviceFail(404, "Badge not found")

    // Check if already awarded
    const existing = await StudentBadgeModel.findOne({ studentId, badgeId })
    if (existing) return serviceFail(409, "Badge already awarded to this student")

    // Award badge
    await StudentBadgeModel.create({ studentId, badgeId })

    // Add to student's badges array and award XP
    await StudentModel.findByIdAndUpdate(studentId, {
        $push: { badges: badgeId },
        $inc: { totalScore: badge.xpReward }
    })

    return serviceOk("Badge awarded", { badge, xpReward: badge.xpReward })
}

// Get student's badges
const getStudentBadges = async (studentId) => {
    const student = await StudentModel.findById(studentId).populate('badges')
    if (!student) return serviceFail(404, "Student not found")

    return serviceOk("Student badges fetched", student.badges)
}

// Check and award badges based on criteria (call after quiz submission or login)
const checkAndAwardBadges = async (studentId) => {
    const student = await StudentModel.findById(studentId).populate('completedLessons')
    if (!student) return serviceFail(404, "Student not found")

    const badges = await BadgeModel.find()
    const awarded = []

    for (const badge of badges) {
        // Skip if already has this badge
        if (student.badges.includes(badge._id)) continue

        let shouldAward = false

        switch (badge.criteria) {
            case 'first_quiz':
                shouldAward = student.completedLessons.length >= 1
                break
            case 'five_lessons':
                shouldAward = student.completedLessons.length >= 5
                break
            case 'perfect_score':
                // Check if has a perfect quiz attempt
                const QuizAttemptModel = require("../Models/QuizAttemptModel")
                const perfectAttempt = await QuizAttemptModel.findOne({ studentId, score: 5 })
                shouldAward = !!perfectAttempt
                break
            case 'login_streak_7':
                shouldAward = student.loginStreak >= 7
                break
            // Add more criteria as needed
        }

        if (shouldAward) {
            const result = await awardBadge(studentId, badge._id)
            if (result.success) awarded.push(result.data)
        }
    }

    return serviceOk("Badge check completed", awarded)
}

module.exports = { createBadge, getAllBadges, awardBadge, getStudentBadges, checkAndAwardBadges }