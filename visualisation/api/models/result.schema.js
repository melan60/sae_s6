const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let ResultSchema = new Schema(
  {
    experience: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Experience",
    },
    reactTime: {
      type: Date, // TODO
      required: false,
    },
    execTime: {
      type: Date,
      required: true,
    },
  },
  { versionKey: false }
);

module.exports = ResultSchema;
