import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import prisma from './db';

// Generate a secure JWT secret if not provided
const generateSecureSecret = () => {
  return crypto.randomBytes(64).toString('hex');
};

const JWT_SECRET = process.env.JWT_SECRET && process.env.JWT_SECRET !== 'your-super-secret-jwt-key-change-this-in-production' 
  ? process.env.JWT_SECRET 
  : generateSecureSecret();

const JWT_EXPIRES_IN = '7d';

export interface User {
  id: string;
  email: string;
  name: string;
  password?: string;
  avatar?: string;
}

export interface JWTPayload {
  userId: string;
  email: string;
  name: string;
  iat?: number;
  exp?: number;
}

// Optional password pepper for extra defense (append to password before hashing)
const PASSWORD_PEPPER = process.env.PASSWORD_PEPPER || '';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password + PASSWORD_PEPPER, 12);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password + PASSWORD_PEPPER, hashedPassword);
}

export function generateToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    return null;
  }
}

export async function authenticateUser(email: string, password: string): Promise<User | null> {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null;
  const isValid = await verifyPassword(password, user.passwordHash);
  if (!isValid) return null;
  return { id: user.id, email: user.email, name: user.name, avatar: user.avatar };
}

export async function createUser(email: string, password: string, name: string): Promise<User | null> {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return null;
  const passwordHash = await hashPassword(password);
  const created = await prisma.user.create({ data: { email, name, passwordHash } });
  return { id: created.id, email: created.email, name: created.name };
}

export async function getUserById(id: string): Promise<User | null> {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return null;
  return { id: user.id, email: user.email, name: user.name, avatar: user.avatar };
}
