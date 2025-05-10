// Configuration for JWT and other security keys
import dotenv from "dotenv";

dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET || "sceret keyyy";
export const JWT_EXPIRATION = process.env.JWT_EXPIRATION || "7d";

// Export other configuration keys as needed
export default {
  JWT_SECRET,
  JWT_EXPIRATION,
};
