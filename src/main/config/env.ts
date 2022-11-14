export default {
  mongoUrl: process.env.MONGO_URL || 'mongodb://localhost:27017/clean-api',
  port: process.env.PORT || 8000,
  jwtSecret: process.env.JWT_SECRET || '7as>Aj1#@_=+1*/'
}
