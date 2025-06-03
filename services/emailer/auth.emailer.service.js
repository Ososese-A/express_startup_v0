const nodemailer = require('nodemailer')
const path = require("path")
const { logToConsole } = require('../../utility/sample.utility')
const { getEmailTemplate } = require('../../utility/getEmailTemplate.utility')

module.exports = {
    forgotPasswordEmail: async (receiver, token) => {

        if (!receiver || !token) {
            throw new Error("Receiver and content is missing but they are required")
        }

        const templateDirPath = path.join(__dirname, "templates")
        const templatePath = path.join(templateDirPath, "forgotPassword.template.hbs")
        const resetUrl = `${process.env.FRONTEND_URL}/reset?token=${token}`

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
                subject: "Password Reset",
                html: getEmailTemplate(templatePath, {
                    resetUrl
                })
            })

        } catch (err) {
            logToConsole("auth emailer service forgot password", err.message)
            throw new Error(err.message)
        }
    },

    otpEmail: async (receiver, otp) => {
        if (!receiver || !otp) {
            throw new Error("Receiver and content is missing but they are required")
        }

        const templateDirPath = path.join(__dirname, "templates")
        const templatePath = path.join(templateDirPath, "otp.template.hbs")
        
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
                subject: "One Time Passcode (OTP)",
                html: getEmailTemplate(templatePath, {
                    otp
                })
            })

        } catch (err) {
            logToConsole("auth emailer service otp password", err.message)
            throw new Error(err.message)
        }
    },

    twoFactorSetUpEmail: async (receiver, qrCodeURL, secret) => {
        if (!receiver || !qrCodeURL || !secret) {
            throw new Error("Receiver and content is missing but they are required")
        }

        const templateDirPath = path.join(__dirname, "templates")
        const templatePath = path.join(templateDirPath, "twoFactorSetUp.template.hbs")

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
                subject: "Google Authenticator Setup",
                html: getEmailTemplate(templatePath, {
                    qrCodeURL,
                    secret
                })
            })

        } catch (err) {
            logToConsole("auth emailer service otp password", err.message)
            throw new Error(err.message)
        }
    }
}


