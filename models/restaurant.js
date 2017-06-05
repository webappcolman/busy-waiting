var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongooseUniqueValidator = require('mongoose-unique-validator');

var User = require('./user');

var schema = new Schema({
    Name: {type: String, required: true},
    Address: {type: String, required: true},
    Rating: {type: String, required: true},
    Phone: {type: String, required: true, unique: true},
    user: {type: Schema.Types.ObjectId, ref: 'User'},/*,
    Dishs: [{type: Schema.Types.ObjectId, ref: 'Dish'}]*/
});

schema.plugin(mongooseUniqueValidator);

module.exports = mongoose.model('Restaurant', schema);