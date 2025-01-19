const getEnv = (key: string, defaultValue?: string): string => {
    const value = process.env[key] || defaultValue;
  
    if (value === undefined) {
      throw Error(`Missing String environment variable for ${key}`);
    }
  
    return value;
  };
  
  export const NODE_ENV = getEnv("NODE_ENV", "development");
  export const PORT = getEnv("PORT", "4004");
//   export const MONGO_URI = getEnv("MONGO_URI");
  export const APP_ORIGIN = getEnv("APP_ORIGIN", "http://localhost:5173");
  export const JWT_SECRET = getEnv("JWT_SECRET", "nknkdfnbkdf");
  export const JWT_REFRESH_SECRET = getEnv("JWT_REFRESH_SECRET", "bhghghyg");
  export const EMAIL_SENDER = getEnv("EMAIL_SENDER", "sumanthjmm.08@gmail.com");
  export const RESEND_API_KEY = getEnv("RESEND_API_KEY", "re_a8WLsBk5_L6XLaowc2KTxYeSNnYaz22XG");
  export const CLOUDINARY_API_KEY = getEnv("CLOUDINARY_API_KEY", "")
  export const CLOUDINARY_API_SECRET = getEnv("CLOUDINARY_API_SECRET", "")
  export const CLOUDINARY_CLOUD_NAME = getEnv("CLOUDINARY_CLOUD_NAME", "")