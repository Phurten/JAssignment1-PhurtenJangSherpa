import mongoose from "mongoose";

// Project Schema
const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  technologies: [String],
  githubUrl: String,
  liveUrl: String,
  imageUrl: String,
  endYear: { type: Number, min: 2000, max: 2030 },
  status: { type: String, enum: ['completed', 'in-progress', 'planned'], default: 'completed' }
}, { timestamps: true });

const Project = mongoose.model("Project", ProjectSchema);

// Get all projects
async function getAllProjects() {
  return await Project.find({}).sort({ createdAt: -1 });
}

// Get project by ID
async function getProjectById(id) {
  return await Project.findById(id);
}

// Add new project
async function addProject(projectData) {
  try {
    const project = new Project(projectData);
    return await project.save();
  } catch (error) {
    console.error("Error adding project:", error);
    return false;
  }
}

// Update project
async function updateProject(id, projectData) {
  try {
    return await Project.findByIdAndUpdate(id, projectData, { new: true });
  } catch (error) {
    console.error("Error updating project:", error);
    return false;
  }
}

// Delete project
async function deleteProject(id) {
  try {
    return await Project.findByIdAndDelete(id);
  } catch (error) {
    console.error("Error deleting project:", error);
    return false;
  }
}

// Initialize with sample data
async function initializeProjects() {
  const existingProjects = await getAllProjects();
  if (existingProjects.length === 0) {
    const sampleProjects = [
      {
        title: "Portfolio Website",
        description: "A responsive portfolio website built with Node.js, Express, and MongoDB",
        technologies: ["Node.js", "Express", "MongoDB", "Pug", "CSS"],
        githubUrl: "https://github.com/phurten/portfolio",
        liveUrl: "https://phurten-portfolio.herokuapp.com",
        imageUrl: "/images/portfolio-preview.jpg",
        endYear: 2024,
        status: "completed"
      },
      {
        title: "E-commerce API",
        description: "RESTful API for an e-commerce platform with user authentication and payment processing",
        technologies: ["Node.js", "Express", "MongoDB", "JWT", "Stripe API"],
        githubUrl: "https://github.com/phurten/ecommerce-api",
        endYear: 2024,
        status: "completed"
      },
      {
        title: "Task Management App",
        description: "A collaborative task management application with real-time updates",
        technologies: ["React", "Node.js", "Socket.io", "MongoDB"],
        githubUrl: "https://github.com/phurten/task-manager",
        status: "in-progress"
      }
    ];
    
    for (const project of sampleProjects) {
      await addProject(project);
    }
  }
}

export default {
  getAllProjects,
  getProjectById,
  addProject,
  updateProject,
  deleteProject,
  initializeProjects
};