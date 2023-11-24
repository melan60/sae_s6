const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;
const Config = require("../config");
const ResultSchema = require("./result.schema");

let UserSchema = new Schema(  {
    name: {
      type: String,
      required: true,
      minLength: Config.NAME_MIN_SIZE,
      maxLength: Config.NAME_MAX_SIZE,
    },
    firstName: {
      type: String,
      required: true,
      minLength: Config.NAME_MIN_SIZE,
      maxLength: Config.NAME_MAX_SIZE,
    },
    password: {
      type: String,
      required: true,
      minLength: Config.USER_PASSWORD_MIN_SIZE,
      maxLength: Config.USER_PASSWORD_MAX_SIZE,
    },
    email: {
      type: String,
      required: true,
        unique: true,
      minLength: Config.USER_EMAIL_MIN_SIZE,
      maxLength: Config.USER_EMAIL_MAX_SIZE,
    },
    age: {
      type: Number,
      required: false,
    },
    gender: {
      type: String,
      required: false,
      enum: Config.genders,
    },
    typeUser: [{ type: String, enum: Config.rights, required: true }],
    results: [ResultSchema],
  },
    { versionKey: false }
);

UserSchema.plugin(uniqueValidator);

module.exports = UserSchema;
