// pages/api/test.ts
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({
    JWT_SECRET: process.env.JWT_SECRET || 'JWT_SECRET_NOT_FOUND',
    DATABASE_URL: process.env.DATABASE_URL || 'DATABASE_URL_NOT_FOUND',
  });
}
