const {default: axios} = require("axios")
const { logToConsole } = require('../../utility/sample.utility')

const getMonnifyAuthToken = async () => {
    const credentials = `${process.env.MONNIFY_KEY}:${process.env.MONNIFY_SECRET}`
    const encodedCredentials = Buffer.from(credentials).toString("base64")

    try {
        const response = await axios.post(
            "https://sandbox.monnify.com/api/v1/auth/login",
            {},
            {
                headers: {
                    Authorization: `Basic ${encodedCredentials}`
                }
            }
        )

        return response.data.responseBody.accessToken
    } catch (err) {
        logToConsole("monnify payment service get the monnify auth token", err.message)
        throw new Error(err.message);
    }
}

module.exports = {
    payWithMonnify: async (email, amount, name, description, redirectUrl, paymentMethod) => {
        if (!email || !amount) throw new Error("The following data are required to use payWithMonnify; email, amount, name, description, redirectUrl, paymentMethod")

        const paymentMethodList = ["CARD", "ACCOUNT"]

        if (!paymentMethodList.includes(paymentMethod)) throw new Error(`Inavid Payment Method Selected; ${paymentMethod}`)

        try {
            const authToken = await getMonnifyAuthToken()
            const response = await axios.post(
                "https://sandbox.monnify.com/api/v1/merchant/transactions/init-transaction",
                {
                    amount: amount,
                    customerName: name,
                    customerEmail: email,
                    paymentReference: `REF-${Date.now()}`,
                    paymentDescription: description,
                    currencycode: "NGN",
                    contractCode: process.env.MONNIFY_CODE,
                    redirectUrl: redirectUrl,
                    paymentMethod: paymentMethod
                },
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                        "Content-Type": "application/json"
                    }
                }
            )

            const {checkoutUrl} = response.data.responseBody
            const res = {
                checkoutUrl,
                msg: "Payment sandbox Initiated Successfully"
            }
        } catch (err) {
            logToConsole("monnify payment service pay with monnify", err.message)
            throw new Error(err.message)
        }
    },

    verifyWithMonnify: async (reference) => {
        if (!reference) throw new Error("A reference key of id is needed to verify payments with monnify")

        try {
            const response = await axios.get(
                `https://sandbox.monnify.com/api/v1/transactions/${paymentReference}`,
                {
                    headers: {
                        Authorization: `Bearer ${process.env.MONNIFY_KEY}`
                    }
                }
            )

            const {paymentStatus} = response.data.responseBody

            if (paymentStatus === "PAID") {
                const msg = "Payment Successful"
                const status = true
                return {msg, status}
            } else {
                const msg = "Payment Failed"
                const status = false
                return {msg, status}
            }
        } catch (err) {
            logToConsole("monnify payment service verify with monnify", err.message)
            throw new Error(err.message)
        }
    }
}