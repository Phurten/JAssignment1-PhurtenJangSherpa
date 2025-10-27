import express from "express";
const router = express.Router();

import skillController from "./controller.js";

//checking if user is logged in for admin routes
const requireAuth = (request, response, next) => {
  if (request.session.loggedIn) {
    next();
  } else {
    response.redirect("/login");
  }
};

//json api routes (public)
router.get("/skills", skillController.getSkillsJSON);

//admin routes (protected)
router.get("/admin/skills", requireAuth, skillController.getAllSkills);
router.post("/admin/skills/add", requireAuth, skillController.addSkill);
router.post("/admin/skills/edit/:id", requireAuth, skillController.editSkill);
router.get("/admin/skills/delete/:id", requireAuth, skillController.deleteSkill);

export default router;