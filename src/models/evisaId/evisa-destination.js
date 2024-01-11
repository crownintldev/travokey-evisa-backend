// @ts-check
const mongoose = require('mongoose')

const evisaForSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        lowercase: true,
        unique:true,
        required: [true, 'Destination is missing'],
    }
}
    , { timestamps: true }
)

module.exports = mongoose.model("EVisaDestination", evisaForSchema)