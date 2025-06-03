//one with sessions 

//one with JWT
//login, logout, signup, forgot password
//bcrypt password hashing 
//RBAC
//convert role from member to admin or other only by the admin
const {matchedData, validationResult} = require("express-validator")
const Auth = require("../databases/db_nosql/models/auth.mongodb.model")
const OTP = require("../databases/db_nosql/models/otp.mongodb.model")
const { logToConsole } = require("../utility/sample.utility")
const bcrypt = require("bcrypt")
const { generateToken } = require("../utility/auth.token.utility")
const { forgotPasswordEmail, otpEmail, twoFactorSetUpEmail } = require("../services/emailer/auth.emailer.service")
const jwt = require("jsonwebtoken")
const { generateOTP } = require("../utility/getOTP.utility")
const speakeasy = require("speakeasy")
const qrcode = require("qrcode")

const signUp = async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) return res.status(400).json({ success: false, msg: errors.array() })

    const data = matchedData(req)
    const salt = await bcrypt.genSalt(10)
    data.password = await bcrypt.hash(data.password, salt)

    //add in the role
    const userInfo = {
        username: data.username,
        email: data.email,
        password: data.password,
        role: "member"
    }

    try {
        const emailCheck = await Auth.findOne({ email: data.email })

        if (emailCheck) return res.status(409).json({ success: false, msg: "Email already in use" })

        const usernameCheck = await Auth.findOne({ username: data.username })

        if (usernameCheck) return res.status(409).json({ success: false, msg: "Username already in use" })

        const user = await Auth.create(userInfo)

        //send an email to the new user

        // res.status(201).json({ success: true, msg: "Account created successfully", user})
        res.status(201).json({ success: true, msg: "Account created successfully"})
    } catch (err) {
        logToConsole("SignUp from auth controller", err.message)
        res.status(500).json({success: false, error: err.message})
    }
}

const login = async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) return res.status(400).json({ success: false, msg: errors.array() })

    const data = matchedData(req)

    try {

        let user = null

        if (data.username) {
            user = await Auth.findOne({ username: data.username })
            if (!user) return res.status(404).json({ success: false, msg: "Username not found, User does not exist" })
        } else if (data.email) {
            user = await Auth.findOne({ email: data.email })
            console.log(data.email)
            console.log(user)
            if (!user) return res.status(404).json({ success: false, msg: "Email not found, User does not exist" })
        } else {
            console.log(data)
            console.log(user)
            return res.status(400).json({ success: false, msg: "Username or email is required to login to you account" })
        }

        const confirmPassword = await bcrypt.compare(data.password, user.password)

        if (!confirmPassword) return res.status(400).json({success: false, msg: "Incorrect password"})

        const token = generateToken(user._id)

        //send a login email to the user

        res.status(200).json({ success: true, msg: "Account login successful", token, user})
    } catch (err) {
        logToConsole("Login from auth controller", err.message)
        res.status(500).json({success: false, error: err.message})
    }
}

const resetPassword = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ success: false, msg: errors.array() })

    const {token} = req.query

    const data = matchedData(req)
    const password = data.password

    try {
        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) return res.status(401).json({ success: false, msg: "Unauthorized, Reset token has expired."})

            const user = await Auth.findOne({resetToken: token})
            if (!user) return res.status(404).json({ success: false, msg: "User not found, User does not exist" })

            //check if old password and new password are the same
            const passwordCheck = await bcrypt.compare(password, user.password)
            if (passwordCheck) return res.status(409).json({ success: false, msg: "New password cannot be the same as the old password" })

            const salt = await bcrypt.genSalt(10)
            const newPassword = await bcrypt.hash(password, salt)
            user.password = newPassword
            

            await user.save()

            res.status(200).json({ success: true, msg: "Password reset successfully" })
        })
    } catch (err) {
        logToConsole("ResetPassword from auth controller", err.message)
        res.status(500).json({success: false, error: err.message})
    }
}

