const {
    Schema,
    model
} = require('mongoose');

module.exports = model("users", new Schema({
    username: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "user"
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    lastResetPassword: Date,
    refreshToken: [String]
}));