// @ts-check
const mongoose = require('mongoose')

const evisaTypeSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        lowercase: true,
        unique:true,
        required: [true, 'Visa Type is missing'],
    }
}
    , { timestamps: true }
)

module.exports = mongoose.model("EVisaType", evisaTypeSchema)