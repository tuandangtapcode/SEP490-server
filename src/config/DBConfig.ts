import mongoose from "mongoose"
import * as dotenv from "dotenv"
dotenv.config()

const db_user_name = process.env.DATABASE_USERNAME
const db_password = process.env.DATABASE_PASSWORD
const db_port = process.env.DATABASE_PORT
const db_name = process.env.DATABASE_NAME

const connect = async () => {
  try {
    await mongoose.connect(`mongodb://${db_user_name}:${db_password}@${db_port}:27017/${db_name}`)
    console.log("Connect successfully!!")
  } catch (error) {
    console.log("Connect failures!!")
  }
}

export default connect
