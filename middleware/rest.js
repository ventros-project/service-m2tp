const { StatusCodes } = require("http-status-codes");

const acceptableMimes = ["*/*", "application/*", "application/json"];

/**
 * We use JSON to communicate with the service itself
 *
 * @param {import('express').Request} request
 * @param {import('express').Response} response
 * @param {import('express').NextFunction} next
 */
module.exports = (request, response, next) => {
  // JSON-only policy
  const acceptable = request.header("Accept");
  if (acceptable && !acceptableMimes.includes(acceptable)) {
    response.sendStatus(StatusCodes.NOT_ACCEPTABLE);
    return;
  }

  // Only UTF-8 allowed
  const charset = request.header("Accept-Charset");
  if (charset && charset !== "utf-8") {
    response.sendStatus(StatusCodes.NOT_ACCEPTABLE);
    return;
  }

  // JSON-only policy for POST
  const contentType = request.header("Content-Type");
  if (request.method === "POST" && contentType && contentType !== "application/json") {
    response.sendStatus(StatusCodes.UNSUPPORTED_MEDIA_TYPE);
    return;
  }

  next();
};
