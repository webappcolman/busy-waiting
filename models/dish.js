var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongooseUniqueValidator = require('mongoose-unique-validator');

var Restaurant = require('./restaurant');

var schema = new Schema({
    name: {type: String, required: true},
    price: {type: String, required: true},
    id: {type: String, required: true},
    category: {type: String, required: true, unique: true},
    img: {type: String, required: true, unique: true},
    rest: {
        restId: {type: Schema.Types.ObjectId, ref: 'Restaurant'},
        restName: {type: String, required: true}
    },
    extra: [{
        extraName: {type: String, required: true},
        extraPrice: {type: Number, required: true},
        extraRequired: {type: Boolean, required: true},
        extraType: {type: Number, required: true}
    }]
});

schema.plugin(mongooseUniqueValidator);

module.exports = mongoose.model('Dish', schema);