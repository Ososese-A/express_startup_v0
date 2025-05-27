const userValidationSchema = {
    username: {
        isLength: {
            options: {
                min: 5,
                max: 32
            },
            errorMessage: "Username must be at least 5 characters with a max of 32 characters"
        },

        notEmpty: {
            errorMessage: "Username must not be empty"
        },

        isString: {
            errorMessage: "Username must be a string"
        }
    },

    password: {
        isLength: {
            options: {
                min: 8,
                max: 32
            },

            errorMessage: "Password must be between 8 to 32 characters long"
        },

        notEmpty: {
            errorMessage: "Password must not be empty"
        },

        isString: {
            errorMessage: "Password must be a string"
        }
    },
}

module.exports = userValidationSchema