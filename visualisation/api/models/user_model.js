const mongoose = require('mongoose');
const UserSchema = require('./user_schema');

module.exports = mongoose.model('User', UserSchema);
