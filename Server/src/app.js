const express = require("express")
const cors = require("cors")
const app = express()
app.use(cors())
app.use(express.json())

const baseUrl = process.env.BASE_URL || "/api/"

// ─── Existing Routes ─────────────────────────────────────────────────────────
app.use(`${baseUrl}admin`, require("./Routes/AdminRoute"))
app.use(`${baseUrl}teacher`, require("./Routes/TeacherRoute"))
app.use(`${baseUrl}student`, require("./Routes/StudentRoute"))

// ─── Mission & Quiz Routes ────────────────────────────────────────────────────
app.use(`${baseUrl}lesson`, require("./Routes/LessonRoute"))
app.use(`${baseUrl}quiz`, require("./Routes/QuizRoute"))
app.use(`${baseUrl}announcement`, require("./Routes/AnnouncementRoute"))
app.use(`${baseUrl}badge`, require("./Routes/BadgeRoute"))
app.use(`${baseUrl}leaderboard`, require("./Routes/LeaderboardRoute"))
app.use(`${baseUrl}daily-quests`, require("./Routes/DailyQuestRoute"))
app.use(`${baseUrl}tournament`, require("./Routes/TournamentRoute"))

// Global error handler — must be LAST
app.use(require("./Middleware/errorHandler"))

module.exports = app