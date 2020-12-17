const sendErrorResponse = (error, res) => {
  return res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
  });
};

module.exports = sendErrorResponse;
