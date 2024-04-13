const Candidate = require("../models/Candidate");
const User = require("../models/User");

const checkAdminRole = async (userID) => {
  try {
    const user = await User.findById(userID);
    if (user.role === "admin") {
      return true;
    }
  } catch (error) {
    return false;
  }
};

const createCandidate = async (req, res) => {
  try {
    if (!(await checkAdminRole(req.user.id))) {
      return res.status(403).json({ message: "user does not have admin role" });
    }
    const data = req.body;
    const newCandidate = new Candidate(data);
    const response = await newCandidate.save();
    res
      .status(200)
      .json({ response: response, message: "Candidate added successfully." });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// let's start voting

const votingCandidate = async (req, res) => {
  // no admin can vote
  // user can only vote once

  const candidateID = req.params.candidateID;
  const userId = req.user.id;
  try {
    const candidate = await Candidate.findById(candidateID);

    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    if (user.role == "admin") {
      return res.status(403).json({ message: "admin is not allowed" });
    }

    if (user.isVoted) {
      return res.status(400).json({ message: "You have already voted" });
    }

    // Update the Candidate document to record the vote

    candidate.votes.push({ user: userId });
    candidate.voteCount++;
    await candidate.save();

    //update the user document

    user.isVoted = true;
    await user.save();

    return res.status(200).json({ message: "Vote recorded successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find({}, { password: 0, votes: 0 });
    res.status(200).json(candidates);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred, candidates not found" });
  }
};

const deleteCandidate = async (req, res) => {
  try {
    if (!(await checkAdminRole(req.user.id))) {
      return res.status(403).json({ message: "user does not have admin role" });
    }

    const candidateId = req.params.id;
    const deletedCandidate = await Candidate.findByIdAndDelete(candidateId);

    if (!deletedCandidate) {
      return res.status(404).json({ error: "Candidate not found" });
    }

    res.status(200).json({ message: "Candidate deleted successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the candidate" });
  }
};

// vote count

const voteCounts = async (req, res) => {
  try {
    const candidates = await Candidate.find(
      {},
      { _id: 0, name: 0, age: 0, __v: 0, votes: 0 }
    ).sort({ voteCount: "desc" });
     
    let totalvoted=0 
    candidates.forEach((candiate)=>{
      totalvoted += candiate.voteCount
    })


    res.status(200).json({ totalvoted,candidates});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred, candidates not found" });
  }
};

module.exports = {createCandidate,votingCandidate,getAllCandidates,deleteCandidate,voteCounts,};
