const express = require('express')
const router = express.Router()
const fs = require('fs')
const handlebars = require('handlebars');
const path = require('path')

router.get('/oauth', (req, res) => {
    const viewPath = path.join(__dirname, "../tests/views/oauth.view.test.hbs")
    fs.readFile(viewPath, 'utf8', (err, source) => {
        if (err) return res.status(500).send('Template error')
        const template = handlebars.compile(source)
        const html = template()
        res.send(html)
    })
})

router.get("/pay", (req, res) => {
    const viewPath = path.join(__dirname, "../tests/views/payment.view.test.hbs")
    fs.readFile(viewPath, 'utf8', (err, source) => {
        if (err) return res.status(500).send('Template error')
        const template = handlebars.compile(source)
        const html = template()
        res.send(html)
    })
})

router.get("/verify-pay/:status/:msg", (req, res) => {
    const viewPath = path.join(__dirname, "../test/views/verify_pay.view.test.hbs")

    //set variables based on the status
    const msg = req.params.msg
    const status = req.params.status
    const data = {
        msg,
        status
    }

    fs.readFile(viewPath, 'utf8', (err, source) => {
        if (err) return res.status(500).send('Template error')
        const template = handlebars.compile(source)
        const html = template(data)
        res.send(html)
    })
})

module.exports = router