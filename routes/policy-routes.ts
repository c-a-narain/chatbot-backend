const policyRoutes = require("express").Router();

import { createPolicy, viewPolicy, earnings } from "../controller/policy-controller";

policyRoutes.post("/add", createPolicy);
policyRoutes.get("/view", viewPolicy);
policyRoutes.get("/earnings", earnings);

export default policyRoutes;
