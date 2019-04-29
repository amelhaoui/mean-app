const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StationSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: function () {
            return this.name !== "";
        }
    },
    _cars: [{type: Schema.Types.ObjectId, ref: 'Car'}]
});

module.exports.Station = mongoose.model('Station', StationSchema);

const CarSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: function () {
            return this.name !== "";
        }
    },
    available: Boolean,
    _station: {type: Schema.Types.ObjectId, ref: 'Station'}
});

module.exports.Car = mongoose.model('Car', CarSchema);
