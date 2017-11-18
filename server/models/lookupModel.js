const mongoose = require('mongoose');

const lookupSchema = new mongoose.Schema({
    name: String
});

const getLookupModel = (lookupName) => mongoose.model(lookupName, lookupSchema);

module.exports = {
    getLookupModel: getLookupModel,
    lookupSchema: lookupSchema
};