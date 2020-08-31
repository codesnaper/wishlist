const mongodb = require('mongoose');

const eventSchema = new mongodb.Schema({
    name: String,
    endDate: Date,
    organiserid: String,
    code: Number,
})

module.exports = mongodb.model('event',eventSchema,'event');