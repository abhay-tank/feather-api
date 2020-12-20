function validateEmailFormat(extEmail) {
  const email = this.email ? this.email : extEmail;
  const strongEmailRegex = new RegExp(
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
  return strongEmailRegex.test(email);
}

function validatePasswordFormat(extPassword) {
  const password = this.password ? this.password : extPassword;
  const strongPasswordRegex = new RegExp(
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
  );
  return strongPasswordRegex.test(password);
}

module.exports = { validateEmailFormat, validatePasswordFormat };
