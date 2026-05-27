import { Role, Permission } from '../config/rbac';

export interface AuthUser {
  id:          string;
  email:       string;
  role:        Role;
  permissions: Permission[];
}

export interface JwtPayload {
  sub:   string;  // user id
  email: string;
  role:  Role;
  type:  'access' | 'refresh';
  iat?:  number;
  exp?:  number;
}

// Extend Express Request
declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}
