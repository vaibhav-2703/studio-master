import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

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

// Development user database
const users: User[] = [
  {
    id: '1',
    email: 'admin@snipurl.dev',
    name: 'Administrator',
    password: '$2b$12$DDElzWs7KP2eUG/Zot8pluQwrUVTgBlP27BW2Yop5BywH7tcukOji' // admin123
  }
];

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
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
  const user = users.find(u => u.email === email);
  if (!user || !user.password) return null;

  const isValid = await verifyPassword(password, user.password);
  if (!isValid) return null;

  // Return user without password
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

export async function createUser(email: string, password: string, name: string): Promise<User | null> {
  // Check if user already exists
  if (users.find(u => u.email === email)) {
    return null;
  }

  const hashedPassword = await hashPassword(password);
  const newUser: User = {
    id: Date.now().toString(),
    email,
    name,
    password: hashedPassword
  };

  users.push(newUser);

  // Return user without password
  const { password: _, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
}

export function getUserById(id: string): User | null {
  const user = users.find(u => u.id === id);
  if (!user) return null;

  // Return user without password
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}
