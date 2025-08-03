# Deployment Checklist

## Pre-deployment Steps

### 1. Environment Variables
Ensure all environment variables are set in your deployment platform:

- [ ] `DATABASE_URL` - PostgreSQL connection string (Neon or other provider)
- [ ] `GOOGLE_CLIENT_ID` - Google OAuth client ID
- [ ] `GOOGLE_CLIENT_SECRET` - Google OAuth client secret
- [ ] `GOOGLE_REDIRECT_URI` - Must match your production URL (e.g., `https://yourdomain.com/api/auth/google/callback`)
- [ ] `OPENAI_API_KEY` - OpenAI API key for AI matching (optional but recommended)
- [ ] `NEXT_PUBLIC_APP_URL` - Your production URL
- [ ] `GOOGLE_PROJECT_ID` - Google Cloud project ID (if using Document AI)
- [ ] `GOOGLE_LOCATION` - Google Cloud location (if using Document AI)
- [ ] `GOOGLE_PROCESSOR_ID` - Document AI processor ID (if using Document AI)
- [ ] `GOOGLE_APPLICATION_CREDENTIALS` - Path to service account JSON (if using Document AI)

### 2. Google OAuth Setup
In Google Cloud Console:
- [ ] Add production redirect URI to OAuth credentials
- [ ] Ensure app is verified if using sensitive scopes

### 3. Database Setup
- [ ] Run `npx prisma migrate deploy` in production
- [ ] Verify database connection

### 4. Build & Deploy Commands
```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Build the application
npm run build

# Run database migrations
npx prisma migrate deploy

# Start the application
npm start
```

## Post-deployment Verification

### 1. Core Functionality
- [ ] Gmail connection works
- [ ] PDF upload and parsing works
- [ ] CSV upload works
- [ ] Transaction reconciliation works
- [ ] Match percentage displays correctly

### 2. Security
- [ ] All API routes require proper authentication
- [ ] No hardcoded credentials in code
- [ ] HTTPS is enabled

### 3. Performance
- [ ] Page loads quickly
- [ ] API responses are fast
- [ ] Database queries are optimized

## Rollback Plan
If issues occur:
1. Revert to previous deployment
2. Check error logs
3. Verify environment variables
4. Run database rollback if needed: `npx prisma migrate rollback`

## Monitoring
Set up monitoring for:
- [ ] Application errors
- [ ] API response times
- [ ] Database performance
- [ ] User authentication issues