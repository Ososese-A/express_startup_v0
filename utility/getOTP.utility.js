const crypto = require("crypto")

const generateOTP = (time) => {
    const otp = crypto.randomInt(100000, 999999).toString()
    const createdAt = Date.now()
    const expiresAt = createdAt + Math.floor((time * 60 * 1000))

    return {
        otp,
        createdAt,
        expiresAt
    }
}

module.exports = { generateOTP }