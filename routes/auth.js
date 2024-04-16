const express = require("express");
const router = express.Router()
const {signupUser,loginUser,getAllUsers,getSingleUser} = require("../controllers/auth")
// const {fileUpload,upload,getImg } = require("../controllers/fileupload")
const {userSignupValidator,userSigninValidator} = require("../validate/auth")
const {runValidation} = require("../validate/index")
const {jwtAuthMiddleware} = require("../jwt")


router.route("/signup").post(userSignupValidator,runValidation,signupUser)
// router.route("/signup").post(upload,userSignupValidator,runValidation,signupUser)
router.route("/login").post(userSigninValidator,runValidation,loginUser)
router.route("/users").get(getAllUsers)
router.route("/singleUser").get(jwtAuthMiddleware,getSingleUser)
// router.route("/photo").post(upload,fileUpload)
// router.route("/getimg/:id").get(getImg)



module.exports = router