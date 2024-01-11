const mongoose = require("mongoose");
// let aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const evisaSchema = new mongoose.Schema(
  {
    category: {
      type: ObjectId,
      ref: "EVisaCategory",
      required: [true, "Category is missing"],
      index: true,
    },
    type: {
      type: ObjectId,
      ref: "EVisaType",
      required: [true, "Type is missing"],
      index: true,
    },
    destination: {
      type: ObjectId,
      ref: "EVisaDestination",
      required: [true, "Destination is missing"],
      index: true,
    },
    duration: {
      type: ObjectId,
      ref: "EVisaDuration",
      required: [true, "Duration is missing"],
      index: true,
    },

    visaFee: {
      type: Number,
      required: true,
      required: [true, "Visa Fee is missing"],
    },
    serviceCharges: {
      type: Number,
      required: true,
      required: [true, "Service Charges is missing"],
    },
    selection: {
        type: [String],
        enum: [
            "abc",
            "efg",
            "hij",
            "klm",
            "nop",
            "qrs"
        ]
    }
    
    // createdBy: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "User",
    // },
    // updatedBy: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "User",
    // },
  },
  { timestamps: true, versionKey: false }
);
// visa.plugin(aggregatePaginate);
module.exports = mongoose.model("EVisa", evisaSchema);
