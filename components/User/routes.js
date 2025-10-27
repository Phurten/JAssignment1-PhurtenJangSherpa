import express from "express";
const router = express.Router();

import userController from "./controller.js";

// /user
router.get("/user", userController.getUser)

// /user/login
router.get("/login", userController.loginForm);

//login form submit
router.post("/login", userController.login);

// /user/logout
router.get("/logout", userController.logout)

export default router;