module.exports = {
  SALT_ROUNDS: 10,
  DB_DIALECT: process.env.DB_DIALECT || "mysql",
  DB_HOST: process.env.DB_HOST || "localhost",
  DB_NAME: process.env.DB_NAME || "db-berichte",
  DB_USER: process.env.DB_USER || "dbu-berichte",
  DB_PASSWORD: process.env.DB_PASSWORD || "testpw",
  PORT: process.env.PORT || 8080,
  production: process.env.NODE_ENV === "production"
}
