import { NextFunction } from "express";

import { errorHandler } from "../helpers/error-handler";
import { loginSchema, signupSchema } from "../models/schema";

const loginValidator = (
  req: Request,
  res: Response,
  next: NextFunction,
  err: any
) => {
  const result = loginSchema.validate(req.body);

  if (result.error) {
    new errorHandler(400, false, err.message, {}, res);
  } else next();
};

const signupValidator = (
  req: Request,
  res: Response,
  next: NextFunction,
  err: any
) => {
  const result = signupSchema.validate(req.body);

  if (result.error) {
    new errorHandler(400, false, err.message, {}, res);
  } else next();
};
export { loginValidator, signupValidator };
