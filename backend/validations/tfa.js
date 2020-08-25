const validator = require('validator');
const isEmpty = require('is-empty');

module.exports = validateTFAInput = (data) => {
	let errors = {};

	// * CONVERT AN EMPTY FIELD TO AN EMPTY STRING
	data.code = !isEmpty(data.code) ? data.code : '';

	// * EMAIL CHECKS
	if (validator.isEmpty(data.code)) errors.code = 'Code field is required';
	if (!validator.isNumeric(data.code) || !validator.isLength(data.code, { min: 6, max: 6 }))
		errors.code = 'Code malformed';

	return {
		errors,
		isValid: isEmpty(errors)
	};
};

// JZBF4OSMJ47U23ZTMFIGCVSHGRNX2ZJ6
