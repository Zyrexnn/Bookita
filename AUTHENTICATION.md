# Autentikasi OTP Email - Bookkita

## Overview

Fitur autentikasi Bookkita menggunakan sistem passwordless dengan verifikasi OTP (One-Time Password) melalui email. Sistem ini dirancang untuk memberikan pengalaman login yang aman dan mudah bagi pengguna.

## Fitur Utama

### 🔐 Login & Registrasi Passwordless
- **Tanpa Password**: Pengguna tidak perlu mengingat password
- **OTP 6 Digit**: Kode verifikasi aman yang dikirim ke email
- **Rate Limiting**: Proteksi dari brute force attacks
- **Session Management**: Sesi otentikasi yang aman dengan JWT

### 🎨 User Experience
- **2-Step Process**: 
  1. Masukkan email (dan username untuk registrasi)
  2. Masukkan kode OTP 6 digit
- **Desain Responsif**: Berfungsi sempurna di desktop dan mobile
- **Animasi Halus**: Transisi yang menarik dengan Framer Motion
- **Error Handling**: Pesan error yang jelas dan informatif

### 🛡️ Keamanan
- **OTP Expiration**: Kode OTP kedaluwarsa dalam 5 menit
- **One-time Use**: Setiap OTP hanya bisa digunakan sekali
- **Rate Limiting**: Maksimal 3 permintaan per menit per IP/email
- **HTTP-only Cookies**: Session token disimpan secara aman
- **JWT Tokens**: Token akses dengan expiration time

## Alur Kerja

### 1. Registrasi Pengguna Baru
```
1. Pengguna memilih mode "Daftar"
2. Masukkan email dan username
3. Sistem generate OTP 6 digit
4. OTP disimpan di database dengan expiration 5 menit
5. OTP dikirim ke email pengguna
6. Pengguna memasukkan OTP
7. Sistem verifikasi OTP
8. Jika valid, buat user baru dan session
9. Redirect ke dashboard
```

### 2. Login Pengguna Existing
```
1. Pengguna memilih mode "Masuk"
2. Masukkan email yang sudah terdaftar
3. Sistem generate OTP 6 digit
4. OTP disimpan di database dengan expiration 5 menit
5. OTP dikirim ke email pengguna
6. Pengguna memasukkan OTP
7. Sistem verifikasi OTP
8. Jika valid, buat session baru
9. Redirect ke dashboard
```

## API Endpoints

### POST `/api/auth/send-otp`
Mengirim kode OTP ke email pengguna.

**Request Body:**
```json
{
  "email": "user@example.com",
  "username": "username123" // Hanya untuk registrasi
}
```

**Response:**
```json
{
  "message": "Kode OTP telah dikirim ke email Anda",
  "email": "use***@example.com"
}
```

### POST `/api/auth/verify-otp`
Memverifikasi kode OTP dan membuat session.

**Request Body:**
```json
{
  "email": "user@example.com",
  "otp_code": "123456"
}
```

**Response:**
```json
{
  "message": "Verifikasi berhasil",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "username": "username123",
    "name": "User Name"
  }
}
```

### GET `/api/auth/me`
Mendapatkan informasi user yang sedang login.

**Response:**
```json
{
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "username": "username123",
    "name": "User Name",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### POST `/api/auth/logout`
Mengakhiri session pengguna.

**Response:**
```json
{
  "message": "Logout successful"
}
```

## Database Schema

### Users
```sql
- id: String (Primary Key)
- email: String (Unique)
- username: String (Unique)
- name: String (Optional)
- createdAt: DateTime
- updatedAt: DateTime
```

### OTPs
```sql
- id: String (Primary Key)
- code: String (6-digit OTP)
- email: String
- expiresAt: DateTime
- createdAt: DateTime
- used: Boolean (Default: false)
- userId: String (Foreign Key)
```

### Sessions
```sql
- id: String (Primary Key)
- sessionToken: String (Unique)
- userId: String (Foreign Key)
- expires: DateTime
- createdAt: DateTime
```

## Environment Variables

```bash
# Database
DATABASE_URL=file:./db/custom.db

