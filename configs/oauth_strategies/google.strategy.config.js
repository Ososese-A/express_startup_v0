const passport = require('passport')
const { logToConsole } = require('../../utility/sample.utility')
const GoogleStrategy  = require('passport-google-oauth20').Strategy
const OAuth = require('../../databases/db_nosql/models/oauth.mongodb.model')

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_SECRET_ID,
    callbackURL: '/api/v1/oauth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
    if (!profile || !accessToken) {
        throw new Error("An error occured; Unable to get the profile or accessToken")
    }

    try {
        const email = profile.emails[0].value

        let user = await OAuth.findOne({email})

        if (!user) {
            user = await OAuth.create({
                role: "user",
                username: `${profile.name.familyName} ${profile.name.givenName}`,
                email,
                // googleId: profile.id,
                // profilePhoto: profile.photos[0].value
            })
        }

        done(null, user)
    } catch (err) {
        logToConsole("SignUp/login from google oauth strategy", err.message)
        done(err)
    }
}))

passport.serializeUser(
    (user, done) => {
        done(null, user._id)
    }
)

passport.deserializeUser(
    async (id, done) => {
        try {
            const user = await OAuth.findById(id)
            done(null, user)
        } catch (err) {
            done(err)
        }
    } 
)

module.exports = passport