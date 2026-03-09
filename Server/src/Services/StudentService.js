const StudentModel = require("../Models/StudentModel")
const { hashPassword, comparePassword } = require("../Utils/passwordUtils")
const { generateToken } = require("../Utils/JwtUtils")
const { getRank, getLevel } = require("../Utils/rankUtils")
const { serviceOk, serviceFail } = require("../Utils/ResponseUtils")

const addStudent = async (name, email, password, studentClass, rollNumber) => {
    const existing = await StudentModel.findOne({ email })
    if (existing) return serviceFail(409, "Student with this email already exists")
    const hashed = await hashPassword(password)
    const student = await StudentModel.create({ name, email, password: hashed, class: studentClass, rollNumber })
    return serviceOk("Student created successfully", {
        id: student._id, name: student.name, email: student.email,
        class: student.class, rollNumber: student.rollNumber,
        totalScore: student.totalScore, completedLessons: [], level: student.level, role: "student"
    }, 201)
}

const loginStudent = async (email, password) => {
    const student = await StudentModel.findOne({ email }).select("+password")
    if (!student) return serviceFail(404, "Student not found")
    const isMatch = await comparePassword(password, student.password)
    if (!isMatch) return serviceFail(401, "Invalid credentials")

    // Handle login streak
    const now = new Date()
    const lastLogin = student.lastLogin ? new Date(student.lastLogin) : null
    let streakBonus = 0
    let newStreak = student.loginStreak || 0

    if (lastLogin) {
        const daysDiff = Math.floor((now - lastLogin) / (1000 * 60 * 60 * 24))
        if (daysDiff === 1) {
            // Consecutive day
            newStreak += 1
            if (newStreak % 7 === 0) streakBonus = 5 // Weekly bonus
        } else if (daysDiff > 1) {
            // Streak broken
            newStreak = 1
        }
    } else {
        // First login
        newStreak = 1
    }

    // Update student with new streak and lastLogin
    await StudentModel.findByIdAndUpdate(student._id, {
        lastLogin: now,
        loginStreak: newStreak,
        $inc: { totalScore: streakBonus }
    })

    // Check for badge awards
    const { checkAndAwardBadges } = require("./BadgeService")
    await checkAndAwardBadges(student._id)

    // Generate daily quests
    const { generateDailyQuests } = require("./DailyQuestService")
    await generateDailyQuests(student._id)

    // Fetch updated student
    const updatedStudent = await StudentModel.findById(student._id).populate('badges', 'name icon')

    const token = generateToken({ _id: student._id, role: "student" })
    const rank = getRank(updatedStudent.totalScore)
    const level = getLevel(updatedStudent.totalScore)
    return serviceOk("Login successful", {
        token,
        user: {
            id: updatedStudent._id, name: updatedStudent.name, email: updatedStudent.email,
            class: updatedStudent.class, rollNumber: updatedStudent.rollNumber,
            totalScore: updatedStudent.totalScore,
            completedLessons: updatedStudent.completedLessons.map(id => id.toString()),
            level: updatedStudent.level, rank, role: "student",
            badges: updatedStudent.badges,
            loginStreak: updatedStudent.loginStreak,
            levelInfo: level,
            coins: updatedStudent.coins,
            avatar: updatedStudent.avatar
        },
        streakBonus
    })
}

// GET /api/v1/student/profile — returns fresh profile including completedLessons
const getStudentProfile = async (studentId) => {
    const student = await StudentModel.findById(studentId).populate('badges', 'name icon')
    if (!student) return serviceFail(404, "Student not found")
    const rank = getRank(student.totalScore)
    const level = getLevel(student.totalScore)
    return serviceOk("Profile fetched", {
        id: student._id, name: student.name, email: student.email,
        class: student.class, rollNumber: student.rollNumber,
        totalScore: student.totalScore,
        completedLessons: student.completedLessons.map(id => id.toString()),
        level: student.level, rank, role: "student",
        badges: student.badges,
        loginStreak: student.loginStreak,
        levelInfo: level,
        coins: student.coins,
        avatar: student.avatar
    })
}


// Update avatar for student
const updateAvatar = async (studentId, avatar) => {
    const student = await StudentModel.findById(studentId)
    if (!student) return serviceFail(404, "Student not found")

    student.avatar = avatar
    await student.save()
    return serviceOk("Avatar updated", { avatar })
}

module.exports = { addStudent, loginStudent, getStudentProfile, updateAvatar }
