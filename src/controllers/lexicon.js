const { validateBody, getSortBy } = require('../helpers/route');
const { HttpStatusCode } = require('../helpers/http');
const {
    LexiconAlreadyExists,
    LexiconNotFound,
    InvalidRequest
} = require('../helpers/error');
const { PaginationResponse } = require('../helpers/response');
const Lexicon = require('../models/lexicon');

exports.getLexicons = async (req, res) => {
    try {
        const skip = parseInt(req.query.skip);
        const limit = parseInt(req.query.limit);
        const sort = getSortBy(req.query.sortBy, 'createdAt:desc')

        const lexicons = await Lexicon.find().skip(skip).limit(limit).sort(sort);
        const totalItems = await Lexicon.find().countDocuments();
        
        res.status(HttpStatusCode.OK).send(new PaginationResponse(totalItems, skip, limit, lexicons));
    } catch (e) {
        res.status(e.httpStatusCode || HttpStatusCode.INTERNAL_SERVER_ERROR).send(e);
    }
}

exports.createLexicon = async (req, res) => {
    try {
        validateBody(req.body, 'word', 'rating');

        const existingLexicon = await Lexicon.findOne({ word: req.body.word });

        if (existingLexicon) {
            throw new LexiconAlreadyExists();
        }

        const lexicon = await new Lexicon({
            word: req.body.word,
            rating: req.body.rating,
            createdBy: req.user._id
        }).save();
        
        res.status(HttpStatusCode.CREATED).send(lexicon);
    } catch (e) {
        res.status(e.httpStatusCode || HttpStatusCode.INTERNAL_SERVER_ERROR).send(e);
    }
}

exports.updateLexicon = async (req, res) => {
    try {
        if (!Object.keys(req.body).length) {
            throw new InvalidRequest();
        }

        const allowedUpdates = ['word', 'rating'];

        Object.keys(req.body).forEach(key => {
            if (!allowedUpdates.includes(key)) {
                throw new InvalidRequest();
            }
        });

        const lexicon = await Lexicon.findById(req.params.id);

        Object.keys(req.body).forEach(key => lexicon[key] = req.body[key]);
        await lexicon.save();

        res.status(HttpStatusCode.OK).send(lexicon);
    } catch (e) {
        res.status(e.httpStatusCode || HttpStatusCode.INTERNAL_SERVER_ERROR).send(e);
    }
}

exports.deleteLexicon = async (req, res) => {
    try {
        const existingLexicon = await Lexicon.findById(req.params.id);

        if (!existingLexicon) {
            throw new LexiconNotFound();
        }

        await Lexicon.findByIdAndDelete(req.params.id);

        res.status(HttpStatusCode.NO_CONTENT).send();
    } catch (e) {
        res.status(e.httpStatusCode || HttpStatusCode.INTERNAL_SERVER_ERROR).send(e);
    }
}

exports.validateText = async (req, res) => {
    try {
        validateBody(req.body, 'text');

        const allWords = await Lexicon.find();
        const textWords = req.body.text.split(' ');

        let sum = 0;
        let numOfMatchedWords = 0;

        textWords.forEach(word => {
            const wordExists = allWords.find(item => item.word.indexOf(word.trim().toLowerCase()) > -1);

            if (wordExists) {
                sum += wordExists.rating;
                numOfMatchedWords++;
            }
        });

        const sentimentValue = sum && numOfMatchedWords ? sum / numOfMatchedWords : 0;

        res.status(HttpStatusCode.OK).send({ sentimentValue });
    } catch (e) {
        res.status(e.httpStatusCode || HttpStatusCode.INTERNAL_SERVER_ERROR).send(e);
    }
}