const mongodb = require('mongoose');

const userContribution = new mongodb.Schema({
    userId: Number,
    wishId: Number,
    amount: Number,
})

module.exports = mongodb.model('participant',userContribution);