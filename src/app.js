const express = require('express');
const cors = require('cors');
require('./config/db/mongoose');
const { V1_ROUTE } = require('./helpers/constants');
const authRouter = require('./routers/auth');
const lexiconRouter = require('./routers/lexicon');

const app = express();

app.use(express.json());
app.use(cors());
app.use(V1_ROUTE, authRouter);
app.use(V1_ROUTE, lexiconRouter);

module.exports = app;
