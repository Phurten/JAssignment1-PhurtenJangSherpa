import mongoose from "mongoose";
import { scryptSync } from "crypto";

const UserSchema = new mongoose.Schema({
  user: String,
  password: String
});
const User = mongoose.model("User", UserSchema);

async function authenticateUser(username, pw) {
  let key = scryptSync(pw, process.env.SALT, 64);
  //checking for existing user with matching hashed password
  let result = await User.findOne({
    user: username,
    password: key.toString("base64")
  });
  return (result) ? true : false;
}
async function getUser(username) {
  //checking if username exists already
  let result = await User.findOne({ user: username });
  return (result) ? result : false;
}

//nitializing with default admin user
async function initializeUsers() {
  const existingUsers = await User.find({});
  if (existingUsers.length === 0) {
    //creating default admin user
    const defaultAdmin = {
      username: "admin",
      password: "phurten"
    };
    
    console.log("Creating default admin user...");
    
    //creating user manually since we're removing addUser function
    let key = scryptSync(defaultAdmin.password, process.env.SALT, 64);
    let newUser = new User({
      user: defaultAdmin.username,
      password: key.toString("base64")
    });
    await newUser.save();
    
    console.log("Default admin user created:");
    console.log("Username: admin");
    console.log("Password: phurten");
  }
}

export default {
  authenticateUser,
  getUser,
  initializeUsers
};