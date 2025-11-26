import { config } from 'dotenv';

config();

const env = process.env;

export const EnvConfig = {
  jwtSecret: env.JWT_SECRET || 'defaultSecretKey',
  jwtExpiresIn: env.JWT_EXPIRES_IN || '1h',
  frontendUrls: env.FRONTEND_URLS || 'http://localhost:3000',
};
