const mongodb = require('mongoose');

const wishSchema = new mongodb.Schema({
    wish: String,
    amount: Number,
    eventId: String,
})

module.exports = mongodb.model('wish',wishSchema,"wish");