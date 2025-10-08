import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { randomBytes } from 'crypto';

// Rate limiting storage (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; lastRequest: number }>();

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 3; // 3 requests per minute per IP/email

function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(identifier);

  if (!record) {
    rateLimitStore.set(identifier, { count: 1, lastRequest: now });
    return true;
  }

  if (now - record.lastRequest > RATE_LIMIT_WINDOW) {
    // Reset window
    rateLimitStore.set(identifier, { count: 1, lastRequest: now });
    return true;
  }

  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }

  record.count++;
  record.lastRequest = now;
  return true;
}

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendOTPEmail(email: string, otp: string, username?: string) {
  // In production, use a proper email service like SendGrid, Resend, etc.
  // For now, we'll simulate email sending
  
  console.log(`[EMAIL SIMULATION]`);
  console.log(`To: ${email}`);
  console.log(`Subject: Kode OTP Bookkita Anda`);
  console.log(`Body: 
    Halo ${username || 'Pengguna'},
    
    Kode OTP Anda adalah: ${otp}
    
    Kode ini akan kedaluwarsa dalam 5 menit.
    
    Jika Anda tidak meminta kode ini, abaikan email ini.
    
    Terima kasih,
    Tim Bookkita
  `);

  // For development purposes, we'll just log the OTP
  // In production, integrate with your email service
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, username } = body;

    // Validate input
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Email tidak valid' },
        { status: 400 }
      );
    }

    if (username && (typeof username !== 'string' || username.length < 3)) {
      return NextResponse.json(
        { error: 'Username minimal 3 karakter' },
        { status: 400 }
      );
    }

    // Get client IP for rate limiting
    const clientIP = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
    
    // Check rate limiting for IP
    if (!checkRateLimit(clientIP)) {
      return NextResponse.json(
        { error: 'Terlalu banyak permintaan. Silakan coba lagi dalam 1 menit.' },
        { status: 429 }
      );
    }

    // Check rate limiting for email
    if (!checkRateLimit(email)) {
      return NextResponse.json(
        { error: 'Terlalu banyak permintaan untuk email ini. Silakan coba lagi dalam 1 menit.' },
        { status: 429 }
      );
    }

    // Check if user exists (for login) or create new user (for register)
    let user;
    
    if (username) {
      // Registration mode - check if email or username already exists
      const existingUser = await db.user.findFirst({
        where: {
          OR: [
            { email },
            { username }
          ]
        }
      });

      if (existingUser) {
        return NextResponse.json(
          { error: existingUser.email === email ? 'Email sudah terdaftar' : 'Username sudah digunakan' },
          { status: 409 }
        );
      }

      // Create new user
      user = await db.user.create({
        data: {
          email,
          username,
          name: username // You can add a separate name field if needed
        }
      });
    } else {
      // Login mode - check if user exists
      user = await db.user.findUnique({
        where: { email }
      });

      if (!user) {
        return NextResponse.json(
          { error: 'Email tidak terdaftar' },
          { status: 404 }
        );
      }
    }

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

    // Delete any existing unused OTPs for this email
    await db.otp.deleteMany({
      where: {
        email,
        used: false
      }
    });

    // Save OTP to database
    await db.otp.create({
      data: {
        code: otp,
        email,
        expiresAt,
        userId: user.id
      }
    });

    // Send OTP email
    const emailSent = await sendOTPEmail(email, otp, username || user.username);

    if (!emailSent) {
      return NextResponse.json(
        { error: 'Gagal mengirim email OTP' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Kode OTP telah dikirim ke email Anda',
      email: email.substring(0, 3) + '***' + email.split('@')[1] // Partial email for security
    });

  } catch (error) {
    console.error('Send OTP error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}