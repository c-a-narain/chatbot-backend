import express from "express";
import Joi from "joi";
const app = express();
app.use(express.json());

const loginSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(4).required(),
});

const signupSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().lowercase().required(),
  username: Joi.string().min(5).required(),
  password: Joi.string().min(4).required(),
  phone: Joi.number().required(),
  typeId: Joi.number().max(1).required(),
});

export { loginSchema, signupSchema };
