const { logToConsole } = require('../../utility/sample.utility')
const zlib = require('zlib')

// same goes with decomprerssion, one with zlib and one without

module.exports = {
    decompressOneStep: async (imgBuffer) => {
    },

    decompressTwoStep: async (imgBuffer) => {
        const decompressed = zlib.inflateSync(imgBuffer)

        return decompressed
    }
}