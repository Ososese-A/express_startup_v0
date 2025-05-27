const OpenAI = require('openai')
const { logToConsole } = require('../../utility/sample.utility')
const path = require('path')
const fs = require('fs/promises')

module.exports = {
    financeAi: async (question) => {
        const openai = new OpenAI({
            apiKey: process.env.OPAI_KEY
        })

        const promptsPath = path.join(__dirname, "prompts")
        const samplePrompt = path.join(promptsPath, "prompt.txt")

        const prompt = await fs.readFile(samplePrompt, "utf8")

        const instructions = prompt

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

            const aiResponse = {
                id: completion.id,
                model: completion.model,
                message: completion.choices[0].message,
                createdTime: completion.created
            }
            console.log("From the AI service")
            console.log(completion.id)
            console.log(completion.created)
            console.log(completion.model)
            console.log(aiResponse)
            return aiResponse

        } catch (err) {
            logToConsole("Sample service question AI", err.message)
            throw new Error(err.message)
        }
    }
}