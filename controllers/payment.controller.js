const {matchedData, validationResult} = require("express-validator")
const Auth = require("../databases/db_nosql/models/auth.mongodb.model")
const Oauth = require("../databases/db_nosql/models/oauth.mongodb.model")
const {payWithMonnify, verifyWithMonnify} = require("../services/payment/monify.payment.service")
const {logToConsole} = require("../utility/sample.utility")

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
        res.json({ success: true, checkoutUrl, msg });

        //This will be done in the verify section
        //send message and email if it is successful
        //after saving to payment and then adding to user's transaction history
    } catch (err) {
        //send message if it fails
        logToConsole("monnify payment service verify with monnify", err)
        res.status(500).json({
            success: false,
            error: err,
        });
    }
}

const monnifyVerify = async (req, res) => {
    const {paymentReference} = req.query

    logToConsole("monnify payment verify controller (monnifyVerify)", `This is the reference sent ${paymentReference}`)

    try {
        const {msg, status} = await verifyWithMonnify(paymentReference.trim())

        //any db related logic needed 

        res.status(200).redirect(`http://localhost:8080/api/v1/test/views/verify-pay/${status}/${msg}`)
    } catch (err) {
        const status = "unknown"
        const msg = err
        res.status(500).redirect(`http://localhost:8080/api/v1/test/views/verify-pay/${status}/${msg}`)
    }
}

const paystackPay = async (req, res) => {
    //receive the amount, email and id
    //use the service to try to make payment
    //send message and email if it is successful
    //after saving to payment and then adding to user's transaction history
    //send message if it fails
}

module.exports = {monnifyPay, monnifyVerify, paystackPay}