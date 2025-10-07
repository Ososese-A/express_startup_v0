const express = require("express")
const router = express.Router()
const {
    monnifyPay,
    monnifyVerify,
    paystackPay,
    paystackVerify
} = require("../controllers/payment.controller")

const authMiddleware = require("../middleware/auth.middleware")

const {checkSchema} = require("express-validator")
const paymentValidationSchema = require("../models/validation/payment.validation.schema")

router.post("/monnify", authMiddleware, checkSchema(paymentValidationSchema), monnifyPay)

// This should have authMiddleware when it's not in the testing mode
router.get("/monnify/verify", monnifyVerify)

router.post("/paystack", authMiddleware, checkSchema(paymentValidationSchema), paystackPay)

// This should have authMiddleware when it's not in the testing mode
router.get("/paystack/verify", paystackVerify)

module.exports = router