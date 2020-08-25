const validator = require('validator');
const isEmpty = require('is-empty');

module.exports = validateLoginInput = (data) => {
	let errors = {};

	// * CONVERT AN EMPTY FIELD TO AN EMPTY STRING
	data.email = !isEmpty(data.email) ? data.email : '';
	data.password = !isEmpty(data.password) ? data.password : '';

	// * EMAIL CHECKS
	if (validator.isEmpty(data.email)) {
		errors.email = 'Email field is required';
	} else if (!validator.isEmail(data.email)) {
		errors.email = 'Invalid email address';
	}

	// * PASSWORD CHECKS
	if (validator.isEmpty(data.password)) errors.password = 'password field is required';

	return {
		errors,
		isValid: isEmpty(errors)
	};
};
