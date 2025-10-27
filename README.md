
# Portfolio Admin Dashboard & API

  

  

This is a assignment for a Node.js Express application for both an admin dashboard and JSON API to manage portfolio content including projects, skills, and blog posts.

  
  

## Features

  

  

### Admin Dashboard

  

-  **Projects Management**: Add, edit, delete portfolio projects with image upload

  

-  **Skills Management**: Add, edit, delete skills with category and proficiency levels

  

-  **Blog Management**: Create and manage blog posts with featured images

  

-  **User Authentication**: Secure admin access with session management

  

-  **Responsive Design**: Mobile-friendly admin interface

  

  

### JSON API Endpoints

  

-  `GET /projects` - Returns all projects as JSON

  

-  `GET /skills` - Returns all skills as JSON

  

-  `GET /blogs` - Returns all blog posts as JSON

  

  

## Technology Stack

  

-  **Backend**: Node.js, Express.js

  

-  **Database**: MongoDB Atlas (Cloud)

  

-  **Template Engine**: Pug

  

-  **File Upload**: Multer

  

-  **Authentication**: Express Sessions

  

-  **Styling**: Bootstrap, Custom CSS

  

-  **Icons**: Phosphor Icons

  

  

## Installation & Setup

  
  

1.  **Install dependencies**

  

```bash
npm  install
```

  

2.  **Environment Variables**

  

Create a `.env` file in the root directory:

  

```env
DBUSER=your_mongodb_username
DBPWD=your_mongodb_password
DBHOST=your_mongodb_host
DBNAME=your_database_name
SESSIONSECRET=your_session_secret
PORT=8888
```

  

  

3.  **Run the application**

  

```bash
npm  run  dev
```

  

  

4.  **Access the admin dashboard**

  

- Navigate to `http://localhost:8888`

  

- Login credentials: e.g. username: admin, password: phurten

  
  

  

## Deployment

  

  

**Live Application**: [Add your deployment URL here]

  

The application is deployed on Render and connected to MongoDB Atlas.

  

  

## Author

  

  

**Phurten Jang Sherpa**

  

Humber College - HTTP5222 Full Stack Development