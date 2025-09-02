const passport = require('passport')
const TwitterStrategy = require('@superfaceai/passport-twitter-oauth2').Strategy
const { logToConsole } = require('../../utility/sample.utility')
const OAuth = require('../../databases/db_nosql/models/oauth.mongodb.model')

passport.use( new  TwitterStrategy(
    {
        clientID: process.env.LINKEDIN_ID,
        clientSecret: process.env.LINKEDIN_SECRET,
        callbackURL: "api/v1/oauth/twitter/callback",
        clientType: 'confidential'
    },
    async (accessToken, refreshToken, profile, done) => {
        done(null, profile)
    }
))

passport.serializeUser(
    (profile, done) => {
    }
)

passport.deserializeUser(
    (profile, done) => {
    }
)

module.exports = passport