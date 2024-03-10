const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const prisonerSchema = new Schema({
    googleId: {
        type: String,
        required: true,
        unique: true
    },
    email : {
        type: String
    },
    name: {
        type: String
    },
    picture: {
        type: String
    },
    phoneNumber: {
        type: String
    }
});

const Prisoner = mongoose.model('Prisoner', prisonerSchema);

module.exports = Prisoner;