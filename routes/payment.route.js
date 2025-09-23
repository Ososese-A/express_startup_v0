const express = require("express")
const router = express.Router()
const {
    monnifyPay,
    monnifyVerify,
    paystackPay
} = require("../controllers/payment.controller")

const authMiddleware = require("../middleware/auth.middleware")

const {checkSchema} = require("express-validator")
const paymentValidationSchema = require("../models/validation/payment.validation.schema")

router.post("/monnify", authMiddleware, checkSchema(paymentValidationSchema), monnifyPay)

// router.post("/monnify/verify/:ref/:msg", authMiddleware, monnifyVerify)
router.get("/monnify/verify/", monnifyVerify)

router.post("/paystack", authMiddleware, checkSchema(paymentValidationSchema), paystackPay)

module.exports = router