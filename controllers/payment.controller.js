const {matchedData, validationResult} = require("express-validator")
const Auth = require("../databases/db_nosql/models/auth.mongodb.model")
const Oauth = require("../databases/db_nosql/models/oauth.mongodb.model")
const Transaction = require("../databases/db_nosql/models/transaction.mongodb.model")
const {payWithMonnify, verifyWithMonnify} = require("../services/payment/monify.payment.service")
const {logToConsole} = require("../utility/sample.utility")
const { payWithPayStack, verifyWithPackStack } = require("../services/payment/paystack.payment.service")

const monnifyPay = async (req, res) => {
    //receive the amount, email, remarks or description and id
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({success: false, message: errors.array()})

    const data = matchedData(req)
    const amount = data.amount
    const remarks = data.remarks
    const paymentMethod = data.paymentMethod
    const userId = req.user.userId

    try {
        //get email 
        // NOTE: optimize this later so the req comes with the user signup method
        // NOTE: also make it so we use the name in place of username if need be
        let email = null
        let user = await Auth.findById(userId)
        if (user) {
            email = user.email
        } else {
            user = await Oauth.findById(userId)
            email = user.email
        }

        const redirectUri = process.env.MONNIFY_REDIRECT_URI

        //use the service to try to make payment
        //NOTE: complete this and upgrade the service to accespt the remarks then the validator as well needs to vet the payment method
        const response = await payWithMonnify(email, amount, user.username, remarks, redirectUri, paymentMethod)

        const { checkoutUrl, ref, msg } = response;
        //save the ref to the transaction db
        await Transaction.create({
            userId: userId,
            amount: amount,
            status: "pending",
            reference: ref,
            remarks: remarks,
            sandboxUrl: checkoutUrl
        })

        res.json({ success: true, checkoutUrl, msg });

        //This will be done in the verify section
        //send message and email if it is successful
        //after saving to payment and then adding to user's transaction history
    } catch (err) {
        //send message if it fails
        logToConsole("monnify payment route monnifyPay", err)
        res.status(500).json({
            success: false,
            error: err,
        });
    }
}

const monnifyVerify = async (req, res) => {
    const {paymentReference} = req.query

    logToConsole("monnify payment verify controller (monnifyVerify)", `This is the reference sent ${paymentReference}xx0`)

    try {
        const {msg, status} = await verifyWithMonnify(paymentReference.trim())

        //any db related logic needed 
        const ref = await Transaction.findOne({reference: paymentReference})

        if (!ref) return res.status(404).json({success: false, msg: "Trasaction not found"})

        await ref.updateOne({status: status})

        res.status(200).redirect(`http://localhost:8080/api/v1/test/views/verify-pay/${status}/${msg}`)
    } catch (err) {
        const status = "unknown"
        const msg = err
        res.status(500).redirect(`http://localhost:8080/api/v1/test/views/verify-pay/${status}/${msg}`)
    }
}

const paystackPay = async (req, res) => {
    //receive the amount, email and id
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({success: false, message: errors.array()})

    const data = matchedData(req)
    const amount = data.amount
    const remarks = data.remarks
    const paymentMethod = data.paymentMethod
    const userId = req.user.userId

    try {
        let email = null
        let user = await Auth.findById(userId)
        if (user) {
            email = user.email
        } else {
            user = await Oauth.findById(userId)
            email = user.email
        }

        const response = await payWithPayStack(email, amount)

        const { url, ref, msg } = response

        await Transaction.create({
            userId: userId,
            amount: amount,
            status: "pending",
            reference: ref,
            remarks: remarks,
            sandboxUrl: url
        })

        res.json({ success: true, checkoutUrl: url,  msg})
    } catch (err) {
        logToConsole("Paystack payment route paystackPay", err)
        res.status(500).json({
            success: false,
            error: err
        })
    }
    //use the service to try to make payment
    //send message and email if it is successful
    //after saving to payment and then adding to user's transaction history
    //send message if it fails
}

const paystackVerify = async (req, res) => {
    const {paymentReference} = req.query

    logToConsole("monnify payment verify controller (monnifyVerify)", `This is the reference sent ${paymentReference}xx0`)

    try {
        const {msg, status} = await verifyWithPackStack(paymentReference)

        console.log(msg)

        //any db related logic needed 
        const ref = await Transaction.findOne({reference: paymentReference})

        if (!ref) return res.status(404).json({success: false, msg: "Trasaction not found"})

        await ref.updateOne({status: status})

        res.status(200).redirect(`http://localhost:8080/api/v1/test/views/verify-pay/${status}/${msg}`)
    } catch (err) {
        const status = "unknown"
        const msg = err
        res.status(500).redirect(`http://localhost:8080/api/v1/test/views/verify-pay/${status}/${msg}`)
    }
}

module.exports = {monnifyPay, monnifyVerify, paystackPay, paystackVerify}