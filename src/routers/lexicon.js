const express = require('express');
const lexiconController = require('../controllers/lexicon');
const auth = require('../middleware/auth');

const router = new express.Router();

router.get('/lexicon', auth, lexiconController.getLexicons);
router.post('/lexicon', auth, lexiconController.createLexicon);
router.patch('/lexicon/:id', auth, lexiconController.updateLexicon);
router.delete('/lexicon/:id', auth, lexiconController.deleteLexicon);

router.post('/lexicon/validate/text', auth, lexiconController.validateText);

module.exports = router;