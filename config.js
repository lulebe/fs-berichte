module.exports = {
  SALT_ROUNDS: 10,
  DB_DIALECT: process.env.DB_DIALECT || "mysql",
  DB_HOST: process.env.DB_HOST || "localhost",
  DB_NAME: process.env.DB_NAME || "db-berichte",
  DB_USER: process.env.DB_USER || "dbu-berichte",
  DB_PASSWORD: process.env.DB_PASSWORD || "testpw",
  PORT: process.env.PORT || 8080,
  COOKIE_SECRET: process.env.COOKIE_SECRET || "testsecret",
  MAIL_HOST: process.env.MAIL_HOST || "localhost",
  MAIL_USER: process.env.MAIL_USER || "test@example.com",
  MAIL_PASSWORD: process.env.MAIL_PASSWORD || "testpw",
  MAIL_SENDER: process.env.MAIL_SENDER || '"Test" <test@example.com>',
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || "demo@example.com",
  ROOT_URL: process.env.ROOT_URL || "http://localhost:8080",
  JWT_SECRET: process.env.JWT_SECRET || "secret",
  production: process.env.NODE_ENV === "production"
}
