const OpenAI = require('openai')
const { logToConsole } = require('../utility/sample.utility')

module.exports = {
    questionAi: async (question) => {
        const openai = new OpenAI({
            apiKey: process.env.OPAI_KEY
        })

        const instructions = "When I say hello you say hello yoo bro yoo"

        try {
            const completion = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                store: true,
                messages: [
                    {
                        "role": "system",
                        "content": instructions
                    },

                    {
                        "role": "user",
                        "content": question
                    }
                ]
            })

            const aiResponse = completion.choices[0].message
            console.log(aiResponse)
            return aiResponse

        } catch (err) {
            logToConsole("Sample service question AI", err.message)
            throw new Error(err.message)
        }
    }
}