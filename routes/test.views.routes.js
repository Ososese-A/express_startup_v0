const express = require('express')
const router = express.Router()
const fs = require('fs')
const handlebars = require('handlebars');
const path = require('path')

router.get('/oauth', (req, res) => {
    const viewPath = path.join(__dirname, "../tests/views/oauth.view.test.hbs")
    fs.readFile(viewPath, 'utf8', (err, source) => {
        if (err) return res.status(500).send('Template error')
        const template = handlebars.compile(source);
        const html = template()
        res.send(html);
    })
})

module.exports = router