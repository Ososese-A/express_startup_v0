require("dotenv").config()
const express = require("express")
const logger = require("./middleware/logger.middleware")
const mongodbConnect = require("./databases/db_nosql/mongodb.connect")
const sampleRoute = require("./routes/sample.routes")
const aiFinanceRoute = require("./routes/question.ai.routes")
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())
app.use(logger)

app.use("/api/v1/sample", sampleRoute)
app.use("/api/v1/financeAi", aiFinanceRoute)

app.get("/", (req, res) => {
    res.json({msg: "Hello world"})
})

const PORT = 8080 || process.env.PORT
app.listen(PORT, () => {
    mongodbConnect()
    console.log(`Ready and listening at port: ${PORT}`)
})