const {check}  = require('express-validator')

exports.createCandidateValidator = [
    check('name')
    .not()
    .isEmpty()
    .withMessage(" Candidate Name is required"),

    check('party')
    .not()
    .isEmpty()
    .withMessage("Party Name is required"),

    check('age')
    .not()
    .isEmpty()
    .withMessage("Age is required"),

];

