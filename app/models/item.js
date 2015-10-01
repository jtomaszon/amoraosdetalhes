var mongoose = require('mongoose');

module.exports = mongoose.model('Item', {
    text : String
});