var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    name: {type: String, unique: true, required: true},
    password: {type: String, unique: true, required: true},
    bucketlists: Array
})

var User = mongoose.model('users', userSchema);

module.exports = User;