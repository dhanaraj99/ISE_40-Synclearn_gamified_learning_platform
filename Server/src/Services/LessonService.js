const mongoose = require("mongoose")
const LessonModel = require("../Models/LessonModel")
const QuizAttemptModel = require("../Models/QuizAttemptModel")
const { serviceOk, serviceFail } = require("../Utils/ResponseUtils")

// Create a new lesson
const createLesson = async (title, content, category, teacherId, isPublished = false, sequenceOrder = 0, isBounty = false) => {
    const lesson = await LessonModel.create({ title, content, category, teacherId, isPublished, sequenceOrder, isBounty })
    return serviceOk("Lesson created successfully", lesson, 201)
}

// Get all active lessons (populate teacher name)
const getAllLessons = async (role, studentId) => {
    const filter = { isActive: true }
    if (role === "student") {
        filter.isPublished = true
    }
    const lessons = await LessonModel.find(filter)
        .populate("teacherId", "name subject")
        .sort({ sequenceOrder: 1, createdAt: -1 })
        .lean()

    if (role === "student" && studentId) {
        // Fetch all quiz attempts for this student to calculate locks
        const attempts = await QuizAttemptModel.find({ studentId }).lean()

        let previousLessonPassed = true; // The first in sequence is always unlocked

        for (let i = 0; i < lessons.length; i++) {
            const lesson = lessons[i];

            // Bypass logic for bounty lessons if needed, or keep standard sequence
            lesson.isLocked = !previousLessonPassed;

            // Check if the student passed THIS lesson to unlock the NEXT one
            // We need to find the quiz attempt for this lesson. Since we lack direct Quiz->Lesson mapping in Attempt,
            // we will need to aggregate or look it up. Alternatively, since Quiz has lessonId, we can look up Quizzes.
            // Wait, QuizAttempt schema: quizId. Quiz schema: lessonId.
            // This is slightly complex, so let's simplify by fetching quests/quizzes.

            // For now, let's look up the quiz for this lesson
            const QuizModel = require("../Models/QuizModel");
            const lessonQuiz = await QuizModel.findOne({ lessonId: lesson._id }).lean();

            let passedThisLesson = false;
            if (lessonQuiz) {
                const attempt = attempts.find(a => a.quizId.toString() === lessonQuiz._id.toString());
                if (attempt && attempt.score >= 4) { // 80% of 5
                    passedThisLesson = true;
                }
            } else {
                // If no quiz exists for this lesson, we can consider it auto-passed to unlock the next
                passedThisLesson = true;
            }

            // If the current lesson was not passed, the next one in sequence is locked
            if (!passedThisLesson) {
                previousLessonPassed = false;
            }
        }
    }

    return serviceOk("Lessons fetched", lessons)
}

// Get single lesson by ID
const getLessonById = async (id, role, studentId) => {
    const filter = { _id: id }
    if (role === "student") {
        filter.isPublished = true
        filter.isActive = true
    }

    // We reuse the list logic to ensure we get the correct isLocked status
    if (role === "student") {
        const allResult = await getAllLessons(role, studentId);
        if (!allResult.success) return allResult;

        const lesson = allResult.data.find(l => l._id.toString() === id);
        if (!lesson) return serviceFail(404, "Lesson not found or unavailable");
        return serviceOk("Lesson fetched", lesson);
    } else {
        const lesson = await LessonModel.findOne(filter).populate("teacherId", "name subject").lean()
        if (!lesson) return serviceFail(404, "Lesson not found")
        return serviceOk("Lesson fetched", lesson)
    }
}

// Update lesson — only the teacher who created it or admin
const updateLesson = async (id, userId, role, updates) => {
    const lesson = await LessonModel.findById(id)
    if (!lesson) return serviceFail(404, "Lesson not found")
    if (role !== "admin" && lesson.teacherId.toString() !== userId) {
        return serviceFail(403, "You can only edit your own lessons")
    }

    // Only allow specific fields to be updated
    const allowedUpdates = {};
    if (updates.title !== undefined) allowedUpdates.title = updates.title;
    if (updates.content !== undefined) allowedUpdates.content = updates.content;
    if (updates.category !== undefined) allowedUpdates.category = updates.category;
    if (updates.isPublished !== undefined) allowedUpdates.isPublished = updates.isPublished;
    if (updates.sequenceOrder !== undefined) allowedUpdates.sequenceOrder = updates.sequenceOrder;
    if (updates.isBounty !== undefined) allowedUpdates.isBounty = updates.isBounty;

    const updated = await LessonModel.findByIdAndUpdate(id, allowedUpdates, { new: true })
    return serviceOk("Lesson updated", updated)
}

// Delete lesson
const deleteLesson = async (id, userId, role) => {
    const lesson = await LessonModel.findById(id)
    if (!lesson) return serviceFail(404, "Lesson not found")
    if (role !== "admin" && lesson.teacherId.toString() !== userId) {
        return serviceFail(403, "You can only delete your own lessons")
    }
    await LessonModel.findByIdAndDelete(id)
    return serviceOk("Lesson deleted")
}

module.exports = { createLesson, getAllLessons, getLessonById, updateLesson, deleteLesson }
