const DailyQuestModel = require("../Models/DailyQuestModel")
const StudentModel = require("../Models/StudentModel")
const { serviceOk, serviceFail } = require("../Utils/ResponseUtils")

// Generate daily quests for a student
const generateDailyQuests = async (studentId) => {
    const today = new Date().toISOString().split('T')[0]
    const existing = await DailyQuestModel.find({ studentId, date: today })

    if (existing.length > 0) return serviceOk("Quests already generated", existing)

    const quests = [
        { questType: 'login', description: 'Log in to SyncLearn', xpReward: 5 },
        { questType: 'quiz_complete', description: 'Complete 1 quiz', xpReward: 10 },
        { questType: 'lesson_read', description: 'Read 1 lesson', xpReward: 5 }
    ]

    const createdQuests = []
    for (const quest of quests) {
        const newQuest = await DailyQuestModel.create({ studentId, ...quest, date: today })
        createdQuests.push(newQuest)
    }

    return serviceOk("Daily quests generated", createdQuests)
}

// Get today's quests for a student
const getDailyQuests = async (studentId) => {
    const today = new Date().toISOString().split('T')[0]
    const quests = await DailyQuestModel.find({ studentId, date: today })
    return serviceOk("Daily quests fetched", quests)
}

// Complete a quest and award XP
const completeQuest = async (studentId, questId) => {
    const quest = await DailyQuestModel.findById(questId)
    if (!quest || quest.studentId.toString() !== studentId || quest.isCompleted) {
        return serviceFail(400, "Invalid quest or already completed")
    }

    quest.isCompleted = true
    await quest.save()

    // Award XP
    await StudentModel.findByIdAndUpdate(studentId, {
        $inc: { totalScore: quest.xpReward }
    })

    return serviceOk("Quest completed", { quest, xpReward: quest.xpReward })
}

// Auto-complete quests based on actions
const checkAndCompleteQuests = async (studentId, actionType) => {
    const today = new Date().toISOString().split('T')[0]
    const quests = await DailyQuestModel.find({ studentId, date: today, questType: actionType, isCompleted: false })

    const completed = []
    for (const quest of quests) {
        const result = await completeQuest(studentId, quest._id)
        if (result.success) completed.push(result.data)
    }

    return serviceOk("Quests checked", completed)
}

module.exports = { generateDailyQuests, getDailyQuests, completeQuest, checkAndCompleteQuests }