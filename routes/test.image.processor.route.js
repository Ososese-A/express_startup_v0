const express = require("express")
const router = express.Router()
const {upload} = require("../middleware/image.middleware")
const sharp = require("sharp")
const imageMiddleware = require("../middleware/image.middleware")
const dynamicImageProcessorMiddleware = require("../middleware/image.dynamic.middleware")

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

module.exports = router