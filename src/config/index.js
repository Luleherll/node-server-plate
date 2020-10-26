import dotenv from 'dotenv';
import Logger from './winston';

dotenv.config();

const PORT = process.env.PORT || 8000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const logEnv = NODE_ENV === 'production' ? 'info' : 'debug';
const MONGO = {
    options: {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        keepAlive: true,
        poolSize: 100
    },
    url: process.env.DB_URL
};
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_ISSUER = process.env.JWT_ISSUER;
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const EMAIL_SENDING_DETAILS = {
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    COPYRIGHT_YEAR: process.env.COPYRIGHT_YEAR
};
const FRONTED_URL = process.env.FRONTED_URL;

export { PORT, NODE_ENV, Logger, logEnv, MONGO, JWT_ISSUER, JWT_SECRET, EMAIL_SENDING_DETAILS, SENDGRID_API_KEY, FRONTED_URL };