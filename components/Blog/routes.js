import express from "express";
import multer from "multer";
import path from "path";
import { getBlogs, getBlogsJSON, addBlogPost, editBlogPost, deleteBlogPost } from "./controller.js";

const router = express.Router();

//configuring multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/blogs/') // Make sure this directory exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    //allowing only image files
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

//checking if user is logged in for admin routes
const requireAuth = (request, response, next) => {
  if (request.session.loggedIn) {
    next();
  } else {
    response.redirect("/login");
  }
};

//json api routes 
router.get("/blogs", getBlogsJSON);

//admin routes (protected)
router.get("/admin/blogs", requireAuth, getBlogs);
router.post("/admin/blogs/add", requireAuth, upload.single('imageFile'), addBlogPost);
router.post("/admin/blogs/edit/:id", requireAuth, upload.single('imageFile'), editBlogPost);
router.get("/admin/blogs/delete/:id", requireAuth, deleteBlogPost);

export default router;