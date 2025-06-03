//one with sessions 

//one with JWT

//login, logout, signup, forgot password

//login, logout, signup with oAuth

//RBAC

const express = require("express")
const router = express.Router()
const { signUp, login, forgotPassword, resetPassword, requestOTP, verifyOTP, setTwoFactor, verifyTwoFactor } = require("../controllers/auth.controller")
const { checkSchema, body } = require("express-validator")
const signupValidationSchema = require("../models/validation/signup.validation.schema")
const loginValidationSchema = require("../models/validation/login.validation.schema")
const authMiddleware = require("../middleware/auth.middleware")

router.post("/signUp", checkSchema(signupValidationSchema), signUp)

router.post("/login", checkSchema(loginValidationSchema), login)

router.post("/forgotPassword", 
body("email")
    .isEmail().withMessage("Invalid Email")
    .isString().withMessage("Email must be a string")
    .notEmpty().withMessage("Email must not be empty"),
forgotPassword)

router.post("/reset/", 
body("password")
    .notEmpty().withMessage("Password must not be empty")
    .isString().withMessage("Password must be a String")
    .isLength({max: 36, min: 8}).withMessage("Password must be between 8 and 16 characters long")
    .matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@!$%&*?])/).withMessage("Password must include atleast one lowercase letter, one uppercase letter, one number and one special character (@$!%*?&)"), 
resetPassword)

router.post("/requestOTP",
body("email")
    .isEmail().withMessage("Invalid Email")
    .isString().withMessage("Email must be a string")
    .notEmpty().withMessage("Email must not be empty"),
requestOTP
)

router.post("/verifyOTP", 
[
 body("email")
    .isEmail().withMessage("Invalid Email")
    .isString().withMessage("Email must be a string")
    .notEmpty().withMessage("Email must not be empty"),
body("otp")
    .isNumeric().withMessage("OTP must be a Number")
    .isLength(6).withMessage("OTP must be 6 numbers long")
    .notEmpty().withMessage("OTP must not be empty")
],
verifyOTP
)

router.post("/setTwoFactor", authMiddleware, setTwoFactor)

router.post("/verifySetTwoFactor", 
[
body("email")
    .isEmail().withMessage("Invalid Email")
    .isString().withMessage("Email must be a string")
    .notEmpty().withMessage("Email must not be empty"),
body("otp")
    .isNumeric().withMessage("OTP must be a Number")
    .isLength(6).withMessage("OTP must be 6 numbers long")
    .notEmpty().withMessage("OTP must not be empty")
],
verifyTwoFactor
)

module.exports = router