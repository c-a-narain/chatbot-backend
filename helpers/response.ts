const responseDisplay = async (
  statusCode: number,
  success: boolean,
  message: string,
  data: string | any,
  res: any
) => {
  const response = {
    message,
    success,
    data,
  };
  res.status(statusCode).send(response);
};

const responsefunc = async (
  statusCode: number,
  success: boolean,
  message: string,
  res: any
) => {
  const response = {
    message,
    success,
  };
  res.status(statusCode).send(response);
};

export { responsefunc, responseDisplay };
