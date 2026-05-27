import { UserRepository }   from '../user/user.repository';
import { getRolePermissions } from '../../config/rbac';
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from '../../config/jwt';
import { LoginDTO, RefreshTokenDTO } from './auth.schema';

export interface TokenPair {
  accessToken:  string;
  refreshToken: string;
}

export interface LoginResult extends TokenPair {
  user: {
    id:          string;
    email:       string;
    fullName:    string;
    role:        string;
    permissions: string[];
  };
}

export class AuthService {
  constructor(private readonly userRepo: UserRepository) {}

  async login(dto: LoginDTO): Promise<LoginResult> {
    const doc = await this.userRepo.findByEmail(dto.email);
    if (!doc) throw new Error('Invalid credentials');
    if (!doc.isActive) throw new Error('Account is deactivated');

    const valid = await doc.comparePassword(dto.password);
    if (!valid) throw new Error('Invalid credentials');

    await this.userRepo.updateLastLogin(doc._id.toString());

    const accessToken  = signAccessToken(doc._id.toString(), doc.email, doc.role);
    const refreshToken = signRefreshToken(doc._id.toString(), doc.email, doc.role);

    return {
      accessToken,
      refreshToken,
      user: {
        id:          doc._id.toString(),
        email:       doc.email,
        fullName:    `${doc.firstName} ${doc.lastName}`,
        role:        doc.role,
        permissions: getRolePermissions(doc.role),
      },
    };
  }

  async refresh(dto: RefreshTokenDTO): Promise<TokenPair> {
    const payload = verifyRefreshToken(dto.refreshToken);

    if (payload.type !== 'refresh') throw new Error('Invalid token type');

    const doc = await this.userRepo.findById(payload.sub);
    if (!doc || !doc.isActive) throw new Error('User not found or deactivated');

    return {
      accessToken:  signAccessToken(doc._id.toString(), doc.email, doc.role),
      refreshToken: signRefreshToken(doc._id.toString(), doc.email, doc.role),
    };
  }
}
