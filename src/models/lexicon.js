const mongoose = require('mongoose');
const { InvalidRatingValue } = require('../helpers/error');

const lexiconSchema = new mongoose.Schema({
    word: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true
    },
    rating: {
        type: Number,
        required: true,
        validate(value) {
            if (value < -1 || value > 1) {
                throw new InvalidRatingValue();
            }
          }
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true,
    id: false,
    toObject: {
        virtuals: true,
        versionKey: false
    }
});

const Lexicon = mongoose.model('Lexicon', lexiconSchema);

module.exports = Lexicon;