const nodemailer = require('nodemailer')
const path = require("path")
const { logToConsole } = require('../../utility/sample.utility')
const { getEmailTemplate } = require('../../utility/getEmailTemplate.utility')

module.exports = {
    emailService: async (receiver, content) => {

        if (!receiver || !content) {
            throw new Error("Receiver and content is missing but they are required")
        }

        const templateDirPath = path.join(__dirname, "templates")
        const templatePath = path.join(templateDirPath, "sample.template.hbs")

        try {
            const transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: process.env.SMTP_PORT,
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASSWORD
                }
            })

            await transporter.sendMail({
                from: process.env.SMTP_USER,
                to: receiver,
                subject: "Thank you for your submission",
                html: getEmailTemplate(templatePath, {
                    receiver,
                    content
                })
            })

        } catch (err) {
            logToConsole("Sample emailer service", err.message)
            throw new Error(err.message)
        }
    },
}


