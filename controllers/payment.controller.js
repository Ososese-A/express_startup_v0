const {matchedData, validationResult} = require("express-validator")
const Auth = require("../databases/db_nosql/models/auth.mongodb.model")
const Oauth = require("../databases/db_nosql/models/oauth.mongodb.model")
const {payWithMonnify} = require("../services/payment/monify.payment.service")
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

        const { checkoutUrl } = response;
        res.json({ success: true, checkoutUrl, msg: "Sandbox initialized successfully" });

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
    
}

const paystackPay = async (req, res) => {
    //receive the amount, email and id
    //use the service to try to make payment
    //send message and email if it is successful
    //after saving to payment and then adding to user's transaction history
    //send message if it fails
}

module.exports = {monnifyPay, paystackPay}