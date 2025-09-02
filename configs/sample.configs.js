const passport =  require('passport')
const SampleStrategy = require('passport-github2').Strategy

passport.use(new SampleStrategy({
    clientID: '',
    clientSecret: '',
    callbackURL: ''
}, (accessToken, refreshToken, profile, done) => {
    done(null, profile)
}))

passport.serializeUser(
    (profile, done) => {
        done(null, profile)
    }
)

passport.deserializeUser(
    (profile, done) => {
        done(null, profile)
    } 
)

module.exports = passport