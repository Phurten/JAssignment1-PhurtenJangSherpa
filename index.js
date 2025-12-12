import "dotenv/config";
import express from "express";
import path from "path"; //needed when setting up static/file paths
import sessions from "express-session";
import { connect } from "./db.js";
import cors from "cors";

//import routers
import userRouter from "./components/User/routes.js";
import projectRouter from "./components/Project/routes.js";
import skillRouter from "./components/Skill/routes.js";
import blogRouter from "./components/Blog/routes.js";
import adminRouter from "./components/Admin/routes.js";

// Import models for initialization
import userModel from "./components/User/model.js";
import { initializeBlogs } from "./components/Blog/model.js";

//connect to DB immediately
connect();

// Initialize default admin user after DB connection
setTimeout(async () => {
  try {
    await userModel.initializeUsers();
    console.log("User initialization completed");
  } catch (error) {
    console.error("Error initializing data:", error);
  }
}, 1000); // Wait 1 second for DB connection to be established

const __dirname = import.meta.dirname;

//set up the Express app
const app = express();
const port = process.env.PORT || "8888";

//set up application template engine
app.set("views", path.join(__dirname, "views")); //the first "views" is the setting name
//the second value above is the path: __dirname/views
app.set("view engine", "pug");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors());

//set up folder for static files
app.use(express.static(path.join(__dirname, "public")));

//set up app to use sessions
app.use(
  sessions({
    secret: process.env.SESSIONSECRET,
    name: "MyUniqueSessID",
    saveUninitialized: false,
    resave: false,
    cookie: {}
  })
);

//set up middleware function to check if user logged in for /user path
/* app.use("/user", (request, response, next) => {
  //get user from session and go to next middleware function
  if (request.session.loggedIn) {
    app.locals.user = request.session.user;
    next();
  } else {
     response.redirect("/login");
  }
}); */
/* app.use("/logout", (request, response, next) => {
  //reset local variable "user"
  app.locals.user = null;
  next();
}); */

//USE PAGE ROUTES FROM ROUTER(S)
app.use("/", userRouter);
app.use("/", projectRouter);
app.use("/", skillRouter);
app.use("/", blogRouter);
app.use("/", adminRouter);

//set up server listening
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});

