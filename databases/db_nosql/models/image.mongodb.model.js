const mongoose = require("mongoose")

const imageSchema = new mongoose.Schema(
    {
        name: mongoose.Schema.Types.String,
        compression: {
            type: mongoose.Schema.Types.String,
            enum: ['none', 'one', 'two', 'zip'],
            default: 'none'
        },
        img: {
            data: mongoose.Schema.Types.Buffer,
            contentType: mongoose.Schema.Types.String,
            originalSize: mongoose.Schema.Types.Number,
            compressedSize: mongoose.Schema.Types.Number
        }
    }, 
    {timestamps: true}
)

module.exports = mongoose.model("Image", imageSchema)