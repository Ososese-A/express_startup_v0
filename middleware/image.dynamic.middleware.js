const { upload } = require("../services/image_processor/image.processor.service")

const dynamicImageProcessorMiddleware = (req, res, next) => {
    const uploadType = upload(req.storageType)
    uploadType.single('image')(req, res, next)
}

module.exports = dynamicImageProcessorMiddleware