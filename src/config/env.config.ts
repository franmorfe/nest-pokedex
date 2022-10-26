
export const EnvConfiguration = () => ({
  environment: process.env.NODE_ENV || 'dev',
  port: process.env.PORT,
  mongodb: process.env.MONGODB,
  defaultLimit: +process.env.DEFAULT_LIMIT,
});