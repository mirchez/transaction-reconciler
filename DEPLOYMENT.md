# Deployment Guide - Transaction Reconciler

## Prerequisites

- Node.js 18+ 
- PostgreSQL database (Neon recommended)
- Google Cloud Platform account (for Gmail OAuth)
- OpenAI API key (for AI features)
- Vercel account (recommended) or any Node.js hosting

## Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
# Database (PostgreSQL/Neon)
DATABASE_URL="postgresql://username:password@host.neon.tech/dbname?sslmode=require"

# Google OAuth (from Google Cloud Console)
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
GOOGLE_REDIRECT_URI="https://yourdomain.com/api/auth/google/callback"

# OpenAI API
OPENAI_API_KEY="your_openai_api_key"

# App URL
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
```

## Database Setup

1. Create a PostgreSQL database (Neon recommended)
2. Run migrations:
```bash
npx prisma migrate deploy
```

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Gmail API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - Development: `http://localhost:3000/api/auth/google/callback`
   - Production: `https://yourdomain.com/api/auth/google/callback`

## Deployment Steps

### Vercel (Recommended)

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Configure environment variables in Vercel dashboard

4. Add production domain to Google OAuth redirect URIs

### Manual Deployment

1. Build the application:
```bash
npm run build
```

2. Start production server:
```bash
npm start
```

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npx prisma generate
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Post-Deployment

1. Verify database connection
2. Test Google OAuth flow
3. Test file uploads (PDF/CSV)
4. Monitor logs for any errors

## Security Checklist

- [ ] All environment variables are set
- [ ] Database has SSL enabled
- [ ] Google OAuth redirect URIs are correct
- [ ] CORS settings are configured
- [ ] Rate limiting is enabled (if needed)

## Troubleshooting

### Database Connection Issues
- Ensure DATABASE_URL includes `?sslmode=require` for production
- Check firewall rules allow connections

### Google OAuth Issues
- Verify redirect URIs match exactly
- Check OAuth consent screen is configured
- Ensure Gmail API is enabled

### Build Errors
- Run `npx prisma generate` before building
- Ensure all dependencies are installed
- Check Node.js version compatibility

## Monitoring

- Use Vercel Analytics for performance monitoring
- Check application logs regularly
- Monitor database connection pool
- Track API usage (OpenAI, Gmail)