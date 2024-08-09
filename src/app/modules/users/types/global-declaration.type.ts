import { REQUEST_USER_KEY } from "../../auth/auth.constants";

declare global {
    namespace Express {
      interface Request {
        [REQUEST_USER_KEY]?: User;
      }
    }
  }