const mongoose = require("mongoose")

const user_schema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, "Please input a valid email address"],
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    hobbies: {
        type: [String],
        default: [],
        set: hobbies =>
            hobbies
                .filter(hobby => hobby.trim() !== "")
                .map(hobby => hobby.trim().toLowerCase())
    },
    age: {
        type: Number,
        required: true,
        min: [0, "Age must be a positive number"],
        max: [500, "Age seems invalid"]
    }
}, { timestamps: true });


const user = mongoose.model("user", user_schema)

module.exports = user