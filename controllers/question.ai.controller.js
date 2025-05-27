//rate and character limiting
const { validationResult, matchedData } = require("express-validator")
const { financeAi } = require("../services/ai/ai.service")
const { logToConsole } = require("../utility/sample.utility")
const FinanceAiQuestion = require("../databases/db_nosql/models/ai.mongodb.model")

const finSuggest = async (req, res) => {
    const errors = validationResult(req)
    
    if (!errors.isEmpty()) return res.status(400).json({success: false, msg: errors.array()})

    const data = matchedData(req)
    const question = data.question

    try {
        //find the user 

        //confirm if they exist

        const finQuestion = await financeAi(question)
        const answer = JSON.parse(finQuestion.message.content)
        const extras = {
            openAIID: finQuestion.id,
            model: finQuestion.model,
            createdTime: finQuestion.createdTime
        }

        const response = await FinanceAiQuestion.create({
            question,
            answer,
            extras
        })

        res.status(200).json({success: true, response})
    } catch (err) {
        logToConsole("Question AI controller", err.message)
        res.status(500).json({success: false, error: err.message})
    }
}

module.exports = {
    finSuggest
}