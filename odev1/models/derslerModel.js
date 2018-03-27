const mongoose = require('mongoose');

mongoose.connect('mongodb://odev:odev@ds123799.mlab.com:23799/odev1').then(
    () => {
        console.log('connected');
    },
    err => {
        console.log(err);
    }
)

const DersSchema = mongoose.Schema({
    dersAdi: { type: String, required: true },
    dersKodu: { type: String, required: true },
    dersIcerigi: { type: String, required: true },
    index: { type: Number, required: true, default: 0 }
});

const ders = module.exports = mongoose.model('Dersler', DersSchema);

module.exports.getDersler = (callback) => {
    ders.find().sort({ index: 1 }).exec(callback);
}

module.exports.getDersById = (id, callback) => {
    let oId = mongoose.Types.ObjectId(id);
    ders.findOne({ "_id": oId }, callback);
}

module.exports.updateDers = (id, updatedDers, callback) => {
    let oId = mongoose.Types.ObjectId(id);
    ders.findByIdAndUpdate({ "_id": oId }, updatedDers, callback);
}