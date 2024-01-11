const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
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
    },
    files:[]
    
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
evisaSchema.statics.allowedFiles = function (files) {
  console.log(files)
  const allowedFileTypes = ["image/jpeg", "image/png", "application/pdf", "application/msword"];
  for (const file of files) {
    const filetype = file.mimetype ?? file.type
    if (!allowedFileTypes.includes(filetype)) {
      throw new Error("Invalid file type. Only images, PDFs, and DOC files are allowed.");
    }
  }
};

// evisaSchema.pre("save", function (next) {
//   // Check if the files array contains only allowed file types
//   const allowedFileTypes = ["image/jpeg", "image/png", "application/pdf", "application/msword"];
//   for (const file of this.files) {
//     if (!allowedFileTypes.includes(file.type)) {
//       return next(new Error("Invalid file type. Only images, PDFs, and DOC files are allowed."));
//     }
//   }
//   next(); // Proceed with saving if all files are of allowed types
// });


// visa.plugin(aggregatePaginate);
module.exports = mongoose.model("EVisa", evisaSchema);
