const userRoutes = require("express").Router();

import { signup, login } from "../controller/user-controller.js";
import { loginValidator, signupValidator } from "../middleware/validator";

userRoutes.post("/signup", signupValidator, signup);
userRoutes.post("/login", loginValidator, login);

export default userRoutes;
