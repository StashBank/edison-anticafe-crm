const mongoose = require('mongoose');
const Schema = mongoose.Schema

const contactSchema = new Schema({
    contactId: Number,
    firstName: String,
    lastName: String,
    mobilePhone: String,
    email: String,
    birthDate: Date,
    notes: String,
    age: {type: Schema.Types.ObjectId, ref: 'age'},
    target: { type: Schema.Types.ObjectId, ref: 'target' },
    product: { type: Schema.Types.ObjectId, ref: 'product' }
});

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;