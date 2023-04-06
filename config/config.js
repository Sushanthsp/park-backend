require("dotenv").config();

const config = {
    PORT: process.env.PORT,
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_AUTH_TOKEN: process.env.JWT_AUTH_TOKEN,
    SALT_ROUND: process.env.SALT_ROUND,
    GCP_PROJECT_ID:process.env.GCP_PROJECT_ID,
    GCP_BUCKET_NAME:process.env.GCP_BUCKET_NAME,
};

module.exports = config;