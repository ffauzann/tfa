getUserByEmail = (email) => {
	const query = `SELECT * FROM users WHERE email = '${email}'`;
	return query;
};

module.exports = {
	getUserByEmail
};
