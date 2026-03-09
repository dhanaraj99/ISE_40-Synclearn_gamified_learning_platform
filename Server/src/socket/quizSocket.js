const jwt = require("jsonwebtoken");
const QuizModel = require("../Models/QuizModel");

// Store active matchmaking queues and active games
// In a production app, use Redis. For this MVP, we use memory.
const queue = [];
const activeGames = {}; // roomId -> gameData (players, scores, quizId)
const userSockets = {}; // userId -> socketId (for cleanup/reconnecting)

const initializeSocket = (io) => {

    // Middleware: Authenticate socket connections using JWT
    io.use((socket, next) => {
        const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(' ')[1];
        if (!token) {
            return next(new Error("Authentication error: No token provided"));
        }
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.user = decoded; // { id, role, ... }
            next();
        } catch (err) {
            next(new Error("Authentication error: Invalid token"));
        }
    });

    io.on("connection", (socket) => {
        console.log(`[Socket] User connected: ${socket.user.id} (${socket.user.role})`);
        userSockets[socket.user.id] = socket.id;

        // --- MATCHMAKING ---
        socket.on("join_match", async ({ quizId }) => {
            if (!quizId) return socket.emit("error_msg", "Quiz ID is required to match.");
            if (socket.user.role !== "student") return socket.emit("error_msg", "Only students can duel.");

            // Check if player is already in queue or a game
            const existingId = queue.findIndex(q => q.userId === socket.user.id);
            if (existingId !== -1) queue.splice(existingId, 1); // remove from old queue 

            // Find an opponent waiting for the SAME quiz
            const opponentIndex = queue.findIndex(q => q.quizId === quizId && q.userId !== socket.user.id);

            if (opponentIndex !== -1) {
                // Opponent found!
                const opponent = queue.splice(opponentIndex, 1)[0];
                const roomId = `duel_${Date.now()}_${Math.random().toString(36).substring(7)}`;

                // Create the game state
                activeGames[roomId] = {
                    quizId,
                    players: {
                        [socket.user.id]: { score: 0, answers: [] },
                        [opponent.userId]: { score: 0, answers: [] }
                    }
                };

                // Add both sockets to the room
                socket.join(roomId);
                const opponentSocket = io.sockets.sockets.get(opponent.socketId);
                if (opponentSocket) opponentSocket.join(roomId);

                // Initialize scores
                io.to(roomId).emit("match_found", {
                    roomId,
                    players: [socket.user.id, opponent.userId],
                    message: "Match started!"
                });
                io.to(roomId).emit("update_score", activeGames[roomId].players);

                // Track roomId on the socket for easy cleanup
                socket.roomId = roomId;
                if (opponentSocket) opponentSocket.roomId = roomId;

            } else {
                // No opponent, add to queue
                queue.push({ userId: socket.user.id, socketId: socket.id, quizId });
                socket.emit("queue_status", { status: "waiting", message: "Searching for opponent..." });
            }
        });

        // --- GAMEPLAY ---
        socket.on("send_answer", async ({ roomId, questionIndex, selectedOption }) => {
            const game = activeGames[roomId];
            if (!game) return socket.emit("error_msg", "Game not found.");

            const playerState = game.players[socket.user.id];
            if (!playerState) return socket.emit("error_msg", "You are not in this game.");

            // To prevent multiple answers for the same question
            if (playerState.answers[questionIndex] !== undefined) {
                return socket.emit("error_msg", "You already answered this question.");
            }

            try {
                // Fetch the actual quiz to check the correct answer securely on the backend
                const quiz = await QuizModel.findById(game.quizId).lean();
                if (!quiz) return socket.emit("error_msg", "Quiz not found.");

                const question = quiz.questions[questionIndex];
                if (!question) return socket.emit("error_msg", "Invalid question index.");

                // Record answer
                playerState.answers[questionIndex] = selectedOption;

                // Check correct answer
                if (question.correctAns === selectedOption) {
                    playerState.score += 1; // Or +20 if doing percentage

                    // Broadcast updated scores to BOTH players
                    io.to(roomId).emit("update_score", game.players);
                }

            } catch (err) {
                console.error("[Socket] send_answer error:", err);
            }
        });

        // --- DISCONNECT ---
        socket.on("disconnect", () => {
            console.log(`[Socket] User disconnected: ${socket.user.id}`);
            delete userSockets[socket.user.id];

            // Remove from queue if waiting
            const qIndex = queue.findIndex(q => q.socketId === socket.id);
            if (qIndex !== -1) queue.splice(qIndex, 1);

            // Handle abandoning a game
            if (socket.roomId && activeGames[socket.roomId]) {
                const game = activeGames[socket.roomId];
                // Notify the other player
                socket.to(socket.roomId).emit("opponent_disconnected", "Your opponent left the duel.");
                // Cleanup game
                delete activeGames[socket.roomId];
            }
        });
    });
};

module.exports = initializeSocket;
