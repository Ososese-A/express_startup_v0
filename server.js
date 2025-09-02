require("dotenv").config()
const express = require("express")
const logger = require("./middleware/logger.middleware")
const mongodbConnect = require("./databases/db_nosql/mongodb.connect")
const sampleRoute = require("./routes/sample.routes")
const aiFinanceRoute = require("./routes/question.ai.routes")
const authRoute = require("./routes/auth.route")
const oauthRoute = require("./routes/oauth.route")
const paymentRoute = require("./routes/payment.route")
const viewsRoute = require("./routes/test.views.routes")
const cors = require('cors')
const githubPassport = require('./configs/oauth_strategies/github.strategy.config')
const oauthMiddleware = require("./middleware/oauth.middleware")

const app = express()

app.use(cors())
app.use(express.json())
app.use(logger)

app.use(githubPassport.initialize())

app.use("/api/v1/sample", sampleRoute)
app.use("/api/v1/financeAi", aiFinanceRoute)
app.use("/api/v1/auth/", authRoute)
app.use("/api/v1/oauth/", oauthRoute)
app.use("/api/v1/payment/", paymentRoute)

app.use("/api/v1/test/views", viewsRoute)

app.get("/home", (req, res) => {
    res.json({msg: "Hello world"})
})

app.get("/dashboard", oauthMiddleware,  (req, res) => {
    console.log("from the dashboard")
    console.log(req.user)
    res.status(200).json({msg: `This is the user ${req.user.userId}`})
})

const PORT = 8080 || process.env.PORT
app.listen(PORT, () => {
    mongodbConnect()
    console.log(`Ready and listening at port: ${PORT}`)
})