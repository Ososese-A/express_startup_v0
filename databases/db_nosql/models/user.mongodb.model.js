const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username: {
        type: mongoose.Schema.Types.String,
        unique: true,
        required: true
    },
    password: {
        type: mongoose.Schema.Types.String,
        required: true
    }
}, {timestamps: true})

module.exports = mongoose.model("sampleUser", userSchema)