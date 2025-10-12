const multer = require("multer")

module.exports = {
    upload: (storageType) => {
        const storage = storageType === 'memory'
            ? multer.memoryStorage()
            : multer.diskStorage({
                destination: (req, file, cb) => cb(null, 'uploads/'),
                filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
               });

        return multer({ storage })
    }
}