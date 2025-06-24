// Centralized error handler for Express routes

export default function errorHandler(err, _req, res, _next) {
  console.error(err);
  res.status(err.status || 500).json({
    msg: err.message || 'Server Error'
  });
}