const forgotPassword = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ success: false, msg: errors.array() })

    const data = matchedData(req)

    try {
        const user = await Auth.findOne({email: data.email})
        if (!user) return res.status(404).json({ success: false, msg: "Email not found, User does not exist" })

        const token = generateToken(user._id)

        user.resetToken = token

        await user.save()

        await forgotPasswordEmail(user.email, token)
        
        res.status(200).json({ success: true, msg: "Password reset Email sent!" })
    } catch (err) {
        logToConsole("ForgotPassword from auth controller", err.message)
        res.status(500).json({success: false, error: err.message})
    }
}

const requestOTP = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ success: false, msg: errors.array() })

    const data = matchedData(req)

    try {
        const user = await Auth.findOne({email: data.email})
        if (!user) return res.status(404).json({ success: false, msg: "Email not found, User does not exist" })

        //generate the otp
        const otpData = generateOTP(1)

        const createdOTP = await OTP.create({
            userId: user._id,
            otp: otpData.otp,
            createdAt: otpData.createdAt,
            expiresAt: otpData.expiresAt
        })

        user.otpIds = createdOTP._id
        await user.save()

        //send the email
        otpEmail(user.email, otpData.otp)

        // res.status(200).json({success: true, msg: "OTP code sent successfully!", createdOTP})
        res.status(200).json({success: true, msg: "OTP code sent successfully!"})
    } catch (err) {
        logToConsole("RequestOTP from auth controller", err.message)
        res.status(500).json({success: false, error: err.message})
    }
}

const verifyOTP = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ success: false, msg: errors.array() })

    const data = matchedData(req)

    try {
        const user = await Auth.findOne({email: data.email})
        if (!user) return res.status(404).json({ success: false, msg: "Email not found, User does not exist" })

        //verify the otp
        const otp = await OTP.findOne({_id: user.otpIds})
        if (!otp) return res.status(400).json({ success: false, msg: "Invalid OTP, This code does not exist" })

        if (!(otp.otp == data.otp)) return res.status(400).json({ success: false, msg: "Invalid OTP, This is the wrong code" })

        if (Date.now() > otp.expiresAt) return res.status(400).json({ success: false, msg: "Invalid OTP, OTP code has expired" })

        //delete OTP after verification
        const deletedOTP = await OTP.findByIdAndDelete(otp._id)

        res.status(200).json({ success: true, msg: "OTP successfully verified", deletedOTP })
    } catch (err) {
        logToConsole("VerifyOTP from auth controller", err.message)
        res.status(500).json({success: false, error: err.message})
    }
}

const setTwoFactor = async (req, res) => {
    const userId = req.user.userId

    try {
        //create the secret 
        const secret = speakeasy.generateSecret({length: 20})

        //save it to the user
        const user = await Auth.findOne({_id: userId})
        if (!user) return res.status(404).json({ success: false, msg: "Email not found, User does not exist" })

        user.isTwoFactorEnabled = true
        user.twoFactorSecret = secret.base32

        //get the url 
        const qrCodeURL = await qrcode.toDataURL(secret.otpauth_url)

        //send user email
        twoFactorSetUpEmail(user.email, qrCodeURL, secret.base32)

        //send it to the user
        await user.save()
        // res.status(200).json({ userId, qrCodeURL, secret: secret.base32 })
        res.status(200).json({ success: true, msg: "Email sent successfully" })
    } catch (err) {
        logToConsole("Set two factor from auth controller", err.message)
        res.status(500).json({success: false, error: err.message})
    }
}

const verifyTwoFactor = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ success: false, msg: errors.array() })

    const data = matchedData(req)

    const email = data.email
    const otp = data.otp

    try {
        const user = await Auth.findOne({email: email})
        if (!user) return res.status(404).json({ success: false, msg: "Email not found, User does not exist" })

        const verify = speakeasy.totp.verify({
            secret: user.twoFactorSecret,
            encoding: "base32",
            token: otp
        })

        if (!verify) return res.status(400).json({ success: false, msg: "Invalid token" })

        res.status(200).json({ success: true, msg: "OTP validation successful" })
    } catch (err) {
        logToConsole("Verify two factor from auth controller", err.message)
        res.status(500).json({success: false, error: err.message})
    }
}

module.exports = {
    signUp,
    login,
    forgotPassword,
    resetPassword,
    requestOTP,
    verifyOTP,
    setTwoFactor,
    verifyTwoFactor
}