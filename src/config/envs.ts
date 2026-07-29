import 'dotenv/config';
import { get } from 'env-var';

export const envs = {

  PORT: get('PORT').required().asPortNumber(),
  PUBLIC_PATH: get('PUBLIC_PATH').default('public').asString(),
  POSTGRES_URL: get('POSTGRES_URL').default('public').asString(),
  JWT_SEED: get('JWT_SEED').required().asString(),
  API_NINJAS_KEY: get('API_NINJAS_KEY').required().asString(),

  SEND_EMAIL: get('SEND_EMAIL').default('false').asBool(),
  MAILJET_API_KEY: get('MAILJET_API_KEY').required().asString(),
  MAILJET_SECRET_KEY: get('MAILJET_SECRET_KEY').required().asString(),
  MAIL_FROM: get('MAIL_FROM').required().asString(),
  FRONT_URL: get('FRONT_URL').required().asString(),

}



