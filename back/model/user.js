const mongoose = require("mongoose")
const passportLocalMongoose = require("passport-local-mongoose")

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        unique: true
    },
    chats: [String],
    upvotes: {
        themes: [String],
        comments: [String]
    },
    downvotes: {
        themes: [String],
        comments: [String]
    },
    admin: Boolean,
    createdAt: Date,
    updatedAt: Date
}, { collection: "users" })

userSchema.pre("save", function (next) {
    this.admin = false
    const currentDate = new Date()
    this.updatedAt = currentDate
    if (!this.createdAt)
        this.createdAt = currentDate
    next()
})

userSchema.plugin(passportLocalMongoose)
module.exports = mongoose.model("user", userSchema)