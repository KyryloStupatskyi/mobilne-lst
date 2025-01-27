const { body, validationResult } = require("express-validator");

class AuthValidator {
  validateData(req, res, next) {
    return [
      body("email")
        .isEmail()
        .withMessage("Please enter a valid e-mail address."),
      body("password")
        .isLength({ min: 4, max: 15 })
        .withMessage(
          "Your password is too short or too long. Please use between 4 and 14 characters."
        ),
    ];
  }

  checkValidationResults(req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors });
    }

    next();
  }
}

module.exports = new AuthValidator();
