const { default: mongoose } = require("mongoose")
const DataInitializeService = require("../service/DataInitializeService")

// const url = "mongodb+srv://rajendradewangan2712_db_user:iohJjcswbJcJiEN5@cluster0.imgaojp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
const url = process.env.MONGO_URI

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(url)
    DataInitializeService.initializeAdminUser();
    console.log(`MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.log(`MongoDb Error: ${error}`)
  }
}


module.exports = connectDB




