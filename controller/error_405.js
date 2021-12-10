/**
 * Handle 405 Method Not Allowed
 *
 * @param {string} allowedMethods
 */
module.exports = (allowedMethods) => {
  /**
   * @param {import('express').Request} request
   * @param {import('express').Response} response
   */
  return (request, response) => {
    response.setHeader("Allow", allowedMethods);
    response.status(405).json({
      error: `"${request.path}" path has no "${request.method}" method`,
    });
  };
};
