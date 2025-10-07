const mongoose = require("mongoose")

const transactionSchema = new mongoose.Schema({    
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },

    amount: {
        type: mongoose.Schema.Types.Number,
        required: true
    },

    status: {
        type: mongoose.Schema.Types.String,
        required: true
    },

    reference: {
        type: mongoose.Schema.Types.String,
        required: true
    },

    remarks: {
        type: mongoose.Schema.Types.String,
        required: true
    },

    sandboxUrl: {
        type: mongoose.Schema.Types.String,
        required: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("Transaction", transactionSchema)