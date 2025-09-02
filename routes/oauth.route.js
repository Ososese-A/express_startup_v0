const express = require("express")
const jwt = require('jsonwebtoken')
const githubPassport = require('../configs/oauth_strategies/github.strategy.config')
const googlePassport = require('../configs/oauth_strategies/google.strategy.config')
const discordPassport = require('../configs/oauth_strategies/discord.strategy.config')
const linkedinPassport = require('../configs/oauth_strategies/linkedin.strategy.config')
const twitterPassport = require('../configs/oauth_strategies/twitter.strategy.config')
const { generateToken } = require("../utility/auth.token.utility")
const { logToConsole } = require("../utility/sample.utility")

const router = express.Router()

router.get("/github", githubPassport.authenticate("github", {scope: ["user:email", "read:user", "repo"]}))

router.get("/github/callback",
    githubPassport.authenticate("github", {session: false, failureRedirect: "/home"}),
    (req, res) => {
        const token = generateToken(req.user._id)
        console.log("Git hub callback")
        console.log("Authenticated user:", req.user.email)
        res.redirect(`/dashboard?token=${token}`)
    }
)

router.get("/google", googlePassport.authenticate("google", {scope: ["profile", "email"]}))

router.get("/google/callback", 
    googlePassport.authenticate("google", {session: false, failureRedirect: "/home"}),
    (req, res) => {
        const token = generateToken(req.user._id)
        logToConsole("oauth google route", req.user)
        res.redirect(`/dashboard?token=${token}`)
    }
)


router.get("/discord", discordPassport.authenticate("discord", {scope: ["identify", "email"]}))

router.get("/discord/callback",
    discordPassport.authenticate("discord", {session: false, failureRedirect: "/home"}),

    (req, res) => {
        const token = generateToken(req.user._id)
        logToConsole("oauth discord route", req.user)
        res.redirect(`/dashboard?token=${token}`)
    }
)


router.get("/linkedin", linkedinPassport.authenticate("linkedin", {scope: ["r_emailaddress", "r_liteprofile"]}))

router.get("/linkedin/callback", 
    linkedinPassport.authenticate("linkedin", {session: false, failureRedirect: "/home"}),

    (req, res) => {
        const token = generateToken(req.user._id)
        logToConsole("oauth linkedin route", req.user)
        res.redirect(`/dashboard?token=${token}`)
    }
)

router.get("/twitter", twitterPassport.authenticate("twitter"))

router.get("/twitter/callback", 
    twitterPassport.authenticate("twitter", {session: false, failureRedirect: "/home"}),

    (req, res) => {
        const token = generateToken(req.user._id)
        logToConsole("oauth twitter route", req.user)
        res.redirect(`/dashboard?token=${token}`)
    }
)

module.exports = router