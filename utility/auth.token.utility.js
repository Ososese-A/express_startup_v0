const jwt = require("jsonwebtoken")

const generateToken = (id) => {
    const token = jwt.sign(
        { userId: id}, 
        process.env.JWT_SECRET, 
        {expiresIn: '1d'}
    )

    return token
}

module.exports = { generateToken }