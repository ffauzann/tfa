const validator = require('validator');
const isEmpty = require('is-empty');

module.exports = validateRegisterInput = (data) => {
	let errors = {};

	// * CONVERT AN EMPTY FIELD TO AN EMPTY STRING
	data.firstName = !isEmpty(data.firstName) ? data.firstName : '';
	data.lastName = !isEmpty(data.lastName) ? data.lastName : '';
	data.email = !isEmpty(data.email) ? data.email : '';
	data.phone = !isEmpty(data.phone) ? data.phone : '';
	data.password = !isEmpty(data.password) ? data.password : '';
	data.confirmPassword = !isEmpty(data.confirmPassword) ? data.confirmPassword : '';

	// * NAME CHECKS
	if (validator.isEmpty(data.firstName)) errors.firstName = 'First name field is required';
	if (validator.isEmpty(data.lastName)) errors.lastName = 'Last name field is required';

	// * EMAIL CHECKS
	if (validator.isEmpty(data.email)) {
		errors.email = 'Email field is required';
	} else if (!validator.isEmail(data.email)) {
		errors.email = 'Invalid email address';
	}

	// * PHONE CHECKS
	if (validator.isEmpty(data.phone)) errors.phone = 'Phone field is required';

	// * PASSWORD CHECKS
	if (validator.isEmpty(data.password)) {
		errors.password = 'password field is required';
	} else if (!validator.isLength(data.password, { min: 6 })) {
		errors.password = 'Password must be at least 6 characters';
	}
	if (!validator.equals(data.password, data.confirmPassword)) errors.confirmPassword = "Password doesn't match";

	return {
		errors,
		isValid: isEmpty(errors)
	};
};
