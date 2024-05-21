const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Config = require("../common_variables");
const ResultSchema = require("./result_schema");

let UserSchema = new Schema(
    {
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
            minLength: Config.USER_EMAIL_MIN_SIZE,
            maxLength: Config.USER_EMAIL_MAX_SIZE,
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
        },
        age: {
            type: String,
            enum: Config.age_category,
            required: true
        },
        gender: {
            type: String,
            required: false,
            enum: Config.genders,
        },
        typeUser: { type: String, enum: Config.rights, required: true },
        results: [ResultSchema]
    },
    { versionKey: false }
);

module.exports = UserSchema;
