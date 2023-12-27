import { CorsOptions } from "cors";

export const corsOptions: CorsOptions = {
  origin: process.env.CORS_OPTIONS,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  optionsSuccessStatus: 204,
  preflightContinue: true,
  maxAge: 86400,
};

