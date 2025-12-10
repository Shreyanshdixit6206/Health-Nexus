# Health NEXUS - Vercel Deployment Guide

## 📋 Prerequisites

1. **GitHub Account** - Sign up at https://github.com if you don't have one
2. **Vercel Account** - Sign up at https://vercel.com (you can use your GitHub account)
3. **Git installed** - Download from https://git-scm.com/downloads

---

## 🚀 Step-by-Step Deployment Process

### Step 1: Initialize Git Repository

Open PowerShell in your project directory (`c:\workspace`) and run:

```powershell
git init
git add .
git commit -m "Initial commit - Health NEXUS project"
```

### Step 2: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `health-nexus` (or any name you prefer)
3. Keep it **Public** or **Private** (both work with Vercel)
4. **DO NOT** initialize with README, .gitignore, or license
5. Click **Create repository**

### Step 3: Push Code to GitHub

Copy the commands from GitHub (they look like this):

```powershell
git remote add origin https://github.com/YOUR_USERNAME/health-nexus.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

### Step 4: Deploy to Vercel

#### Option A: Using Vercel Dashboard (Recommended)

1. Go to https://vercel.com and sign in
2. Click **"Add New..."** → **"Project"**
3. Click **"Import Git Repository"**
4. Find your `health-nexus` repository and click **"Import"**
5. Configure your project:
   - **Framework Preset**: Other
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: Leave empty or use `npm install`
   - **Output Directory**: Leave empty
   - **Install Command**: `npm install`
6. Click **"Deploy"**

#### Option B: Using Vercel CLI

```powershell
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? (select your account)
# - Link to existing project? No
# - Project name? health-nexus
# - In which directory is your code? ./
# - Auto-detected settings? Yes
```

### Step 5: Production Deployment

After your first deployment succeeds, deploy to production:

```powershell
vercel --prod
```

---

## ⚙️ Important Configuration Notes

### Environment Variables (Optional)

If you want to set custom secrets, go to your Vercel project:
1. Click **"Settings"** tab
2. Click **"Environment Variables"**
3. Add these variables:
   - `JWT_SECRET` → Your custom JWT secret
   - `SESSION_SECRET` → Your custom session secret
   - `NODE_ENV` → `production`

### Data Persistence Warning ⚠️

**IMPORTANT**: Vercel is a serverless platform. This means:

- **File uploads (vault documents) are ephemeral** - they will be deleted between deployments
- **JSON data files are read-only in production** - changes won't persist

#### Solutions for Production:

1. **For file uploads**: Use a cloud storage service:
   - Vercel Blob Storage
   - AWS S3
   - Cloudinary
   - Supabase Storage

2. **For data persistence**: Use a database:
   - Vercel Postgres
   - MongoDB Atlas
   - Supabase
   - PlanetScale (MySQL)

### Quick Fix: Vercel Blob Storage Setup

```powershell
# Install Vercel Blob
npm install @vercel/blob

# Then update your vault upload logic to use Vercel Blob
# See: https://vercel.com/docs/storage/vercel-blob
```

---

## 🔍 Testing Your Deployment

1. After deployment, Vercel will give you a URL like: `https://health-nexus-xyz.vercel.app`
2. Open that URL in your browser
3. Test all features:
   - Login with Aadhaar
   - Browse medicines
   - Add to cart
   - Place order
   - Verify ABHA ID
   - Upload documents (note: won't persist between deployments)

---

## 🐛 Troubleshooting

### Issue: "Cannot find module"
**Solution**: Make sure all dependencies are in the root `package.json`

### Issue: Routes not working
**Solution**: Check `vercel.json` routing configuration

### Issue: API calls failing
**Solution**: Check browser console for CORS errors. The current setup allows all origins.

### Issue: File uploads not working
**Solution**: This is expected - implement Vercel Blob Storage or another cloud storage solution

---

## 📝 Quick Commands Reference

```powershell
# Check git status
git status

# Add all changes
git add .

# Commit changes
git commit -m "your message"

# Push to GitHub
git push

# Deploy to Vercel (preview)
vercel

# Deploy to production
vercel --prod

# View deployment logs
vercel logs
```

---

## 🎯 Next Steps After Deployment

1. **Custom Domain** (Optional):
   - Go to Vercel project → Settings → Domains
   - Add your custom domain

2. **Upgrade to Database**:
   - Consider using Vercel Postgres or MongoDB Atlas
   - Migrate from JSON files to proper database

3. **Add Vercel Blob Storage**:
   - Replace file system uploads with Vercel Blob
   - Ensures uploaded documents persist

4. **Enable Analytics**:
   - Vercel provides built-in analytics
   - Go to your project → Analytics tab

---

## 📞 Support

- **Vercel Documentation**: https://vercel.com/docs
- **Vercel Discord**: https://vercel.com/discord
- **GitHub Issues**: Create issues in your repository

---

## ✅ Deployment Checklist

- [ ] Git initialized and code committed
- [ ] GitHub repository created
- [ ] Code pushed to GitHub
- [ ] Vercel account created
- [ ] Project imported to Vercel
- [ ] First deployment successful
- [ ] Production deployment completed
- [ ] Custom domain configured (optional)
- [ ] Environment variables set (optional)
- [ ] Database migration planned (for production use)
- [ ] Blob storage implemented (for file persistence)

---

**Your project is now live! 🎉**

Access it at: `https://your-project-name.vercel.app`
