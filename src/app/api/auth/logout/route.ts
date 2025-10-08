import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('session-token')?.value;

    if (sessionToken) {
      // Delete session from database
      await db.session.deleteMany({
        where: {
          sessionToken
        }
      });
    }

    // Clear cookies
    const response = NextResponse.json({
      message: 'Logout successful'
    });

    response.cookies.delete('session-token');
    response.cookies.delete('auth-token');

    return response;

  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    );
  }
}