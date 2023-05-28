import express from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config();
app.use(express.json());
import md5 from "md5";
import { queryExecuter, queryRunner } from "../utils/connection";
import { responseDisplay, responsefunc } from "../helpers/response";
import { errorHandler } from "../helpers/error-handler";
import { tokenGenerator } from "../middleware/jwt-validation";

const signup = async (req: Request, res: Response) => {
  const { name, email, username, password, phone, typeId }: any = req.body;

  const values: [any[]] = [
    [name, email, username, md5(password), phone, typeId],
  ];
  const sqlst =
    "INSERT INTO users (name,email,username,password,phone,typeId) VALUES (?) ;";
  await queryExecuter(sqlst, values, res, "Signed Up");
};

const login = async (req: Request, res: Response) => {
  const { email, password }: any = req.body;
  const typeId = await queryRunner(
    "SELECT typeId from users WHERE email = '" + email + "'",
    res
  );

  try {
    const values = [[email, password]];
    const user = await queryRunner(
      "SELECT username FROM users WHERE email = '" +
        values[0][0] +
        "' AND typeId = '" +
        typeId[0].typeId +
        "';",
      res
    );

    if (user === undefined || user.length === 0) {
      return new errorHandler(401, false, "Invalid Credentials", {}, res);
    } else {
      const pswd = await queryRunner(
        "SELECT password FROM users WHERE email = '" + email + "';",
        res
      );

      if (md5(password) === pswd[0].password) {
        const id = await queryRunner(
          "SELECT userId from users WHERE email = '" + email + "'",
          res
        );

        const tk = await tokenGenerator(id[0].userId, typeId[0].typeId);
        await responseDisplay(201, true, "Login Successfull", tk, res);
      } else {
        new errorHandler(400, false, "Wrong Password", {}, res);
      }
    }
    return;
  } catch (err: any) {
    new errorHandler(401, false, err.message, {}, res);
  }
};

export { signup, login };
