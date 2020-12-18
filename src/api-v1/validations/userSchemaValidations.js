function validateEmailFormat() {
	const strongEmailRegex = new RegExp(
		/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	);
	return strongEmailRegex.test(this.email);
}

function validatePasswordFormat() {
	const strongPasswordRegex = new RegExp(
		"^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
	);
	return strongPasswordRegex.test(this.password);
}

module.exports = { validateEmailFormat, validatePasswordFormat };
