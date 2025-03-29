import dotenv from "dotenv"
dotenv.config()
import express from "express"
import logger from "./middleware/loggerMiddleware.mjs"


const app = express()

app.use(express.json())
app.use(logger)

app.get("/", (req, res) => {
    res.json({msg: "Hello world"})
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Ready and listening at port: ${PORT}`)
})