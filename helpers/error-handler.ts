import { responseDisplay } from "../helpers/response";

class errorHandler extends Error {
  constructor(
    statusCode: number,
    success: boolean,
    message: string,
    data: any,
    res: any
  ) {
    super(message);
    responseDisplay(statusCode, success, message, data, res);
  }
}

export { errorHandler };
