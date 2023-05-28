import express from "express";
const app = express();
app.use(express.json());
import cors from "cors";

app.use(cors({ origin: "*" }));
const corsOptions = {
  "Access-Control-Allow-Origin": "*",
  optionSuccessStatus: 200,
};

import userRoutes from "./routes/user-routes";
import policyRoutes from "./routes/policy-routes";

app.use("/", userRoutes);
app.use("/policy", policyRoutes);

app.listen(3020, () => {
  console.log("App listening on 3020");
});
