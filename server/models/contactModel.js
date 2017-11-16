const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    mobilePhone: String,
    email: String,
    birthDate: Date
});

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;