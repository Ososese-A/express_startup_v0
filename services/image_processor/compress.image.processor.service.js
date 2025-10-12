const { logToConsole } = require('../../utility/sample.utility')
const sharp = require("sharp")
const zlib = require("zlib")

// this is how this is going to go, we are going to have two options, 
// one for single compression with sharp and one for double compression with zlib

module.exports = {
    compressOneStep: async (sharpBuffer, islossy) => {
        if (!sharpBuffer) throw new Error("Compress one step needs a sharpBuffer")

        try {
            const scale = 0.1 //remeber this means 100%
            const metadata = await sharp(sharpBuffer).metadata()
            const newWidth = Math.round(metadata.width * scale)

            const compressedBuffer = islossy == true
            ?
                await sharp(sharpBuffer)
                    .resize({ width: newWidth}) //remeber to use a scale to handle resising and do not do it manually
                    .jpeg({ quality: 1 })
                    .toBuffer()
            :
                await sharp(sharpBuffer)
                    .resize({ width: newWidth}) //remeber to use a scale to handle resising and do not do it manually
                    .png({ 
                        compressionLevel: 9,
                        adaptiveFiltering: true // remeber to use this only when we nned adaptive filtering
                    })
                    .toBuffer()

            return compressedBuffer

        } catch (err) {
            logToConsole("Image processor service compress one step", err.message)
            throw new Error(err.message)
        }
    },

    compressTwoStep: async (sharpBuffer, islossy) => {
        if (!sharpBuffer) throw new Error("Compress one step needs a sharpBuffer")

        try {
            const scale = 0.1 //remeber this means 100%
            const metadata = await sharp(sharpBuffer).metadata()
            const newWidth = Math.round(metadata.width * scale)

            const compressedBuffer = islossy == true
            ?
                await sharp(sharpBuffer)
                    .resize({ width: newWidth}) //remeber to use a scale to handle resising and do not do it manually
                    .jpeg({ quality: 1 })
                    .toBuffer()
            :
                await sharp(sharpBuffer)
                    .resize({ width: newWidth}) //remeber to use a scale to handle resising and do not do it manually
                    .png({ 
                        compressionLevel: 9,
                        adaptiveFiltering: true // remeber to use this only when we nned adaptive filtering
                    })
                    .toBuffer()

            const finalCompression = zlib.deflateSync(compressedBuffer)

            return finalCompression

        } catch (err) {
            logToConsole("Image processor service compress one step", err.message)
            throw new Error(err.message)
        }
    }
}