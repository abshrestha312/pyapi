import jwt from 'jsonwebtoken'
import bcryptjs from 'bcryptjs'
import { prisma } from './prisma'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

export interface JWTPayload {
  userId: string
  email: string
  roleId?: string
  impersonatedBy?: string
}

export class AuthError extends Error {
  constructor(message: string, public statusCode: number = 401) {
    super(message)
    this.name = 'AuthError'
  }
}

export const hashPassword = async (password: string): Promise<string> => {
  return bcryptjs.hash(password, 12)
}

export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return bcryptjs.compare(password, hashedPassword)
}

export const generateToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

export const verifyToken = (token: string): JWTPayload => {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch (error) {
    throw new AuthError('Invalid or expired token')
  }
}

export const getUserFromToken = async (token: string) => {
  const payload = verifyToken(token)
  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    include: {
      role: true,
      group: true
    }
  })

  if (!user || !user.isActive) {
    throw new AuthError('User not found or inactive')
  }

  return user
}

export const hasPermission = (userPermissions: any, requiredPermission: string): boolean => {
  if (!userPermissions || typeof userPermissions !== 'object') {
    return false
  }
  
  // Check if user has admin role (full access)
  if (userPermissions.admin === true) {
    return true
  }
  
  // Check specific permission
  return userPermissions[requiredPermission] === true
}

export const canImpersonate = (userPermissions: any): boolean => {
  return hasPermission(userPermissions, 'user_impersonation') || hasPermission(userPermissions, 'admin')
}