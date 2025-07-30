# Deployment Guide - Simple Backend

## Prerequisites
- GitHub repository with your code
- NASA API key (get from https://api.nasa.gov/)

## Backend Deployment (Render)

### 1. Create Render Account
- Go to https://render.com
- Sign up with your GitHub account

### 2. Create Web Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure the service:
   - **Name**: `nasa-data-explorer-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install && npm run build`
   - **Start Command**: `cd backend && npm start`

### 3. Set Environment Variables
Add these environment variables in Render:
- `NODE_ENV`: `production`
- `NASA_API_KEY`: Your NASA API key (get from https://api.nasa.gov/)
- `CORS_ORIGIN`: Your Vercel frontend URL (set after frontend deployment)

### 4. Deploy
Click "Create Web Service" and wait for deployment to complete.

## Frontend Deployment (Vercel)

### 1. Create Vercel Account
- Go to https://vercel.com
- Sign up with your GitHub account

### 2. Import Project
1. Click "New Project"
2. Import your GitHub repository
3. Configure the project:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 3. Set Environment Variables
Add this environment variable:
- `VITE_API_URL`: Your Render backend URL (e.g., `https://nasa-data-explorer-backend.onrender.com`)

### 4. Deploy
Click "Deploy" and wait for deployment to complete.

## Post-Deployment Configuration

### 1. Update CORS Origin
After both deployments are complete:
1. Get your Vercel frontend URL
2. Update `CORS_ORIGIN` in Render to match your Vercel URL
3. Redeploy the backend (Render will auto-redeploy)

### 2. Test the Application
1. Visit your Vercel frontend URL
2. Test all features to ensure they work with the deployed backend
3. Check browser console for any CORS errors

## Troubleshooting

### Common Issues
1. **CORS Errors**: Make sure `CORS_ORIGIN` in Render matches your Vercel URL exactly
2. **API Key Issues**: Ensure your NASA API key is set correctly in Render
3. **Build Failures**: Check the build logs in both Vercel and Render dashboards

### Environment Variables Reference

**Backend (Render)**:
```
NODE_ENV=production
NASA_API_KEY=your_nasa_api_key
CORS_ORIGIN=https://your-app.vercel.app
```

**Frontend (Vercel)**:
```
VITE_API_URL=https://your-backend-name.onrender.com
```

## Simple Backend Features

✅ **TypeScript** - Type safety and better development experience
✅ **Single file** - All endpoints in one `server.ts` file
✅ **Easy deployment** - Simple build process
✅ **All NASA APIs** - APOD, Mars Rovers, EPIC, NEO, Image Search
✅ **Error handling** - Proper error responses
✅ **CORS support** - Ready for frontend integration