import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { db } from '@/lib/db';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key-here');

export async function GET(request: NextRequest) {
  try {
    const authToken = request.cookies.get('auth-token')?.value;
    
    if (!authToken) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { payload } = await jwtVerify(authToken, JWT_SECRET);
    
    // Get user from database
    const user = await db.user.findUnique({
      where: { id: payload.userId as string },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        createdAt: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user
    });

  } catch (error) {
    console.error('Get user info error:', error);
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
}