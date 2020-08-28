const mongodb = require('mongoose');

const userSchema = new mongodb.Schema({
    name: String,
    contact: String,
    email: String,
    password: String,
    isExternal: Boolean
})

module.exports = mongodb.model('user',userSchema);