const express = require("express");
const router = express.Router()
const {createCandidate, votingCandidate , getAllCandidates,deleteCandidate,voteCounts} = require("../controllers/candiate")
const {createCandidateValidator} = require("../validate/candidate")
const {runValidation } = require('../validate/index')
const {jwtAuthMiddleware  } = require("../jwt")



router.route("/candidate").post(jwtAuthMiddleware,createCandidateValidator,runValidation,createCandidate)
router.route("/candidates").get(getAllCandidates)
router.route("/candidates/:id").delete(jwtAuthMiddleware,deleteCandidate)
router.route("/vote/:candidateID").get(jwtAuthMiddleware,votingCandidate)
router.route("/candidate/vote").get(voteCounts)




module.exports = router