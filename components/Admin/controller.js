import ProjectModel from "../Project/model.js";
import SkillModel from "../Skill/model.js";
import { getAllBlogs } from "../Blog/model.js";

//homepage: redirecting to admin dashboard if logged in, otherwise redirecting to login
const homepage = async (request, response) => {
  if (request.session.loggedIn) {
    response.redirect("/admin");
  } else {
    response.redirect("/login");
  }
};

//admin dashboard
const getDashboard = async (request, response) => {
  try {
    //getting counts for dashboard stats
    const projects = await ProjectModel.getAllProjects();
    const skills = await SkillModel.getAllSkills();
    const blogs = await getAllBlogs();

    response.render("admin/dashboard", {
      projectCount: projects.length,
      skillCount: skills.length,
      blogCount: blogs.length,
      currentPage: 'dashboard',
      user: request.session.user
    });
  } catch (error) {
    console.error("Error loading dashboard:", error);
    response.render("admin/dashboard", {
      projectCount: 0,
      skillCount: 0,
      blogCount: 0,
      error: "Error loading dashboard data",
      currentPage: 'dashboard',
      user: request.session.user
    });
  }
};

export { homepage, getDashboard };
