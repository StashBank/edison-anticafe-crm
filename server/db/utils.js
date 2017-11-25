const MongoClient = require('mongodb').MongoClient;
const connesctionString = require('../setttings').connectionStrings.mongoDB;

const getNextSequence = (name) => {
    return new Promise((resolve, reject) => {
        MongoClient.connect(connesctionString, (err, db) => {
            if (err) {
                reject(err);
            } else {
                const counters = db.collection('counters');
                const ret = counters.findAndModify(
                    { _id: name },
                    [['_id', 'asc']],
                    { $inc: { seq: 1 } },
                    {new: true},
                    (err, res) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(res && res.value && res.value.seq);
                        }
                    }
                );
            }
        });
    });
}

module.exports.getNextSequence = getNextSequence;