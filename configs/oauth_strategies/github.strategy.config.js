const passport =  require('passport')
const GithubStrategy = require('passport-github2').Strategy
const axios = require('axios')
const OAuth = require('../../databases/db_nosql/models/oauth.mongodb.model')
const { logToConsole } = require("../../utility/sample.utility")

passport.use(new GithubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_SECRET_ID,
    callbackURL: '/api/v1/oauth/github/callback'
}, async (accessToken, refreshToken, profile, done) => {
    //make sure we get the access token and the profile info
    if (!profile || !accessToken) {
        throw new Error("An error occured; Unable to get the profile or accessToken")
    }

    let email =""

    try {
        // use axios and the access token to get the email
        const emailResponse = await axios.get("https://api.github.com/user/emails", {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })

        const emailList = emailResponse.data

        email = emailList.find((email) => email.primary)?.email || emailList[0].email

        //add user to the db if user i not already in the db
        let user = await OAuth.findOne({email})

        if (!user) {
            user = await OAuth.create({
                role: "user",
                username: profile.username,
                email,
                // gitId: profile.id,
                // profilePhoto: profile.photos[0]?.value,
            })
        }

        done(null, user)
    } catch (err) {
        logToConsole("SignUp/login from github oauth strategy", err.message)
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