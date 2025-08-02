# Environment Variables Checklist for Production

## Required Variables

### 1. Database Configuration
- [ ] `DATABASE_URL` - PostgreSQL connection string
  - Format: `postgresql://username:password@host.neon.tech/dbname?sslmode=require`
  - Must include `?sslmode=require` for production
  
### 2. Google OAuth Configuration
- [ ] `GOOGLE_CLIENT_ID` - OAuth client ID from Google Cloud Console
- [ ] `GOOGLE_CLIENT_SECRET` - OAuth client secret
- [ ] `GOOGLE_REDIRECT_URI` - Must match production URL
  - Production format: `https://yourdomain.com/api/auth/google/callback`

### 3. OpenAI Configuration
- [ ] `OPENAI_API_KEY` - API key for AI features
  - Required for PDF parsing and transaction matching

### 4. Application Configuration
- [ ] `NEXT_PUBLIC_APP_URL` - Public URL of your application
  - Production format: `https://yourdomain.com`

## Setup Instructions

1. Copy `.env.example` to `.env.local` (for local) or configure in your hosting platform
2. Replace all placeholder values with actual credentials
3. For production, update URLs from localhost to your domain
4. Ensure all OAuth redirect URIs are updated in Google Cloud Console

## Security Notes

- Never commit `.env` files to version control
- Use environment variables in your hosting platform (Vercel, etc.)
- Rotate credentials regularly
- Use different credentials for development and production