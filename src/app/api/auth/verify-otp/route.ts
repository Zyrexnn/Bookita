import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { SignJWT } from 'jose';
import { cookies } from 'next/headers';

// Secret key for JWT signing (in production, use environment variable)
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key-here');

async function createSession(userId: string) {
  const sessionToken = crypto.randomUUID();
  const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

  // Save session to database
  await db.session.create({
    data: {
      sessionToken,
      userId,
      expires
    }
  });

  return { sessionToken, expires };
}

async function createJWTToken(userId: string, email: string) {
  const token = await new SignJWT({
    userId,
    email,
    iat: Math.floor(Date.now() / 1000)
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('30d')
    .sign(JWT_SECRET);

  return token;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, otp_code } = body;

    // Validate input
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Email tidak valid' },
        { status: 400 }
      );
    }

    if (!otp_code || otp_code.length !== 6 || !/^\d{6}$/.test(otp_code)) {
      return NextResponse.json(
        { error: 'Kode OTP tidak valid' },
        { status: 400 }
      );
    }

    // Find the OTP record
    const otpRecord = await db.otp.findFirst({
      where: {
        email,
        code: otp_code,
        used: false,
        expiresAt: {
          gt: new Date()
        }
      },
      include: {
        user: true
      }
    });

    if (!otpRecord) {
      return NextResponse.json(
        { error: 'Kode OTP tidak valid atau sudah kedaluwarsa' },
        { status: 400 }
      );
    }

    // Mark OTP as used
    await db.otp.update({
      where: { id: otpRecord.id },
      data: { used: true }
    });

    // Create session
    const session = await createSession(otpRecord.userId);
    
    // Create JWT token
    const jwtToken = await createJWTToken(otpRecord.userId, otpRecord.user.email);

    // Set HTTP-only cookie with session token
    const cookieStore = await cookies();
    cookieStore.set('session-token', session.sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: session.expires,
      path: '/'
    });

    // Set JWT token in cookie (for client-side access)
    cookieStore.set('auth-token', jwtToken, {
      httpOnly: false, // Allow client-side access
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: session.expires,
      path: '/'
    });

    // Clean up expired OTPs
    await db.otp.deleteMany({
      where: {
        expiresAt: {
          lt: new Date()
        }
      }
    });

    return NextResponse.json({
      message: 'Verifikasi berhasil',
      user: {
        id: otpRecord.user.id,
        email: otpRecord.user.email,
        username: otpRecord.user.username,
        name: otpRecord.user.name
      }
    });

  } catch (error) {
    console.error('Verify OTP error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}