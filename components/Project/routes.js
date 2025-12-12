import express from "express";
import multer from "multer";
import path from "path";
const router = express.Router();

import projectController from "./controller.js";

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/projects/') // Make sure this directory exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    // Allow only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Middleware to check if user is logged in for admin routes
const requireAuth = (request, response, next) => {
  if (request.session.loggedIn) {
    next();
  } else {
    response.redirect("/login");
  }
};

// JSON API Routes (public)
router.get("/projects", projectController.getProjectsJSON);
router.get("/api/projects", projectController.getProjectsJSON);

// Admin Routes (protected)
router.get("/admin/projects", requireAuth, projectController.getAllProjects);
router.post("/admin/projects/add", requireAuth, upload.single('imageFile'), projectController.addProject);
router.post("/admin/projects/edit/:id", requireAuth, upload.single('imageFile'), projectController.editProject);
router.get("/admin/projects/delete/:id", requireAuth, projectController.deleteProject);

export default router;