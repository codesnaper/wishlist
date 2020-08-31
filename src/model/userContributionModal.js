const mongodb = require('mongoose');

const participant = new mongodb.Schema({
    userId: String,
    wishId: String,
    amount: Number,
})

module.exports = mongodb.model('participant',participant);