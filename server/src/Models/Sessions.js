const {
    Schema,
    model
} = require('mongoose');

module.exports = model("sessions", new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "users"
    },
    refreshToken: {
        type: String,
        required: true,
        unique: true
    },
    ip: String,
    browser: String,
    browserVersion: String,
    device: String,
    os: String,
    osVersion: String,
    createdAt: {
        type: Date,
        default: Date.now(),
        expireAfterSeconds: 604800
    }
}));