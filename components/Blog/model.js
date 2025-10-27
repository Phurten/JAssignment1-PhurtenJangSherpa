import mongoose from "mongoose";

const Schema = mongoose.Schema;

const blogSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, default: 'Admin' },
  category: { type: String },
  tags: [String],
  imageUrl: String,
  readTime: { type: Number, default: 5 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

blogSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const BlogModel = mongoose.model("Blog", blogSchema);

//sample blog data
const blogData = [
  {
    title: "Getting Started with Node.js",
    content: "Node.js is a powerful runtime environment that allows you to run JavaScript on the server-side. In this comprehensive guide, we'll explore the fundamentals of Node.js development and walk you through building your first server application. You'll learn about the event-driven architecture, npm package management, and best practices for Node.js development.",
    author: "Admin",
    category: "Web Development",
    tags: ["nodejs", "javascript", "backend"],
    imageUrl: "/images/blog/nodejs-tutorial.jpg",
    readTime: 5
  },
  {
    title: "CSS Grid vs Flexbox",
    content: "Both CSS Grid and Flexbox are powerful layout systems in modern CSS, but they serve different purposes and excel in different scenarios. CSS Grid is designed for two-dimensional layouts, handling both rows and columns simultaneously, while Flexbox is optimized for one-dimensional layouts. In this detailed comparison, we'll explore when to use each layout system and provide practical examples to help you make the right choice for your projects.",
    author: "Admin", 
    category: "Frontend",
    tags: ["css", "layout", "frontend"],
    imageUrl: "/images/blog/css-grid-flexbox.jpg",
    readTime: 7
  }
];

//initializing blogs if none exist
const initializeBlogs = async () => {
  try {
    const count = await BlogModel.countDocuments();
    if (count === 0) {
      await BlogModel.insertMany(blogData);
      console.log("Sample blog data inserted");
    }
  } catch (error) {
    console.error("Error initializing blogs:", error);
  }
};

//getting all blogs
const getAllBlogs = async () => {
  try {
    return await BlogModel.find().sort({ createdAt: -1 });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return [];
  }
};

//getting blog by id
const getBlogById = async (id) => {
  try {
    return await BlogModel.findById(id);
  } catch (error) {
    console.error("Error fetching blog:", error);
    return null;
  }
};

//adding new blog
const addBlog = async (blogData) => {
  try {
    const blog = new BlogModel(blogData);
    return await blog.save();
  } catch (error) {
    console.error("Error adding blog:", error);
    return null;
  }
};

//updating blog
const updateBlog = async (id, blogData) => {
  try {
    blogData.updatedAt = Date.now();
    return await BlogModel.findByIdAndUpdate(id, blogData, { new: true });
  } catch (error) {
    console.error("Error updating blog:", error);
    return null;
  }
};

//deleting blog
const deleteBlog = async (id) => {
  try {
    return await BlogModel.findByIdAndDelete(id);
  } catch (error) {
    console.error("Error deleting blog:", error);
    return null;
  }
};

export {
  BlogModel,
  getAllBlogs,
  getBlogById,
  addBlog,
  updateBlog,
  deleteBlog,
  initializeBlogs
};