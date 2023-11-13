import dotenv from 'dotenv';

dotenv.config();

export default {
  port: process.env.PORT,
  mongoUrl: process.env.MONGO_URL,
  adminName: process.env.ADMIN_NAME,
  adminPassword: process.env.ADMIN_PASSWORD,
  cookieSecret: process.env.COOKIE_SECRET,
  sessionSecret: process.env.SESSION_SECRET,
  passportSecret: process.env.PASSPORT_SECRET,
  githubId: process.env.GITHUB_ID,
  githubSecret: process.env.GITHUB_SECRET,
  githubCallback: process.env.GITHUB_CALLBACK,
  email: process.env.EMAIL,
  emailPassword: process.env.EMAIL_PASSWORD,
  persistence: process.env.PERSISTENCE,
  logger: process.env.LOGGER
};
