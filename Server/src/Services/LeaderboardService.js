const StudentModel = require("../Models/StudentModel")
const { serviceOk } = require("../Utils/ResponseUtils")

// Get top students by totalScore
const getLeaderboard = async (limit = 10, classFilter = null) => {
    const query = classFilter ? { class: classFilter } : {}
    const students = await StudentModel.find(query)
        .select('name class rollNumber totalScore level badges avatar')
        .populate('badges', 'name icon')
        .sort({ totalScore: -1 })
        .limit(limit)

    return serviceOk("Leaderboard fetched", students)
}

// Get student's rank
const getStudentRank = async (studentId) => {
    const student = await StudentModel.findById(studentId)
    if (!student) return { success: false, message: "Student not found" }

    // Count students with higher score
    const higherScoreCount = await StudentModel.countDocuments({
        totalScore: { $gt: student.totalScore }
    })

    const rank = higherScoreCount + 1

    return serviceOk("Student rank fetched", { rank, totalScore: student.totalScore })
}

module.exports = { getLeaderboard, getStudentRank }