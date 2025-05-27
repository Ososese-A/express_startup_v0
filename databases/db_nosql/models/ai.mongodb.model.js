const mongoose = require("mongoose")

const financeAiQuestionSchema = new mongoose.Schema({
    question: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    answer: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    extras: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    }
}, {timestamps: true})

module.exports = mongoose.model("FinanceAiQuestion", financeAiQuestionSchema)