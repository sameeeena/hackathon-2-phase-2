# Step-by-Step Deployment Instructions

## Deploying Fullstack Todo App: Frontend on Vercel & Backend on Hugging Face

### Phase 1: Pre-Deployment Preparation

#### Step 1: Clean up sensitive information
1. Remove any hardcoded credentials from `.env` files
2. Verify that `.gitignore` excludes all `.env*` files
3. Check that database URLs and secrets are not in committed code

#### Step 2: Final code preparation
1. Commit all your changes to the repository:
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   ```

#### Step 3: Verify application structure
1. Ensure the repository has the correct structure:
   ```
   /frontend (Next.js application)
   /backend (FastAPI application)
   ```

### Phase 2: Deploy Backend on Hugging Face Spaces

#### Step 2.1: Create Hugging Face Account & Space
1. Go to https://huggingface.co and create an account if you don't have one
2. Navigate to "Spaces" and click "Create New Space"
3. Choose the following settings:
   - **Space Type**: Docker (recommended for FastAPI apps)
   - **SDK**: Gradio (Hugging Face will run your FastAPI app)
   - **Hardware**: CPU (sufficient for a todo app)
   - **Visibility**: Public or Private (as per your preference)

#### Step 2.2: Connect to GitHub Repository
1. Choose "Connect with GitHub" option
2. Select your GitHub repository containing the backend code
3. Make sure the backend directory contains:
   - `main.py` (your FastAPI app)
   - `app.py` (created for Hugging Face)
   - `requirements.txt`
   - `README.md`

#### Step 2.3: Configure Secrets in Hugging Face
1. Go to your Space settings
2. Navigate to "Secrets" section
3. Add the following secrets:
   - `DATABASE_URL`: Your database connection string (PostgreSQL/Neon/SQLite)
   - `BETTER_AUTH_SECRET`: Your authentication secret key

#### Step 2.4: Update CORS Settings
After deployment, you'll need to update the backend's CORS settings to include your frontend URL.

### Phase 3: Deploy Frontend on Vercel

#### Step 3.1: Create Vercel Account
1. Go to https://vercel.com and create an account
2. Install Vercel CLI (optional): `npm i -g vercel`

#### Step 3.2: Deploy Frontend
1. Go to https://vercel.com/dashboard/new
2. Click "New Project" and import your GitHub repository
3. Select the `frontend` directory in your repository
4. Configure the project settings:
   - **Framework**: Next.js (should be detected automatically)
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Install Command**: `npm install`

#### Step 3.3: Set Environment Variables in Vercel
In your Vercel project settings:
1. Go to "Settings" → "Environment Variables"
2. Add the following variable:
   - `NEXT_PUBLIC_API_URL`: Use the URL of your deployed backend from Hugging Face (e.g., `https://your-username-your-space-name.hf.space`)

#### Step 3.4: Complete Frontend Deployment
1. Click "Deploy" to start the build process
2. Wait for the build to complete successfully
3. Note the assigned URL for your frontend (e.g., `https://your-app-name.vercel.app`)

### Phase 4: Post-Deployment Configuration

#### Step 4.1: Update Backend CORS Settings
1. Get your frontend URL from Vercel deployment
2. Update the CORS origins in your backend (`backend/main.py`):
   ```python
   origins = [
       "https://your-frontend-url.vercel.app",  # Your Vercel frontend URL
       "http://localhost:3000",  # For local development
       "http://127.0.0.1:3000",
       # Add other allowed origins as needed
   ]
   ```
3. Re-deploy the backend with updated CORS settings

#### Step 4.2: Test the Integration
1. Visit your frontend URL
2. Try adding, editing, and deleting todos
3. Check browser console for any errors
4. Verify that API calls to the backend are working

### Phase 5: Troubleshooting

#### Common Backend Issues:
- **500 Internal Server Error**: Check Hugging Face Space logs for errors
- **Database Connection**: Verify DATABASE_URL secret is correctly set
- **CORS Errors**: Ensure frontend URL is in the CORS origins list

#### Common Frontend Issues:
- **API Calls Failing**: Verify NEXT_PUBLIC_API_URL is set correctly in Vercel
- **Build Failures**: Check that all dependencies are properly listed in package.json

#### Testing Endpoints:
- Backend Health: `https://your-backend-url/hf.space/health`
- Backend Docs: `https://your-backend-url.hf.space/docs`
- Frontend: `https://your-frontend-url.vercel.app`

### Phase 6: Maintenance & Updates

#### To Update the Applications:
1. Make changes to your local code
2. Test locally
3. Commit and push changes to the main branch
4. Vercel will auto-deploy frontend changes
5. Hugging Face Spaces will auto-deploy backend changes (if configured)

#### Monitoring:
- Check Vercel dashboard for frontend performance
- Monitor Hugging Face Space logs for backend issues
- Regularly backup your database

### Additional Tips:

1. **Security**: Never commit secrets to the repository
2. **Performance**: Use CDN for static assets when possible
3. **Scaling**: Consider upgrading hardware if traffic increases significantly
4. **Domains**: You can connect custom domains to both Vercel and Hugging Face deployments