//one with sessions 

//one with JWT
const jwt = require("jsonwebtoken")
const { logToConsole } = require("../utility/sample.utility")

const authMiddleware = (req, res, next) => {
    // logToConsole("Log from auth middleware", req.headers.authorization)
    const token = req.headers.authorization?.split(" ")[1]

    if (!token) return res.status(401).json({success: false, error: "Unauthorized"})

    jwt.verify(
        token,
        process.env.JWT_SECRET,
        (err, decoded) => {
            if (err) return res.status(401).json({success: false, error: "Invalid token"})
            req.user = decoded;
            next()
        }
    )
}

module.exports = authMiddleware