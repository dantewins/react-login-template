const {
    Schema,
    model
} = require('mongoose');

module.exports = model("tokens", new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "users",
        unique: true
    },
    token: {
        type: String,
        required: true
    },
    usage: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expireAfterSeconds: 900
    }
}));