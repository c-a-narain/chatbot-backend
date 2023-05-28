const jwt = require("jsonwebtoken");

async function tokenGenerator(data: number,type: number) {
  const token = jwt.sign(
    {
      id: data,
      type: type
    },
    `${process.env.secretKey}`
  );
  return token;
}

async function check(tokenData: string) {
  let decoded = jwt.verify(tokenData, `${process.env.secretKey}`);
  return decoded;
}

export { tokenGenerator, check };