# JWT Secret untuk token signing
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-change-this-in-production
```

## Security Features

### Rate Limiting
- **IP-based**: Maksimal 3 permintaan per menit per IP address
- **Email-based**: Maksimal 3 permintaan per menit per email
- **Window**: 1 menit rolling window

### OTP Security
- **6-digit numeric code**: 1,000,000 kemungkinan kombinasi
- **5-minute expiration**: Mengurangi window of opportunity
- **One-time use**: OTP otomatis di-mark sebagai used setelah verifikasi
- **Auto-cleanup**: OTP expired otomatis dibersihkan

### Session Security
- **HTTP-only cookies**: Session token tidak dapat diakses via JavaScript
- **JWT tokens**: Token dengan signature dan expiration
- **Secure flags**: Cookies diset dengan secure flag di production
- **SameSite policy**: Mencegah CSRF attacks

## Error Handling

### Common Error Messages
- `"Email tidak valid"`: Format email tidak sesuai
- `"Username minimal 3 karakter"`: Username terlalu pendek
- `"Email sudah terdaftar"`: Email sudah digunakan untuk registrasi
- `"Username sudah digunakan"`: Username tidak tersedia
- `"Email tidak terdaftar"`: Email tidak ditemukan untuk login
- `"Kode OTP tidak valid atau sudah kedaluwarsa"`: OTP salah atau expired
- `"Terlalu banyak permintaan"`: Rate limit tercapai

### HTTP Status Codes
- `200`: Success
- `400`: Bad Request (input tidak valid)
- `401`: Unauthorized (token tidak valid)
- `404`: Not Found (user tidak ditemukan)
- `409`: Conflict (email/username sudah ada)
- `429`: Too Many Requests (rate limit)
- `500`: Internal Server Error

## Testing

### Manual Testing
1. Buka `/auth` di browser
2. Coba registrasi dengan email dan username baru
3. Check console untuk melihat OTP (development mode)
4. Masukkan OTP untuk verifikasi
5. Verify redirect ke dashboard
6. Test logout functionality
7. Coba login dengan user yang sudah terdaftar

### API Testing
```bash
# Send OTP (Register)
curl -X POST http://localhost:3000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","username":"testuser"}'

# Send OTP (Login)
curl -X POST http://localhost:3000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# Verify OTP
curl -X POST http://localhost:3000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","otp_code":"123456"}'

# Get User Info
curl -X GET http://localhost:3000/api/auth/me \
  -H "Cookie: auth-token=your-jwt-token"

# Logout
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Cookie: session-token=your-session-token"
```

## Production Considerations

### Email Service
Saat ini menggunakan simulasi email (console.log). Untuk production:
- Integrasi dengan email service (SendGrid, Resend, AWS SES)
- Setup proper email templates
- Configure SPF/DKIM records
- Use environment variables for email credentials

### Rate Limiting
Untuk production:
- Gunakan Redis untuk distributed rate limiting
- Implement lebih strict rate limiting
- Add CAPTCHA untuk suspicious activity

### Security
- Gunakan HTTPS di production
- Implement proper CORS configuration
- Add CSRF protection
- Regular security audits
- Monitor failed login attempts

### Scalability
- Connection pooling untuk database
- Caching untuk frequently accessed data
- Load balancing untuk API endpoints
- Database indexing optimization

## Troubleshooting

### Common Issues
1. **OTP tidak terkirim**: Check email service configuration
2. **OTP invalid**: Verify OTP generation and storage
3. **Session tidak tersimpan**: Check cookie configuration
4. **Rate limit tercapai**: Wait for cooldown period
5. **Database errors**: Check database connection and schema

### Debug Mode
Untuk development, OTP akan ditampilkan di console log:
```
[EMAIL SIMULATION]
To: user@example.com
Subject: Kode OTP Bookkita Anda
Body: 
  Halo Pengguna,
  
  Kode OTP Anda adalah: 123456
  
  Kode ini akan kedaluwarsa dalam 5 menit.
  ...
```

## Future Enhancements

### Planned Features
- [ ] Phone number OTP option
- [ ] Biometric authentication
- [ ] Multi-factor authentication
- [ ] Social login integration
- [ ] Email verification flow
- [ ] Password reset option
- [ ] Account recovery
- [ ] Activity logging
- [ ] Session management UI
- [ ] Advanced rate limiting

### Performance Optimizations
- [ ] Database query optimization
- [ ] Caching layer implementation
- [ ] CDN for static assets
- [ ] Image optimization
- [ ] Code splitting
- [ ] Lazy loading