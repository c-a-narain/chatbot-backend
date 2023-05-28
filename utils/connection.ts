import express from "express";
const app = express();
const mysql = require("mysql2");
import dotenv from "dotenv";
const { errorHandler } = require("../helpers/error-handler");
const { responsefunc } = require("../helpers/response");
dotenv.config();
app.use(express.json());

const pool = mysql.createPool({
  host: process.env.SQL_HOST,
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  database: process.env.SQL_DATABASE,
});

const promisePool = pool.promise();

const queryExecuter = async (
  sqlst: string,
  values: any,
  res: Response,
  message: string
) => {
  try {
    await promisePool.query(sqlst, values);
    await responsefunc(201, true, message, res);
  } catch (err: any) {
    new errorHandler(400, false, err.sqlMessage, {}, res);
  }
};

const queryRunner = async (sqlst: string, res: Response) => {
  try {
    const [result] = await promisePool.query(sqlst);

    return result;
  } catch (err: any) {
    new errorHandler(400, false, err.sqlMessage, {}, res);
  }
};

export { queryExecuter, queryRunner };
