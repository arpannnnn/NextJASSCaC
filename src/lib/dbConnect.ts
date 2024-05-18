import mongoose from "mongoose";
type connectionObject = {
    isConnected?: number
}
const connection: connectionObject = {}
async function dbConnect(): Promise<void> { //return is Promise<void chai what value is comming dont knw>
    if (connection.isConnected) {
        console.log("already connecteted to DB");
        return
    }
    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || '', {})
        connection.isConnected = db.connections[0].readyState
        console.log("db connected successfully")
    }
    catch (error) {
        console.log("DB connection fail", error)
        process.exit(1)

    }
}
export default dbConnect;