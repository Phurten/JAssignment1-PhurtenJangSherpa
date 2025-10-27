import userModel from "./model.js"

//controller function for GET user page
const getUser = async (request, response) => {
  //console.log(request.session);
  if (request.session.user) {
    //rendering user page
    response.render("user/user", { user: request.session.user });
  } else {
    response.redirect("/login");
  }
}
//controller function for GET login page
const loginForm = (request, response) => {
  //rendering login page
  response.render("user/login");
}
//controller function for POST login form
const login = async (request, response) => {
  //authenticating user and redirecting to admin dashboard
  let auth = await userModel.authenticateUser(request.body.u, request.body.pw);
  console.log(auth);
  if (auth) {
    //if authenticated, set session variables
    request.session.loggedIn = true;
    request.session.user = request.body.u;
    //redirecting directly to admin dashboard
    response.redirect("/admin");
  } else {
    response.render("user/login", { err: "User not found" });
  }
}
//controller function for GET logout path
const logout = (request, response) => {
  //destroying session and redirect to home
  request.session.destroy();
  response.redirect("/");
}

export default {
  getUser,
  loginForm,
  login,
  logout
};