var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var itemSchema = new Schema({
    bucketlistId: String,
    name: String,
    date_created: String,
    date_modified: String,
    done: Boolean
})

var itemList = mongoose.model('items', itemSchema);

module.exports =  itemList;