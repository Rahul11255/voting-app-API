const {check}  = require('express-validator')

exports.userSignupValidator = [
    check('fname')
    .not()
    .isEmpty()
    .withMessage(" First Name is required")
    .isLength({ min: 3 })
    .withMessage(" First Name must be 3 characters or more"),


    check('lname')
    .not()
    .isEmpty()
    .withMessage("Last Name is required"),

    check('email')
    .isEmail()
    .withMessage("Must be valid email address"),

    check('password')
    .isLength({ min: 6 })
    // .withMessage("Password must be at least 6 characters long")
    // .matches(/[a-z]/)
    // .withMessage("Missing lowercase letter in password")
    // .matches(/[A-Z]/)
    // .withMessage("Missing uppercase letter in password")
    // .matches(/[0-9]/)
    // .withMessage("Missing digit in password")
    // .matches(/[!@#$%^&*(),.?":{}|<>]/)
    // .withMessage("Missing special character in password"),
    ,
    check('state')
    .not()
    .isEmpty()
    .withMessage("State is required"),
    
    check('gender')
    .not()
    .isEmpty()
    .withMessage("Gender is required"),
    
    check('age')
    .not()
    .isEmpty()
    .withMessage("age is required")

];

exports.userSigninValidator = [

    check('email')
        .isEmail()
        .withMessage("Must be valid email address"),
    check('password')
        .isLength({min: 6})
        .withMessage("Password must be at least 6 characters long"),
];