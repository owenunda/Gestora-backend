import { config } from 'dotenv';
import { access } from 'fs';

config();

const env = process.env;

export const EnvConfig = {
  jwtSecret: env.JWT_SECRET || 'defaultSecretKey',
  jwtExpiresIn: env.JWT_EXPIRES_IN || '1h',
  frontendUrls: env.FRONTEND_URLS || 'http://localhost:3000',
  port: env.PORT || 3000,
  tokenValueCloudflare: env.TOKEN_VALUE_CLOUDFLARE || 'defaultTokenValueCloudflare',
  accessKeyIdCloudflare: env.ACCESS_KEY_ID_CLOUDFLARE || 'defaultAccessKeyIdCloudflare',
  secretAccessKeyCloudflare: env.SECRET_ACCESS_KEY_CLOUDFLARE || 'defaultSecretAccessKeyCloudflare',
  bucketNameCloudflare: env.NAME_BUCKET_CLOUDFLARE || 'defaultBucketNameCloudflare',
  cdnUrlCloudflare: env.CDN_URL_CLOUDFLARE || 'defaultCdnUrlCloudflare',
  accountIdCloudflare: env.ACCOUNT_ID_CLOUDFLARE || 'defaultAccountIdCloudflare',
};
