var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bucketlistSchema = new Schema({
    name: String,
    items: Array,
    created_by: String,
    date_created: String,
    date_modified: String,
})

var Bucketlist = mongoose.model('bucketlist', bucketlistSchema);

module.exports =  Bucketlist;