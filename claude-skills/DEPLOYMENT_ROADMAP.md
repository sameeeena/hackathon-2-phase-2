# Fullstack Todo App Deployment Roadmap

## Overview
This document outlines the deployment process for a fullstack Todo application with:
- Frontend: Next.js deployed on Vercel
- Backend: FastAPI deployed on Hugging Face Spaces

## Prerequisites
- GitHub account
- Vercel account (https://vercel.com)
- Hugging Face account (https://huggingface.co)
- Git installed locally
- Node.js and npm installed

## Part 1: Preparing for Deployment

### 1.1 Clean Up Repository
- [ ] Remove any sensitive files from the repository
- [ ] Ensure `.gitignore` properly excludes `.env` files
- [ ] Clean up any unnecessary cached files
- [ ] Commit all changes to the main branch

### 1.2 Prepare Environment Variables
For Vercel deployment:
- [ ] Remove hardcoded values from frontend `.env` files
- [ ] Note which environment variables will need to be set in Vercel dashboard
- [ ] Frontend env vars to set in Vercel:
  - `NEXT_PUBLIC_API_URL`: Backend API URL (after backend deployment)

For Hugging Face Spaces:
- [ ] Remove hardcoded values from backend `.env` files
- [ ] Prepare secrets to be configured in Hugging Face Space settings

## Part 2: Deploy Backend on Hugging Face Spaces

### 2.1 Prepare Backend for Hugging Face
Create required files in backend directory:
- [ ] `app.py` (main entry point for Hugging Face)
- [ ] `requirements.txt` (already exists)
- [ ] `README.md` (for Hugging Face Space)

### 2.2 Configure Hugging Face Space
1. Go to https://huggingface.co/spaces
2. Click "Create Space"
3. Select "Docker" or "Gradio" SDK (for FastAPI)
4. Choose "GPU" or "CPU" tier (CPU is sufficient for a simple API)
5. Connect to your GitHub repository or upload code

### 2.3 Backend Configuration
Create `app.py` for Hugging Face Spaces:
```python
from backend.main import app

# This will be the entry point for Hugging Face Spaces
demo = app

if __name__ == "__main__":
    demo.launch()
```

### 2.4 Set Backend Secrets
In Hugging Face Space settings, add these secrets:
- `DATABASE_URL`: Your database connection string
- `BETTER_AUTH_SECRET`: Authentication secret

### 2.5 Launch Backend
- [ ] Push code to GitHub
- [ ] Monitor Hugging Face Space build logs
- [ ] Wait for backend to be deployed
- [ ] Note the backend URL (will be in format: https://your-username-hf-space-name.hf.space)

## Part 3: Deploy Frontend on Vercel

### 3.1 Prepare Frontend for Vercel
1. Update `next.config.ts` if needed for production:
```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
};

export default nextConfig;
```

### 3.2 Deploy to Vercel
1. Go to https://vercel.com
2. Click "New Project"
3. Import your GitHub repository
4. Configure build settings:
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: Leave empty (Next.js handles this)
   - Root Directory: `frontend`

### 3.3 Set Frontend Environment Variables in Vercel
During project setup or in project settings, add:
- `NEXT_PUBLIC_API_URL`: URL of your deployed backend (from step 2.5)
- Example: `https://your-username-hf-space-name.hf.space`

### 3.4 Finalize Frontend Deployment
- [ ] Complete the Vercel project setup
- [ ] Wait for build to complete
- [ ] Note the frontend URL (will be in format: https://your-app-name.vercel.app)

## Part 4: Post-Deployment Steps

### 4.1 Update CORS Configuration
After deployment, update the backend CORS settings in `backend/main.py`:
```python
origins = [
    "https://your-app-name.vercel.app",  // Replace with your Vercel URL
    "http://localhost:3000",  // Keep for local development
    "http://127.0.0.1:3000",
    # Add other allowed origins as needed
]
```

### 4.2 Test the Integration
- [ ] Access the frontend URL
- [ ] Verify API calls to the backend are working
- [ ] Test adding, viewing, and deleting todos
- [ ] Check browser console for any errors

### 4.3 Optional: Custom Domains
- [ ] Purchase custom domains if desired
- [ ] Configure custom domain for Vercel deployment
- [ ] Configure custom domain for Hugging Face Space (if supported)

## Troubleshooting

### Common Issues:
1. **CORS errors**: Update CORS settings in backend after deployment
2. **API calls failing**: Verify `NEXT_PUBLIC_API_URL` is set correctly
3. **Database connection**: Ensure database URL is properly configured in backend secrets
4. **Authentication issues**: Verify auth secrets are properly set

### Backend Health Checks:
- Visit `https://your-username-hf-space-name.hf.space/health` to verify backend status
- Visit `https://your-username-hf-space-name.hf.space/docs` for API documentation

### Frontend Debugging:
- Open browser developer tools
- Check Network tab for API request responses
- Check Console for JavaScript errors

## Maintenance

### Regular Tasks:
- [ ] Monitor backend database connection
- [ ] Check for security updates in dependencies
- [ ] Backup database regularly
- [ ] Monitor application performance

### Updating:
1. Make changes to code locally
2. Test locally
3. Commit and push to main branch
4. Vercel will auto-deploy frontend changes
5. Update Hugging Face Space for backend changes if auto-update is configured