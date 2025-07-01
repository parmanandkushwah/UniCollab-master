import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// ✅ Hash password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

// ✅ Verify password
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// ✅ Generate JWT
export function generateToken(payload: any): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('❌ JWT_SECRET is not defined in environment variables.');
  return jwt.sign(payload, secret, { expiresIn: '7d' });
}

// ✅ Verify JWT
export function verifyToken(token: string): any {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('❌ JWT_SECRET is not defined in environment variables.');
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    console.error('❌ JWT Verification Failed:', error);
    return null;
  }
}
