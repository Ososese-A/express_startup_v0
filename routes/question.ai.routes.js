//rate and character limiting

const express = require("express")
const router = express.Router()
const {checkSchema} = require("express-validator")
const aiValidationSchema = require("../models/validation/ai.validation.schema")
const {finSuggest} = require("../controllers/question.ai.controller")

router.post("/suggest", checkSchema(aiValidationSchema), finSuggest)

module.exports = router