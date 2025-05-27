const aiValidationSchema = {
    question: {
        isLength: {
            options: {
                min: 3,
                max: 10000
            },
            errorMessage: "Your question must be between 3 and 10,000 characters for it to be accepted"
        },

        notEmpty: {
            errorMessage: "Question must not be empty"
        },

        isString: {
            errorMessage: "Question must be a string"
        }
    }
}

module.exports = aiValidationSchema