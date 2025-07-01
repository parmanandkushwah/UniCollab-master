import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('❌ JWT_SECRET is not defined in the environment variables.');
}

// Hash user password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

// Verify login password
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// Create JWT token
export function generateToken(payload: any): string {
  return jwt.sign(payload, JWT_SECRET!, { expiresIn: '7d' });
}

// Decode and verify JWT token
export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET!);
  } catch (error) {
    console.error('❌ JWT Verification Failed:', error);
    return null;
  }
}
