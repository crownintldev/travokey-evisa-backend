// @ts-check
const mongoose = require('mongoose')

const evisaDurationSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        lowercase: true,
        unique:true,
        required: [true, 'EVisa Duration is missing'],
    },
    validity: {
        type: String,
        trim: true,
    },
}
    , { timestamps: true }
)

module.exports = mongoose.model("EVisaDuration", evisaDurationSchema)