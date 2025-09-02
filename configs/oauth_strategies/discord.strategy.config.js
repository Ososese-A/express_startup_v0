const passport = require('passport')
const { logToConsole } = require('../../utility/sample.utility')
const DiscordStrategy = require('passport-discord').Strategy
const OAuth = require('../../databases/db_nosql/models/oauth.mongodb.model')

passport.use(new DiscordStrategy({
    clientID: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_SECRET_ID,
    callbackURL: '/api/v1/oauth/discord/callback'
}, async (accessToken, refreshToken, profile, done) => {
    logToConsole("SignUp/login from discord oauth strategy", profile)

    try {
        const email = profile.email
        let user = await OAuth.findOne({email})

        if (!user) {
            user = await OAuth.create({
                role: "user",
                username: profile.username,
                email,
                discordId: profile.id
            })
        }

        done(null, user)
    } catch (err) {
        logToConsole("SignUp/login from discord oauth strategy", err.message)
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