require('dotenv').config();

module.exports = {
  port: process.env.PORT,
  googleApiKey: process.env.GOOGLE_API_KEY,
  mongoURI: process.env.MONGO_URI
};
