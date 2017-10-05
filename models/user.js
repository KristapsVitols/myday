const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
	username: String,
	password: String,
	password2: String
});

const options = {
    errorMessages: {
        MissingPasswordError: 'Lūdzu norādiet paroli',
        AttemptTooSoonError: 'Account is currently locked. Try again later',
        TooManyAttemptsError: 'Account locked due to too many failed login attempts',
        NoSaltValueStoredError: 'Authentication not possible. No salt value stored',
        IncorrectPasswordError: 'Password or username are incorrect',
        IncorrectUsernameError: 'Password or username are incorrect',
        MissingUsernameError: 'Lūdzu norādiet lietotājvārdu',
        UserExistsError: 'Šāds lietotājs jau ir reģistrēts'
    }
};

userSchema.plugin(passportLocalMongoose, options);

module.exports = mongoose.model('User', userSchema);