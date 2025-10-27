import express from "express";
const router = express.Router();

import { homepage, getDashboard } from "./controller.js";

//checking if user is logged in for admin routes
const requireAuth = (request, response, next) => {
  if (request.session.loggedIn) {
    next();
  } else {
    response.redirect("/login");
  }
};

//homepage
router.get("/", homepage);

//admin dashboard (protected)
router.get("/admin", requireAuth, getDashboard);

export default router;
