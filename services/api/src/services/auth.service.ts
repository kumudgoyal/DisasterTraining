import jwt from 'jsonwebtoken';
import * as argon2 from 'argon2';
import { prisma } from '../config/database';
import { env } from '../config/env';
import { notFound, unauthorized, forbidden, badRequest, conflict } from '../utils/errors';
import { createAuditLog } from '../middleware/audit';

export class AuthService {
  static async login(email: string, passwordHashRaw: string) {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { organization: true },
    });

    if (!user) {
      throw unauthorized('Invalid email or password');
    }

    if (!user.isActive) {
      throw forbidden('User account is inactive');
    }

    const isValid = await argon2.verify(user.passwordHash, passwordHashRaw);
    if (!isValid) {
      throw unauthorized('Invalid email or password');
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    await createAuditLog({
      userId: user.id,
      action: 'LOGIN',
      module: 'AUTH',
      role: user.role,
    });

    const accessToken = jwt.sign(
      { userId: user.id, role: user.role, orgId: user.orgId },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN as any }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      env.JWT_REFRESH_SECRET,
      { expiresIn: env.JWT_REFRESH_EXPIRES_IN as any }
    );

    const { passwordHash, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      accessToken,
      refreshToken,
    };
  }

  static async register(data: any) {
    const existing = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      throw conflict('Email is already registered');
    }

    const passwordHash = await argon2.hash(data.password);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash,
        phone: data.phone,
        role: data.role,
        orgId: data.orgId,
      },
    });

    const accessToken = jwt.sign(
      { userId: user.id, role: user.role, orgId: user.orgId },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN as any }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      env.JWT_REFRESH_SECRET,
      { expiresIn: env.JWT_REFRESH_EXPIRES_IN as any }
    );

    return {
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
      accessToken,
      refreshToken,
    };
  }

  static async refreshToken(token: string) {
    try {
      const payload = jwt.verify(token, env.JWT_REFRESH_SECRET) as any;
      const user = await prisma.user.findUnique({ where: { id: payload.userId } });
      
      if (!user || !user.isActive) {
        throw unauthorized('Invalid token');
      }

      const accessToken = jwt.sign(
        { userId: user.id, role: user.role, orgId: user.orgId },
        env.JWT_SECRET,
        { expiresIn: env.JWT_EXPIRES_IN as any }
      );

      return { accessToken };
    } catch (e) {
      throw unauthorized('Invalid refresh token');
    }
  }

  static async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw notFound('User not found');

    const isValid = await argon2.verify(user.passwordHash, currentPassword);
    if (!isValid) throw unauthorized('Invalid current password');

    const newPasswordHash = await argon2.hash(newPassword);

    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newPasswordHash },
    });

    await createAuditLog({
      userId,
      action: 'UPDATE',
      module: 'AUTH',
      role: user.role,
      recordId: userId,
    });
  }

  static async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { organization: true },
    });
    if (!user) throw notFound('User not found');

    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  static async updateProfile(userId: string, data: any) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw notFound('User not found');

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        phone: data.phone,
      },
    });

    const { passwordHash, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }
}
