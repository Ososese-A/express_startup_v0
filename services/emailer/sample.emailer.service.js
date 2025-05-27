const nodemailer = require('nodemailer')
const fs = require("fs")
const path = require("path")
const handlebars = require("handlebars")
const { logToConsole } = require('../../utility/sample.utility')
const emailTemplate = ""

module.exports = {
    emailService: async (receiver, content) => {

        if (!receiver || !content) {
            throw new Error("Receiver and content is missing but they are required")
        }

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
                html: getEmailTemplate({
                    receiver,
                    content
                })
            })

            //for sending another message to an admin or sth like that
            // await transporter.sendMail({
            //     from: "",
            //     to: "",
            //     subject: "",
            //     html: ""
            // })

        } catch (err) {
            logToConsole("Sample emailer service", err.message)
            throw new Error(err.message)
        }
    }
}

const getEmailTemplate = (data) => {
    const templateDirPath = path.join(__dirname, "templates")
    const templatePath = path.join(templateDirPath, "sampleTemplate.hbs")
    const templateSource = fs.readFileSync(templatePath, "utf8")
    const template = handlebars.compile(templateSource)

    return template(data)
}
