import projectModel from "./model.js";

// Admin page - list all projects
const getAllProjects = async (request, response) => {
  try {
    const projectList = await projectModel.getAllProjects();
    response.render("project/admin-projects", { 
      projects: projectList,
      currentPage: 'projects',
      user: request.session.user 
    });
  } catch (error) {
    console.error("Error getting projects:", error);
    response.render("project/admin-projects", { 
      projects: [],
      error: "Error loading projects",
      currentPage: 'projects',
      user: request.session.user 
    });
  }
};



// Admin page - process add project
const addProject = async (request, response) => {
  try {
    // Handle image - either uploaded file or URL
    let imageUrl = request.body.imageUrl;
    if (request.file) {
      imageUrl = `/images/projects/${request.file.filename}`;
    }
    
    const projectData = {
      title: request.body.title,
      description: request.body.description,
      technologies: request.body.technologies ? request.body.technologies.split(',').map(tech => tech.trim()) : [],
      githubUrl: request.body.githubUrl,
      liveUrl: request.body.liveUrl,
      imageUrl: imageUrl,
      endYear: request.body.endYear ? parseInt(request.body.endYear) : null,
      status: request.body.status
    };
    
    // Handle empty status field  
    if (!projectData.status) {
      projectData.status = 'completed';
    }
    
    console.log('Adding project with data:', projectData);

    const result = await projectModel.addProject(projectData);
    if (result) {
      // Check if request is from modal (AJAX) or regular form
      if (request.headers['content-type'] && request.headers['content-type'].includes('multipart/form-data')) {
        // This is likely from a modal, redirect normally (modal will handle)
        response.redirect("/admin/projects");
      } else {
        response.redirect("/admin/projects");
      }
    } else {
      response.status(400).json({ 
        success: false,
        message: "Error adding project. Please check your input and try again."
      });
    }
  } catch (error) {
    console.error("Error adding project:", error);
    // Send JSON error for modal handling
    response.status(400).json({ 
      success: false,
      message: error.message || "Error adding project. Please check your input and try again."
    });
  }
};



// Admin page - process edit project
const editProject = async (request, response) => {
  try {
    // Handle image - either uploaded file or URL
    let imageUrl = request.body.imageUrl;
    if (request.file) {
      imageUrl = `/images/projects/${request.file.filename}`;
    }
    
    const projectData = {
      title: request.body.title,
      description: request.body.description,
      technologies: request.body.technologies ? request.body.technologies.split(',').map(tech => tech.trim()) : [],
      githubUrl: request.body.githubUrl,
      liveUrl: request.body.liveUrl,
      imageUrl: imageUrl,
      endYear: request.body.endYear ? parseInt(request.body.endYear) : null,
      status: request.body.status
    };
    
    // Handle empty status field  
    if (!projectData.status) {
      projectData.status = 'completed';
    }
    
    console.log('Updating project with data:', projectData);

    const result = await projectModel.updateProject(request.params.id, projectData);
    if (result) {
      response.redirect("/admin/projects");
    } else {
      response.status(400).json({ 
        success: false,
        message: "Error updating project. Please check your input and try again."
      });
    }
  } catch (error) {
    console.error("Error updating project:", error);
    response.status(400).json({ 
      success: false,
      message: error.message || "Error updating project. Please check your input and try again."
    });
  }
};

// Admin page - delete project
const deleteProject = async (request, response) => {
  try {
    await projectModel.deleteProject(request.params.id);
    response.redirect("/admin/projects");
  } catch (error) {
    console.error("Error deleting project:", error);
    response.redirect("/admin/projects");
  }
};

// JSON API - get all projects
const getProjectsJSON = async (request, response) => {
  try {
    const projectList = await projectModel.getAllProjects();
    response.json(projectList);
  } catch (error) {
    console.error("Error getting projects JSON:", error);
    response.status(500).json({ error: "Error loading projects" });
  }
};

export default {
  getAllProjects,
  addProject,
  editProject,
  deleteProject,
  getProjectsJSON
};