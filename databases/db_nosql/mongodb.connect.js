const mongoose = require("mongoose")
const { logToConsole } = require('../../utility/sample.utility')


const MAX_RETRIES = 5
const RETRY_DELAY = 5000

const mongodb_connect = async (retryCount = 0) => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
        logToConsole("MongoDB connect", `mongodb connected to: ${conn.connection.name}`)
    } catch (err) {
        logToConsole("MongoDB connect", err.message)
        if (retryCount < MAX_RETRIES) {
            logToConsole("MongoDB connect", `Retrying connection... Attempt ${retryCount + 1} of ${MAX_RETRIES}`)
            setTimeout(() => mongodb_connect(retryCount + 1), RETRY_DELAY)
        } else {
            logToConsole("MongoDB connect", "Max retries reached. Exiting...")
            process.exit(1)
        }
    }
}

module.exports = mongodb_connect