const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');

const app = express();

// * BODY PARSER MIDDLEWARE
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// * PASSPORT MIDDLEWARE
app.use(passport.initialize());

// * PASSPORT CONFIG
require('./config/passport');

// * ROUTES
const api = require('./routes/auth');
app.use('/api/users', api);

// * SERVE
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server up on port ${port}`));
