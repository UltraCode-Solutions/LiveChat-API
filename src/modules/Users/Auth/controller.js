import jwt from "jsonwebtoken";
import argon2 from "argon2";
import UsersModel from "../schema.js";

export const createUser = async (req, res) => {
   const { firstName, lastName, email, password } = req.body;
   try {
      // Check if user is already logged in
      if (req.user) {
         return res.status(400).json({
            success: false,
            message: "You're already logged in, log out before trying to sign up",
         });
      }
      // Validate input fields
      if (!firstName || !lastName || !email || !password) {
         return res.status(400).json({ success: false, message: "All fields are required" });
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      // Validate password length and complexity
      if (password.length < 8) {
         return res
            .status(400)
            .json({ success: false, message: "Password must be at least 8 characters long" });
      }
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
      if (!passwordRegex.test(password)) {
         return res.status(400).json({
            success: false,
            message: "Password must contain at least one letter and one number",
         });
      }
      if (!emailRegex.test(email)) {
         return res.status(400).json({ success: false, message: "Invalid email address" });
      }
      // Check if email is already in use
      const findUser = await UsersModel.findOne({ email: email });
      if (findUser) {
         return res.status(400).json({ success: false, message: "Email already in use" });
      }
      // Hash the password with Argon2
      const hashedPassword = await argon2.hash(password);
      // Create a new user
      const newUser = new UsersModel({
         firstName: firstName,
         lastName: lastName,
         email: email,
         password: hashedPassword,
      });
      await newUser.save();
      // Generate JWT token
      const token = jwt.sign({ email: newUser.email }, process.env.JWT_SECRET, {
         expiresIn: "1h",
      });
      // Respond with success and token
      return res
         .status(201)
         .json({ success: true, message: "User created successfully", token });
   } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: "Internal Server Error" });
   }
};


export const loginUser = async (req, res) => {
   const { email, password } = req.body;
   try {
      // Check if user is already logged in
      if (req.user) {
         return res.status(400).json({ success: false, message: "You're already logged in" });
      }
      // Find the user in the database
      const user = await UsersModel.findOne({ email: email });
      // Check if the user exists
      if (!user) {
         return res.status(400).json({ success: false, message: "User or password do not match" });
      }
      // Verify the password using Argon2
      const isPasswordValid = await argon2.verify(user.password, password);
      if (!isPasswordValid) {
         return res.status(400).json({ success: false, message: "User or password do not match" });
      }
      // Generate JWT token
      const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
      // Respond with success and token
      return res.status(200).json({ success: true, message: "Logged in", token });
   } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: "Internal Server Error" });
   }
};
