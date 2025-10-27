import { getAllBlogs, getBlogById, addBlog, updateBlog, deleteBlog } from "./model.js";

//getting all blogs for admin
const getBlogs = async (request, response) => {
  try {
    const blogs = await getAllBlogs();
    response.render("blog/admin-blogs", { 
      blogs: blogs,
      currentPage: 'blogs',
      user: request.session.user
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    response.render("blog/admin-blogs", { 
      blogs: [], 
      error: "Error loading blogs",
      currentPage: 'blogs',
      user: request.session.user
    });
  }
};

//blogs for JSON API
const getBlogsJSON = async (request, response) => {
  try {
    const blogs = await getAllBlogs();
    response.json(blogs);
  } catch (error) {
    console.error("Error fetching blogs:", error);
    response.status(500).json({ error: "Error loading blogs" });
  }
};

//adding new blog
const addBlogPost = async (request, response) => {
  try {
    //for image: either uploaded file or url
    let imageUrl = request.body.imageUrl;
    if (request.file) {
      imageUrl = `/images/blogs/${request.file.filename}`;
    }
    
    const blogData = {
      title: request.body.title,
      content: request.body.content,
      author: request.body.author || 'Admin',
      category: request.body.category,
      tags: request.body.tags ? request.body.tags.split(',').map(tag => tag.trim()) : [],
      readTime: request.body.readTime ? parseInt(request.body.readTime) : 5,
      imageUrl: imageUrl
    };

    console.log('Adding blog with data:', blogData);

    const result = await addBlog(blogData);
    if (result) {
      response.redirect("/admin/blogs");
    } else {
      response.status(400).json({ 
        success: false,
        message: "Error adding blog. Please check your input and try again."
      });
    }
  } catch (error) {
    console.error("Error adding blog:", error);
    response.status(500).json({ 
      success: false,
      message: "Server error while adding blog: " + error.message
    });
  }
};

//editing blog
const editBlogPost = async (request, response) => {
  try {
    const blogId = request.params.id;
    
    //for image: either uploaded file or url
    let imageUrl = request.body.imageUrl;
    if (request.file) {
      imageUrl = `/images/blogs/${request.file.filename}`;
    }
    
    const blogData = {
      title: request.body.title,
      content: request.body.content,
      author: request.body.author || 'Admin',
      category: request.body.category,
      tags: request.body.tags ? request.body.tags.split(',').map(tag => tag.trim()) : [],
      readTime: request.body.readTime ? parseInt(request.body.readTime) : 5,
      imageUrl: imageUrl
    };

    console.log('Updating blog with data:', blogData);

    const result = await updateBlog(blogId, blogData);
    if (result) {
      response.redirect("/admin/blogs");
    } else {
      response.status(400).json({ 
        success: false,
        message: "Error updating blog. Please check your input and try again."
      });
    }
  } catch (error) {
    console.error("Error updating blog:", error);
    response.status(500).json({ 
      success: false,
      message: "Server error while updating blog: " + error.message
    });
  }
};

//deleting blog
const deleteBlogPost = async (request, response) => {
  try {
    const blogId = request.params.id;
    const result = await deleteBlog(blogId);
    
    if (result) {
      response.redirect("/admin/blogs");
    } else {
      response.status(404).render("blog/admin-blogs", { 
        blogs: await getAllBlogs(),
        error: "Blog not found",
        currentPage: 'blogs',
        user: request.session.user
      });
    }
  } catch (error) {
    console.error("Error deleting blog:", error);
    response.status(500).render("blog/admin-blogs", { 
      blogs: await getAllBlogs(),
      error: "Error deleting blog",
      currentPage: 'blogs',
      user: request.session.user
    });
  }
};

export { getBlogs, getBlogsJSON, addBlogPost, editBlogPost, deleteBlogPost };