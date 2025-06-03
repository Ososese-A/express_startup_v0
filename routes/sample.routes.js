const express = require("express")
const { checkSchema } = require("express-validator")
const userValidationSchema = require("../models/validation/sample.validation.schema")
const multiUserValidationSchema = require("../models/validation/multi.user.validation.schema")

const router = express.Router()

const {
    createOne,
    createMany,
    readOne,
    readMany,
    updateOne,
    updateMany,
    deleteOne,
} = require("../controllers/sample.controller")

//create one 
router.post("/create/", checkSchema(userValidationSchema) , createOne)

//create many 
router.post("/createMany/", checkSchema(multiUserValidationSchema), createMany)

//read all
router.get("/read/", readMany)

//read one
router.get("/read/:username", checkSchema(userValidationSchema), readOne)

//update many 
router.patch("/updateMany/", checkSchema(multiUserValidationSchema), updateMany)

//update one 
router.patch("/updateOne/", checkSchema(userValidationSchema), updateOne)

//delete one 
router.delete("/delete/:username", deleteOne)

module.exports = router