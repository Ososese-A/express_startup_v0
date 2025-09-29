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

        const token = await response.data.responseBody.accessToken

        return token
    } catch (err) {
        logToConsole("monnify payment service get the monnify auth token", err.message)
        throw new Error(err.message);
    }
}

module.exports = {
    payWithMonnify: async (email, amount, name, description, redirectUrl, paymentMethod) => {
        if (!email || !amount || !name || !description || !redirectUrl || !paymentMethod) throw new Error("The following data are required to use payWithMonnify; email, amount, name, description, redirectUrl, paymentMethod")

        const paymentMethodList = ["CARD", "ACCOUNT_TRANSFER"]

        const selectedMethod = paymentMethod.toUpperCase()

        const  ref = `REF-${Date.now()}`

        logToConsole("monnify payment service pay with monnify", `This is the reference ${ref}`)

        if (!paymentMethodList.includes(selectedMethod)) throw new Error(`Inavid Payment Method Selected; ${paymentMethod}`)

        try {
            const authToken = await getMonnifyAuthToken()

            const response = await axios.post(
                "https://sandbox.monnify.com/api/v1/merchant/transactions/init-transaction",
                {
                    amount: amount,
                    customerName: name,
                    customerEmail: email,
                    paymentReference: ref,
                    paymentDescription: description,
                    currencyCode: "NGN",
                    contractCode: process.env.MONNIFY_CODE,
                    redirectUrl,
                    paymentMethod: selectedMethod
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
                ref,
                msg: "Payment sandbox Initiated Successfully"
            }

            return res
        } catch (err) {
            logToConsole("monnify payment service pay with monnify", err.message)
            throw new Error(err.message)
        }
    },

    verifyWithMonnify: async (reference) => {
        if (!reference) throw new Error("A reference key of id is needed to verify payments with monnify")

        logToConsole("monnify payment service verify with monnify", `This is the reference ${reference}`)

        try {
            const authToken = await getMonnifyAuthToken()
            
            const response = await axios.get(
                // `https://sandbox.monnify.com/api/v1/transactions/${reference}`,
                `https://sandbox.monnify.com/api/v1/merchant/transactions/query?paymentReference=${reference}`,
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
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
            if (err.response) {
                logToConsole("monnify payment service verify with monnify", err.response.data)
                throw new Error(err.response.data.responseMessage)
            } else {
                logToConsole("monnify payment service verify with monnify", err.message)
                throw new Error(err.message)
            }
        }
    }
}