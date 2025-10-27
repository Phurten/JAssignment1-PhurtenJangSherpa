import mongoose from "mongoose";

//skill schema
const SkillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  proficiency: { type: Number, min: 1, max: 5, required: true }, // 1-5 scale
  description: String,
  yearsOfExperience: Number,
  iconUrl: String,
  featured: { type: Boolean, default: false }
}, { timestamps: true });

const Skill = mongoose.model("Skill", SkillSchema);

//getting all skills
async function getAllSkills() {
  return await Skill.find({}).sort({ category: 1, proficiency: -1 });
}

//getting skills by category
async function getSkillsByCategory(category) {
  return await Skill.find({ category }).sort({ proficiency: -1 });
}

//getting skill by ID
async function getSkillById(id) {
  return await Skill.findById(id);
}

//adding new skill
async function addSkill(skillData) {
  try {
    const skill = new Skill(skillData);
    return await skill.save();
  } catch (error) {
    console.error("Error adding skill:", error);
    return false;
  }
}

//updating skill
async function updateSkill(id, skillData) {
  try {
    return await Skill.findByIdAndUpdate(id, skillData, { new: true });
  } catch (error) {
    console.error("Error updating skill:", error);
    return false;
  }
}

//deleting skill
async function deleteSkill(id) {
  try {
    return await Skill.findByIdAndDelete(id);
  } catch (error) {
    console.error("Error deleting skill:", error);
    return false;
  }
}

//getting unique categories
async function getCategories() {
  return await Skill.distinct('category');
}

//initializing with sample data
async function initializeSkills() {
  const existingSkills = await getAllSkills();
  if (existingSkills.length === 0) {
    const sampleSkills = [
      {
        name: "JavaScript",
        category: "Programming Languages",
        proficiency: 4,
        description: "Modern ES6+ JavaScript for frontend and backend development",
        yearsOfExperience: 3,
        iconUrl: "/images/javascript-icon.png",
        featured: true
      },
      {
        name: "Node.js",
        category: "Backend Technologies",
        proficiency: 4,
        description: "Server-side JavaScript runtime for building scalable applications",
        yearsOfExperience: 2,
        iconUrl: "/images/nodejs-icon.png",
        featured: true
      },
      {
        name: "MongoDB",
        category: "Databases",
        proficiency: 3,
        description: "NoSQL database for modern web applications",
        yearsOfExperience: 2,
        iconUrl: "/images/mongodb-icon.png",
        featured: false
      },
      {
        name: "Express.js",
        category: "Backend Technologies",
        proficiency: 4,
        description: "Fast, unopinionated web framework for Node.js",
        yearsOfExperience: 2,
        iconUrl: "/images/express-icon.png",
        featured: true
      },
      {
        name: "HTML5",
        category: "Frontend Technologies",
        proficiency: 5,
        description: "Semantic markup for modern web applications",
        yearsOfExperience: 4,
        iconUrl: "/images/html5-icon.png",
        featured: false
      },
      {
        name: "CSS3",
        category: "Frontend Technologies",
        proficiency: 4,
        description: "Modern CSS with Flexbox, Grid, and animations",
        yearsOfExperience: 4,
        iconUrl: "/images/css3-icon.png",
        featured: false
      },
      {
        name: "React",
        category: "Frontend Technologies",
        proficiency: 3,
        description: "Component-based library for building user interfaces",
        yearsOfExperience: 1,
        iconUrl: "/images/react-icon.png",
        featured: true
      },
      {
        name: "Git",
        category: "Tools & Technologies",
        proficiency: 4,
        description: "Version control system for tracking code changes",
        yearsOfExperience: 3,
        iconUrl: "/images/git-icon.png",
        featured: false
      }
    ];
    
    for (const skill of sampleSkills) {
      await addSkill(skill);
    }
  }
}

export default {
  getAllSkills,
  getSkillsByCategory,
  getSkillById,
  addSkill,
  updateSkill,
  deleteSkill,
  getCategories,
  initializeSkills
};