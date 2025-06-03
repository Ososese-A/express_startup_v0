const mongoose = require("mongoose")

const otpSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    
    otp: {
        type: mongoose.Schema.Types.Number,
        required: true
    },

    createdAt: {
        type: mongoose.Schema.Types.Date,
        required: true
    },

    expiresAt: {
        type: mongoose.Schema.Types.Date,
        required: true
    }

}, {timestamps: true})

module.exports = mongoose.model("OTP", otpSchema)