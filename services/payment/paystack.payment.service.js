const PayStack = require("paystack")(process.env.PAYSTACK_KEY)
const { logToConsole } = require('../../utility/sample.utility')

module.exports = {
    payWithPayStack: async (email, amount) => {
        if (!email || !amount) throw new Error("Email and Account are required")

        try {
            const pay = await PayStack.transaction.initialize({
                email: email,
                amount: amount * 100
            })

            if (!pay.data || !pay.data.authorization_url) throw new Error("Authorization url not returned by Paystack")

            logToConsole("paystack payment service pay with paysatck, This is the payment data", pay.data)

            res = {
                url: pay.data.authorization_url,
                ref: pay.data.reference,
                msg: `Initializing sandbox`
            }

            return res

        } catch (err) {
            logToConsole("paystack payment service pay with paysatck", err.message)
            throw new Error(err.message)
        }
    },

    verifyWithPackStack: async (reference) => {
        if (!reference) throw new Error("A reference key of id is needed to verify payments with paystack")

        try {
            const ref = await PayStack.transaction.verify(reference)

            logToConsole("paystack payment service pay with paysatck, This is the verification reference", ref)

            const status = ref.data.status

            if (status === "success") {
                const msg = "Transaction Successful"
                return {msg, status}
            } else {
                const msg = "Transaction Failed"
                return {msg, status}
            }

        } catch (err) {
            logToConsole("paystack payment service verify with paysatck", err.message)
            throw new Error(err.message)
        }
    }
}