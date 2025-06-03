const handlebars = require("handlebars")
const fs = require("fs")

const getEmailTemplate = (templatePath, data) => {
    const templateSource = fs.readFileSync(templatePath, "utf8")
    const template = handlebars.compile(templateSource)

    return template(data)
}

module.exports = { getEmailTemplate }