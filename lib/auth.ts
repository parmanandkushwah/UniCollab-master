import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

// Compare password
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// Token banane ke liye JWT_SECRET andar se lo
export function generateToken(payload: any): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('❌ JWT_SECRET is not defined');
  return jwt.sign(payload, secret, { expiresIn: '7d' });
}

// Token verify karne ke liye bhi andar se lo
export function verifyToken(token: string): any {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('❌ JWT_SECRET is not defined');
    return jwt.verify(token, secret);
  } catch (error) {
    console.error('❌ JWT verification failed:', error);
    return null;
  }
}
