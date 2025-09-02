const mongoose = require("mongoose")

const PaymentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },

    amount: {
        type: mongoose.Schema.Types.Number,
        required:  true
    },

    remarks: {
        type: mongoose.Schema.Types.String,
        required: true
    },

    receiver: {
        type: mongoose.Schema.Types.String,
        required: true
    },

    reference: {
        type: mongoose.Schema.Types.String,
        required: true,
        unique: true
    }
}, {timestamps: true})

module.exports = mongoose.model("Payment", PaymentSchema)