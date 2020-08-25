const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const db = require('../config/database');
const keys = require('../config/keys');
const queries = require('../config/queries');

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.jwt;

module.exports = (passport) => {
	passport.use(
		new JwtStrategy(opts, (jwt_payload, done) => {
			// * jwt_payload ASSIGNED FROM auth->router.post(login)
			db.query(queries.getUserByEmail(jwt_payload.email), (err, result) => {
				if (err) throw err;

				// * RETURN USER IF MATCH. OTHERWISE, FALSE
				if (result.length > 0) return done(null, result[0]);
				return done(null, false);
			});
		})
	);
};
