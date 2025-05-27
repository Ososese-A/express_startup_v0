const {validationResult, matchedData} = require("express-validator")
const { logToConsole } = require("../utility/sample.utility")
const User = require("../databases/db_nosql/models/user.mongodb.model")

const createOne = async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, msg: errors.array() })
    }

    const data = matchedData(req)
    // logToConsole("Sample controller create one", data)

    try {
        const userCheck = await User.find({username: data.username})

        if (userCheck) return res.status(409).json({success: false, msg: "User already exists" })

        const user = await User.create(data)

        if (!user) return res.status(400).json({success: false, msg: "An occured, please try again"})

        res.status(201).json({ success: true, msg: "It works", user})
    } catch (err) {
        res.status(500).json({success: false, error: err.message})
    }
}

const createMany = async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) return res.status(400).json({ success: false, msg: errors.array() })

    const {users} = req.body

    if (!Array.isArray(users) || users.length === 0) return res.status(400).json({ success: false, msg: "Invalid input, expected an array of users" })

    const validUsers = []
    const invalidUsers = []

    for (const user of users) {
        const errors = validationResult({body: user})
        if (!errors.isEmpty()) {
            invalidUsers.push({user, errors: errors.array()})
        } else {
            validUsers.push(user)
        }
    }

    if (validUsers.length > 0) {
        try {
            //extract usernames
            const usernames = users.map(user => user.username)

            //find existing users in the db
            const existingUsers = await User.find({username: {$in: usernames}})

            //extract existing usernames
            const existingUsernames = existingUsers.map(user => user.username)

            //filter out users already in the db
            const newUsers = users.filter(user => !existingUsernames.includes(user.username))

            //insert only new users
            if (newUsers.length > 0) {
                const createdUsers = await User.insertMany(newUsers)
                return res.status(201).json({success: true, users: createdUsers, existingUsers: existingUsernames})
            }

            return res.status(409).json({success: false, msg: "All users already exist", existingUsers: existingUsernames})
        } catch (err) {
            return res.status(500).json({ sucess: false, error: err.message })
        }
    }

    res.status(400).json({success: false, msg: "No valid users to create", invalidUsers})
}

const readOne = async (req, res) => {
    const {username} = req.params
    
    try {
        const user = await User.findOne({username})
        logToConsole("Sample controller readOne", user)

        if (!user) return res.status(404).json({success: false, msg: "User not found"})

        res.status(200).json({success: true, user})
    } catch (err) {
        logToConsole("Sample controller readOne", err.message)
        res.status(500).json({success: false, error: err.message})
    }
}

const readMany = async (req, res) => {
    try {
        const users = await User.find({})
        logToConsole("Sample controller readOne", users)

        res.status(200).json({success: true, users})
    } catch (err) {
        logToConsole("Sample controller readOne", err.message)
        res.status(500).json({success: false, error: err.message})
    }
}

const updateOne = async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, msg: errors.array() })
    }

    const data = matchedData(req)

    const username = data.username
    const newPassword = data.password

    try {
        const user = await User.findOne({username})

        if (!user) return res.status(404).json({success: false, msg: "User not found"})

        user.password = newPassword

        await user.save()

        res.status(200).json({success: true, user})
    } catch (err) {
        logToConsole("Sample controller readOne", err.message)
        res.status(500).json({success: false, error: err.message})
    }
}

const updateMany = async (req, res) => {
    // const errors = validationResult(req)
    const errors = validationResult(req)

    if (!errors.isEmpty()) return res.status(400).json({ success: false, msg: errors.array() })

    const {users} = req.body

    if (!Array.isArray(users) || users.length === 0) return res.status(400).json({ success: false, msg: "Invalid input, expected an array of users" })

    const validUsers = []
    const invalidUsers = []

    for (const user of users) {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            invalidUsers.push({user, errors: errors.array()})
        } else {
            validUsers.push(user)
        }
    }

    if (validUsers.length > 0) {
        try {
            let updatedUsers = []
            let nonExistentUsers = []

            for (const user of validUsers) {
                const doesUserExist = await User.findOne({username: user.username})

                if (doesUserExist) {
                    const userUpdate = await User.findOneAndUpdate({username: user.username}, {password: user.password})
                    updatedUsers.push(userUpdate)
                } else {
                    nonExistentUsers.push(user)
                }
            }

            res.status(200).json({success: true, updatedUsers, nonExistentUsers, invalidUsers})

        } catch (err) {
            logToConsole("Sample controller updateMany", err.message)
            res.status(500).json({success: false, error: err.message})
        }
    }
}

const deleteOne = async (req, res) => {
    const {username} = req.params

    try {
        const user = await User.findOne({username: username})

        console.log(user)

        if (!user) return res.status(404).json({success: false, msg: "User not found"})

        const deletedUser  = await User.findOneAndDelete({username: username})

        res.status(200).json({success: true, deletedUser})
    } catch (err) {
        logToConsole("Sample controller deleteOne", err.message)
        res.status(500).json({success: false, error: err.message})
    }
}

module.exports = {
    createOne,
    createMany,
    readOne,
    readMany,
    updateOne,
    updateMany,
    deleteOne,
}