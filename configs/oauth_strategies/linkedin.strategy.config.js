const passport = require("passport")
const LinkedInStrategy = require("passport-linkedin-oauth2").Strategy
const { logToConsole } = require('../../utility/sample.utility')
const OAuth = require('../../databases/db_nosql/models/oauth.mongodb.model')

passport.use(new LinkedInStrategy({
    clientID: process.env.LINKEDIN_ID,
    clientSecret: process.env.LINKEDIN_SECRET,
    callbackURL: "http://localhost:8080/api/v1/oauth/linkedin/callback"
}, async (accessToken, refreshToken, profile, done) => {
    // try {
    //     const email = 
    // } catch (err) {
    //     logToConsole("SignUp/login from linkedin oauth strategy", err.message)
    //     done(err)
    // }

    done(null, profile)
}))


// passport.serializeUser(
//     (user, done) => {
//         done(null, user._id)
//     }
// )
passport.serializeUser(
    (user, done) => {
        done(null, user)
    }
)


// passport.deserializeUser(
//     async (id, done) => {
//         try {
//             const user = await OAuth.findById(id)
//             done(null, user)
//         } catch (err) {
//             done(err)
//         }
//     }
// )
passport.deserializeUser(
    (profile, done) => {
        done(null, profile)
    }
)


module.exports = passport