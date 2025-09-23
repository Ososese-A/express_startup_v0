const paymentValidationSchema = {
    amount: {
        isFloat : {
            options: {
                min: 0
            },
            errorMessage: "Amount must be a Positive Number"
        },

        isLength: {
            options: {
                min: 3
            },
            errorMessage: "Amount must be atleast 3 digits long"
        },

        notEmpty: {
            errorMessage: "Amount must not be empty"
        },
    },

    remarks: {
        isString: {
            options: {
                min: 3,
                max: 50
            },

            errorMessage: "Remarks must be between 3 to 50 characters long"
        },

        notEmpty: {
            errorMessage: "Remarks must not be empty"
        },
    },

    paymentMethod: {
        notEmpty: {
            errorMessage: "Payment method must not be empty",
        },

        isIn: {
            options: [["card", "coupon", "account_transfer"]],
            errorMessage: "Invalid payment type selected"
        }
    }
}

module.exports = paymentValidationSchema