const userValidationSchema = {
    username: {
        notEmpty: {
            errorMessage: "Username must not be empty"
        },

        isLength: {
            options: {
                min: 3,
                max: 16
            },
            errorMessage: "Username must be between 3 and 16 characters long"
        },

        isString: {
            errorMessage: "Username must be a String"
        }
    },

    password: {
        notEmpty: {
            errorMessage: "Password must not be empty"
        },

        isLength: {
            options: {
                min: 8,
                max: 32
            },
            errorMessage: "Password must be between 8 and 16 characters long"
        },

        isString: {
            errorMessage: "Password must be a String"
        },

        matches: {
            options: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
            errorMessage: "Password must include atleast one lowercase letter, one uppercase letter, one number and one special character (@$!%*?&)"
        }
    },

    email: {
        notEmpty: {
            errorMessage: "Email must not be empty"
        },

        isEmail: {
            errorMessage: "Invalid Email"
        },

        normalizeEmail: true,

        isString: {
            errorMessage: "Email must be a String"
        }
    },
}


module.exports = userValidationSchema