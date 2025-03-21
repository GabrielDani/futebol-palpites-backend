export default function errorMiddleware(err, req, res, next) {
  console.error(err);

  const statusCode = err.status || 500;
  const response = { error: err.message };

  if (process.env.NODE_ENV === "development") {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
}
