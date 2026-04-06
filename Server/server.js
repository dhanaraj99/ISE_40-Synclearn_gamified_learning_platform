//configure dotenv
const dotenv = require("dotenv")
dotenv.config()
const PORT = process.env.PORT || 8000
//import app and dbConfig
const app = require("./src/app")
const connectDB = require("./src/Config/dbConfig")
const http = require("http")
const { Server } = require("socket.io")
const initializeSocket = require("./src/socket/quizSocket")

connectDB()

// Seed initial badges
const seedBadges = async () => {
    const BadgeModel = require("./src/Models/BadgeModel")
    const badges = [
        { name: "First Quiz", description: "Completed your first quiz", icon: "🎯", criteria: "first_quiz", xpReward: 5 },
        { name: "Lesson Master", description: "Completed 5 lessons", icon: "📚", criteria: "five_lessons", xpReward: 10 },
        { name: "Perfect Score", description: "Got a perfect 5/5 on a quiz", icon: "⭐", criteria: "perfect_score", xpReward: 15 },
        { name: "Streak Champion", description: "7-day login streak", icon: "🔥", criteria: "login_streak_7", xpReward: 20 }
    ]
    for (const badge of badges) {
        await BadgeModel.findOneAndUpdate(
            { name: badge.name },
            badge,
            { upsert: true, returnDocument: "after" }
        )
    }
    console.log("Badges seeded")
}
seedBadges()

const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: "*", // Adjust in production
        methods: ["GET", "POST"]
    }
})

initializeSocket(io)

server.listen(PORT, () => console.log(`Server running on port ${PORT}`))