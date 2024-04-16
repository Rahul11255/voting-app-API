const User = require("../models/User");
const bcrypt = require("bcrypt");
const { generateToken } = require("../jwt");
const cloudinary = require("cloudinary").v2;
const fs = require('fs');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const signupUser = async (req, res) => {
  try {
    // Define salt rounds for password hashing
    const saltRounds = 10;

    // Destructure user details from request body
    const { fname, lname, state, gender, email, password, isVoted, role, age } = req.body;

    // Check if trying to create an admin user and if admin user already exists
    const adminUser = await User.findOne({ role: "admin" });
    if (role === "admin" && adminUser) {
      return res.status(400).json({ error: "Admin user already exists" });
    }

    // Check if user with provided email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email is already registered" });
    }

    // Hash the user's password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    let imagePath = "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?w=740&t=st=1712739152~exp=1712739752~hmac=88952ebb16b4caf309768844393d48bf02caed15b6cac9282c0efe1fc00a4ae2";

    // Check if a file was uploaded
    if (req.files && req.files.file) {
      // If file was uploaded, upload it to Cloudinary
      const photo = req.files.file;
      cloudinary.uploader.upload(photo.tempFilePath, async (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Error uploading image" });
        }

        try {
          // Create a new user object
          const newUser = new User({
            fname,
            lname,
            email,
            isVoted,
            role,
            age,
            state,
            gender,
            password: hashedPassword,
            image: result.url,
          });

          // Save the new user to the database
          const savedUser = await newUser.save();

          // Generate token for authentication
          const payload = {
            id: savedUser.id,
          };
          const token = generateToken(payload);

          // Return success response with user details and token
          res.status(200).json({
            message: "Signup Success Please Signin",
            user: savedUser,
            token: token,
          });

          // Delete the temporary file after successful upload
          fs.unlink(photo.tempFilePath, (err) => {
            if (err) {
              console.error("Error deleting file:", err);
            } else {
              console.log("Temporary file deleted successfully");
            }
          });
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: "An error occurred while registering" });
        }
      });
    } else {
      // If no file was uploaded, set default image path
      try {
        // Create a new user object with default image path
        const newUser = new User({
          fname,
          lname,
          email,
          isVoted,
          role,
          age,
          state,
          gender,
          password: hashedPassword,
          image: imagePath,
        });

        // Save the new user to the database
        const savedUser = await newUser.save();

        // Generate token for authentication
        const payload = {
          id: savedUser.id,
        };
        const token = generateToken(payload);

        // Return success response with user details and token
        res.status(200).json({
          message: "Signup Success Please Signin",
          user: savedUser,
          token: token,
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while registering" });
      }
    }
  } catch (error) {
    // Log and handle errors
    console.error(error);
    res.status(500).json({ error: "An error occurred while registering" });
  }
};


const loginUser = async (req, res) => {
  try {
    // Extract email and password from request body
    const { email, password } = req.body;

    // Find user by email in the database
    const user = await User.findOne({ email });

    // If user does not exist, return error
    if (!user) {
      return res.status(400).json({ error: "Invalid Email Address" });
    }

    // Compare password hashes to verify password correctness
    const validate = await bcrypt.compare(password, user.password);
    if (!validate) {
      return res.status(400).json({ error: "Invalid  password" });
    }
    // Generate token for authentication
    const payload = {
      id: user.id,
    };
    const token = generateToken(payload);

    // Return success response with token
    res
      .status(200)
      .json({ message: "Login successful", user: user, token: token });
  } catch (error) {
    // Log and handle errors
    console.error(error);
    res.status(500).json({ error: "An error occurred while user login" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password"); // Exclude password field from the result
    const isLength = users.length;
    let femaleUser = 0;
    let maleUser = 0;
    let votedUsers = 0;

    users.forEach((user) => {
      if (user.gender === "male") {
        maleUser++;
      } else {
        femaleUser++;
      }

      if (user.isVoted === true) {
        votedUsers++;
      }
    });

    console.log(
      `toatal female user : ${femaleUser} , total male user : ${maleUser}`
    );

    res.status(200).json({ isLength, femaleUser, maleUser, votedUsers, users });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: "An error occurred, users not found" });
  }
};

const getSingleUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    const { password, ...other } = user._doc;
    res.status(200).json(other);
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: "An error occurred, users not found" });
  }
};

module.exports = { signupUser, loginUser, getAllUsers, getSingleUser };


