const MongoClient = require('mongodb').MongoClient;
const connesctionString = require('../setttings').connectionStrings.mongoDB;

const getNextSequence = (name) => {
    return new Promise((resolve, reject) => {
        MongoClient.connect(connesctionString, (err, db) => {
            if (err) {
                return db.close().then(() => reject(err)).catch(reject);
            }
            const counters = db.collection('counters');
            if (!counters) {
                return db.close().then(() => reject(new Error('collection counters not found'))).catch(reject);
            }
            const ret = counters.findAndModify(
                { _id: name },
                [['_id', 'asc']],
                { $inc: { seq: 1 } },
                {new: true},
                (err, res) => {
                    db.close()
                        .then(() => {
                        return err ? reject(err) : resolve(res && res.value && res.value.seq);
                    }).catch(reject);
                }
            );
        });
    });
}

module.exports.getNextSequence = getNextSequence;