import skillModel from "./model.js";

//admin page list all skills
const getAllSkills = async (request, response) => {
  try {
    const skillList = await skillModel.getAllSkills();
    const categories = await skillModel.getCategories();
    response.render("skill/admin-skills", { 
      skills: skillList,
      categories,
      currentPage: 'skills',
      user: request.session.user 
    });
  } catch (error) {
    console.error("Error getting skills:", error);
    response.render("skill/admin-skills", { 
      skills: [],
      categories: [],
      error: "Error loading skills",
      currentPage: 'skills',
      user: request.session.user 
    });
  }
};



//admin page process add skill
const addSkill = async (request, response) => {
  try {
    console.log("=== ADD SKILL REQUEST ===");
    console.log("Content-Type:", request.headers['content-type']);
    console.log("Request body:", request.body);
    console.log("Session:", { loggedIn: request.session.loggedIn, user: request.session.user?.username });
    
    //validating required fields
    if (!request.body.name || !request.body.category || !request.body.proficiency) {
      console.log("Validation failed - missing required fields");
      const categories = await skillModel.getCategories();
      const skillList = await skillModel.getAllSkills();
      return response.render("skill/admin-skills", { 
        skills: skillList,
        categories,
        currentPage: 'skills',
        error: "Please fill in all required fields (Name, Category, and Proficiency Level).",
        user: request.session.user 
      });
    }
    
    const skillData = {
      name: request.body.name.trim(),
      category: request.body.category,
      proficiency: parseInt(request.body.proficiency),
      description: request.body.description ? request.body.description.trim() : '',
      yearsOfExperience: request.body.yearsOfExperience ? parseFloat(request.body.yearsOfExperience) : null,
      iconUrl: request.body.iconUrl ? request.body.iconUrl.trim() : '',
      featured: request.body.featured === 'on'
    };
    
    console.log("Processed skill data:", skillData);

    const result = await skillModel.addSkill(skillData);
    if (result) {
      response.redirect("/admin/skills");
    } else {
      const categories = await skillModel.getCategories();
      const skillList = await skillModel.getAllSkills();
      response.render("skill/admin-skills", { 
        skills: skillList,
        categories,
        currentPage: 'skills',
        error: "Error adding skill. Please check your input and try again.",
        user: request.session.user 
      });
    }
  } catch (error) {
    console.error("Error adding skill:", error);
    const categories = await skillModel.getCategories();
    const skillList = await skillModel.getAllSkills();
    response.render("skill/admin-skills", { 
      skills: skillList,
      categories,
      currentPage: 'skills',
      error: error.message || "Error adding skill. Please check your input and try again.",
      user: request.session.user 
    });
  }
};



//admin page process edit skill
const editSkill = async (request, response) => {
  try {
    const skillData = {
      name: request.body.name,
      category: request.body.category,
      proficiency: parseInt(request.body.proficiency),
      description: request.body.description,
      yearsOfExperience: request.body.yearsOfExperience ? parseInt(request.body.yearsOfExperience) : null,
      iconUrl: request.body.iconUrl,
      featured: request.body.featured === 'on'
    };

    const result = await skillModel.updateSkill(request.params.id, skillData);
    if (result) {
      response.redirect("/admin/skills");
    } else {
      const categories = await skillModel.getCategories();
      response.render("skill/edit-skill", { 
        skill: skillData,
        categories,
        error: "Error updating skill",
        currentPage: 'skills',
        user: request.session.user 
      });
    }
  } catch (error) {
    console.error("Error updating skill:", error);
    response.redirect("/admin/skills");
  }
};

//admin page delete skill
const deleteSkill = async (request, response) => {
  try {
    await skillModel.deleteSkill(request.params.id);
    response.redirect("/admin/skills");
  } catch (error) {
    console.error("Error deleting skill:", error);
    response.redirect("/admin/skills");
  }
};

//json api get all skills
const getSkillsJSON = async (request, response) => {
  try {
    const skillList = await skillModel.getAllSkills();
    response.json(skillList);
  } catch (error) {
    console.error("Error getting skills JSON:", error);
    response.status(500).json({ error: "Error loading skills" });
  }
};

export default {
  getAllSkills,
  addSkill,
  editSkill,
  deleteSkill,
  getSkillsJSON
};