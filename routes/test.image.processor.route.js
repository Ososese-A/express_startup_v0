const express = require("express")
const router = express.Router()
const sharp = require("sharp")
const imageMiddleware = require("../middleware/image.middleware")
const dynamicImageProcessorMiddleware = require("../middleware/image.dynamic.middleware")
const { logToConsole } = require("../utility/sample.utility")
const { compressOneStep, compressTwoStep } = require("../services/image_processor/compress.image.processor.service")
const Image = require("../databases/db_nosql/models/image.mongodb.model")
const { decompressTwoStep } = require("../services/image_processor/decompress.image.processor.service")

// remeber when testin on the front end the name of the field with the image should be the same as the argument of the single we used for the upload middleware
// And for postman it is the key we change
router.post("/upload-test", imageMiddleware, dynamicImageProcessorMiddleware, async (req, res) => {
    if (!req.file) return res.status(400).send('No file uploaded')
    
    const metadata = await sharp(req.file.buffer).metadata()
    
    console.log('Memory Upload Details')
    console.log('Memory Upload Details', req.file.originalname)
    console.log('Memory Upload Details', req.file.size)
    console.log('Memory Upload Details', req.file.mimetype)
    console.log('Memory Upload Details', req.file.buffer.length)
    console.log('Image Width', metadata.width)
    console.log('Image Height', metadata.height)

    res.send(`Image uploaded to memory: ${req.file.originalname}`)
})

router.post("/upload", imageMiddleware, dynamicImageProcessorMiddleware, async (req, res) => {
    try {
        const originalSize = req.file.buffer.length

        // call the service and store the returned value
        const buffer = await compressOneStep(req.file.buffer, false)
        const compressedSize = buffer.length

        // add it to the db
        const newImage = new Image({
            name: req.file.originalname,
            compression: 'one',
            img: {
                data: buffer,
                contentType: req.file.mimetype,
                originalSize: originalSize,
                compressedSize: compressedSize
            }
        })

        await newImage.save()

        console.log('Original Size', originalSize)
        console.log('Compressed Size', compressedSize)

        // send a response
        res.status(200).json({ success: true, msg: `Image stored successfully` })

    } catch (err) {
        logToConsole("SImage processor route /upload", err.message)
        res.status(500).json({success: false, error: err.message})
    }
})

router.post("/upload-two", imageMiddleware, dynamicImageProcessorMiddleware, async (req, res) => {
    try {
        const originalSize = req.file.buffer.length

        // call the service and store the returned value
        const buffer = await compressTwoStep(req.file.buffer, false)
        const compressedSize = buffer.length

        // add it to the db
        const newImage = new Image({
            name: req.file.originalname,
            compression: 'two',
            img: {
                data: buffer,
                contentType: req.file.mimetype,
                originalSize: originalSize,
                compressedSize: compressedSize
            }
        })

        await newImage.save()

        console.log('Original Size', originalSize)
        console.log('Compressed Size', compressedSize)

        // send a response
        res.status(200).json({ success: true, msg: `Image stored successfully` })

    } catch (err) {
        logToConsole("SImage processor route /upload", err.message)
        res.status(500).json({success: false, error: err.message})
    }
})

router.get("/view/:id", async (req, res) => {
    // test id: 68ebcba21ec2960da1c4c7c5
    const imgId = req.params.id

    try {
        // fetch the image
        const img = await Image.findById(imgId)
        const compressionType = img.compression
        const contentType = img.img.contentType
        const imgBuffer = img.img.data
        let decompressed = null

        // decompress the image if it is a two step
        logToConsole("Image processor route /view compressionType", compressionType)
        if (compressionType == "two") {
            decompressed = decompressTwoStep(imgBuffer)
        }

        // send a response
        res.set('Content-Type', contentType)
        res.send(imgBuffer)
    } catch (err) {
        logToConsole("Image processor route /view", err.message)
        res.status(500).json({success: false, error: err.message})
    }
})

module.exports = router