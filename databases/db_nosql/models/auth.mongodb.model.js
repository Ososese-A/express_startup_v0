const mongoose = require("mongoose")

const authValidationSchema = new mongoose.Schema({
    role: {
        type: mongoose.Schema.Types.String,
        required: true
    },

    username: {
        type: mongoose.Schema.Types.String,
        required: true,
        unique: true
    },

    password: {
        type: mongoose.Schema.Types.String,
        required: true
    },

    email: {
        type: mongoose.Schema.Types.String,
        required: true,
        unique: true
    },

    resetToken: {
        type: mongoose.Schema.Types.String,
    },

    otpIds: {
        type: mongoose.Schema.Types.ObjectId
    },

    twoFactorSecret: { 
        type: mongoose.Schema.Types.String
    },
    
    isTwoFactorEnabled: { 
        type: mongoose.Schema.Types.Boolean, 
        default: false 
    },

}, {timestamps: true})

module.exports = mongoose.model("Auth", authValidationSchema)