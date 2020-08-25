const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');

const db = require('../config/database');
const keys = require('../config/keys');
const queries = require('../config/queries');

const validateRegisterInput = require('../validations/register');
const validateLoginInput = require('../validations/login');
const validateTFAInput = require('../validations/tfa');

// * POST: api/users/register
// * ACCESSIBLE: PUBLIC
router.post('/register', (req, res) => {
	// * FORM VALIDATION (NEVER BELIEVE USER'S INPUT, THEY SAID)
	const { errors, isValid } = validateRegisterInput(req.body);

	// ! ABORT IF THERE'S A MALFORMAT DATA
	if (!isValid) return res.status(400).json(errors);

	db.query(queries.getUserByEmail(req.body.email), (err, result) => {
		if (err) throw err;

		// ! ABORT IF THERE'S AN EXISTING EMAIL REGISTERED
		if (result.length > 0) return res.status(400).json({ email: 'Email already exist' });

		// * CONTINUE THE PROCESS
		let user = {
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			email: req.body.email,
			phone: req.body.phone,
			password: req.body.password
		};

		// * HASH BEFORE STORE
		bcrypt.genSalt(10, (err, salt) => {
			bcrypt.hash(user.password, salt, (err, hash) => {
				if (err) throw err;
				user.password = hash;

				// * FINALLY, STORE IT!
				db.query('INSERT INTO users SET ?', user, (err) => {
					if (err) throw err;
					res.json(user);
				});
			});
		});
	});
});

// * POST: api/users/login
// * ACCESSIBLE: PUBLIC
router.post('/login', (req, res) => {
	// * FORM VALIDATION (NEVER BELIEVE USER'S INPUT, THEY SAID)
	const { errors, isValid } = validateLoginInput(req.body);

	// ! ABORT IF THERE'S A MALFORMAT DATA
	if (!isValid) return res.status(400).json(errors);

	const email = req.body.email;
	const password = req.body.password;

	db.query(queries.getUserByEmail(email), (err, result) => {
		if (err) throw err;

		// ! ABORT IF THERE'S NO EMAIL MATCH
		if (result.length == 0) return res.status(400).json({ email: 'Email not found' });

		// * CONTINUE THE PROCESS, CHECK THE PASSWORD
		let user = result[0];
		bcrypt.compare(password, user.Password).then((isMatch) => {
			// ! ABORT IF PASSWORD DOESN'T MATCH
			if (!isMatch) return res.status(400).json({ incorrectPassword: 'Password is incorrect' });

			// * CREATE JWT PAYLOAD
			const payload = {
				firstName: user.firstName,
				lastName: user.lastName,
				email: user.email,
				phone: user.phone
			};

			// * SIGN TOKEN
			jwt.sign(payload, keys.jwt, { expiresIn: 31556926 }, (err, token) => {
				res.json({ success: true, token: 'Bearer ' + token });
			});
		});
	});
});

// * POST: api/users/tfa
// * ACCESSIBLE: PRIVATE
router.post('/tfa', (req, res) => {
	// * FORM VALIDATION (NEVER BELIEVE USER'S INPUT, THEY SAID)
	const { errors, isValid } = validateTFAInput(req.body);

	// ! ABORT IF THERE'S A MALFORMAT DATA
	if (!isValid) return res.status(400).json(errors);

	// * VERIFY USER'S TOKEN
	const code = req.body.code;
	let isVerified = speakeasy.totp.verify({
		secret: keys.tfa,
		encoding: 'base32',
		token: code
	});

	// ! ABORT IF TOKEN IS INVALID
	if (!isVerified) return res.status(400).json({ invalidToken: 'Token is invalid' });

	return res.json({ success: true });
});

module.exports = router;
