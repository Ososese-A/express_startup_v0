const loginValidationSchema = {
    email: {
        optional: true,

        normalizeEmail: true,

        notEmpty: {
            errorMessage: "Email must not be empty"
        },

        isString: {
            errorMessage: "Email must be a string"
        },

        isEmail: {
            errorMessage: "Invalid Email"
        }
    },

    username: {
        optional: true,

        notEmpty: {
            errorMessage: "Username must not be empty"
        },

        isLength: {
            options: {
                min: 3,
                max: 18
            },
            errorMessage: "Username must be between 3 to 18 characters long"
        },

        isString: {
            errorMessage: "Username must be a string"
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
            }
        },

        matches: {
            options: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
            errorMessage: "Password must include atleast one lowercase letter, one uppercase letter, one number and one special character (@$!%*?&)"
        },

        isString: {
            errorMessage: "Password must be a string"
        }
    }
}

module.exports = loginValidationSchema