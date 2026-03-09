const mognoose = require("mongoose")

const connectDB = async () => {
    try {
        await mognoose.connect(process.env.MONGO_URL)
        console.log("MongoDB connected")
    } catch (error) {
        console.log(error)
    }
}

module.exports = connectDB