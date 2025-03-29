require("dotenv").config()
const express = require("express")
const logger = require("./middleware/loggerMiddleware")

const app = express()

app.use(express.json())
app.use(logger)

app.get("/", (req, res) => {
    res.json({msg: "Hello world"})
})

const PORT = 8080 || process.env.PORT
app.listen(PORT, () => {
    console.log(`Ready and listening at port: ${PORT}`)
})