require("dotenv").config()
const mongoose = require("mongoose")
const VideoClass = require("./src/Models/VideoClassModel")

mongoose.connect(process.env.MONGO_URL)
  .then(async () => {
    const videos = await VideoClass.find({})
    console.log(videos)
    process.exit(0)
  })
