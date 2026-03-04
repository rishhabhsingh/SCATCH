const errorMiddleware = (err, req, res, next) => {
  let statusCode = err.statusCode || 500
  let message = err.message || 'Internal Server Error'

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    message = 'Resource not found'
    statusCode = 404
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    message = `${Object.keys(err.keyValue)} already exists`
    statusCode = 400
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    message = 'Invalid token'
    statusCode = 401
  }

  if (err.name === 'TokenExpiredError') {
    message = 'Token expired'
    statusCode = 401
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
}

module.exports = errorMiddleware