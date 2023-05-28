import express from "express";
const app = express();
import dotenv from "dotenv";
import { Request } from "express";
import { errorHandler } from "../helpers/error-handler";
import { queryExecuter, queryRunner } from "../utils/connection";
import { responseDisplay } from "../helpers/response";
import { check } from "../middleware/jwt-validation";
dotenv.config();
app.use(express.json());

const createPolicy = async (req: Request, res: Response) => {
  const { email, policyId }: any = req.body;

  const userId = await queryRunner(
    "SELECT userId FROM users WHERE email = '" + email + "'",
    res
  );
  try {
    const values: [number[]] = [[userId[0].userId, policyId]];

    const token = await req.headers.authorization!.split(" ")[1];
    var decode = await check(token);

    if (decode.type === 2) {
      const sqlst1 = "INSERT INTO customer_policy (userId,policyId) VALUES (?)";
      const sqlst2 =
        "INSERT INTO agent_policy (userId,policyId) VALUES(" +
        decode.id +
        "," +
        policyId +
        ")";
      await queryExecuter(sqlst1, values, res, "Policy Added");
      await queryRunner(sqlst2, res);
    } else {
      new errorHandler(401, false, "Unauthorized", {}, res);
    }
  } catch (err: any) {
    new errorHandler(401, false, err.message, {}, res);
  }
};

const viewPolicy = async (req: Request, res: Response) => {
  try {
    const token = await req.headers.authorization!.split(" ")[1];
    var decode = await check(token);

    if (decode) {
      let sqlst: string | any;
      if (decode.type === 1) {
        sqlst =
          "SELECT p.* FROM policies p INNER JOIN customer_policy c ON c.policyId = p.policyId WHERE c.userId = " +
          decode.id +
          ";";
      } else if (decode.type === 2) {
        sqlst =
          "SELECT p.* FROM policies p INNER JOIN agent_policy a ON a.policyId = p.policyId WHERE a.userId = " +
          decode.id +
          ";";
      }

      const query = await queryRunner(sqlst, res);

      if (query.length > 0) {
        await responseDisplay(201, true, "Fetched Successfully", query, res);
      } else {
        new errorHandler(
          404,
          false,
          "Haven't Subscribed any insurance",
          query,
          res
        );
      }
    } else {
      await responseDisplay(
        404,
        false,
        "Haven't Subscribed any insurance",
        {},
        res
      );
    }
  } catch (err: any) {
    new errorHandler(401, false, err.message, {}, res);
  }
};

const earnings = async (req: Request, res: Response) => {
  try {
    const token = await req.headers.authorization!.split(" ")[1];
    var decode = await check(token);

    if (decode.type === 2) {
      const sqlst =
        "SELECT (SUM(policy_price)* 35 /100 ) AS EARNINGS FROM policies p INNER JOIN agent_policy a ON a.policyId = p.policyId WHERE a.userId = " +
        decode.id +
        ";";
      const query = await queryRunner(sqlst, res);

      if (query.length > 0) {
        await responseDisplay(
          201,
          true,
          "Your Earnings fetched Successfully",
          query,
          res
        );
      } else {
        new errorHandler(
          404,
          false,
          "You haven't sold any policies",
          query,
          res
        );
      }
    } else {
      await responseDisplay(401, false, "Unauthorized", {}, res);
    }
  } catch (err: any) {
    new errorHandler(401, false, err.message, {}, res);
  }
};

export { createPolicy, viewPolicy, earnings };
