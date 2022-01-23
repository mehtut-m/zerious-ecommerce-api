exports.isEmail = (email) => {
  const emailRegEx =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  return (
    typeof email === 'string' && emailRegEx.test(email.trim().toLowerCase())
  );
};

exports.checkPasswordLength = (password) => {
  return typeof password === 'string' && password.trim().length >= 6;
};

exports.isPasswordMatch = (password, confirmPassword) => {
  return (
    typeof password === 'string' &&
    typeof confirmPassword === 'string' &&
    password.trim() === confirmPassword.trim()
  );
};

exports.isValidName = (name) => {
  return (
    typeof name === 'string' && name.trim().length > 0 && !name.includes(' ')
  );
};
