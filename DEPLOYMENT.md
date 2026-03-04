# SHMS Deployment Guide

## 🌐 Deploy Your App Online

This guide covers deploying SHMS to the cloud for global access.

---

## 📋 Pre-Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] All tests passing locally
- [ ] Environment variables configured
- [ ] Database migrations ready
- [ ] API documentation complete

---

## 🚀 Quick Deploy (Railway - Recommended)

### Step 1: Deploy Backend

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click **New Project** → **Deploy from GitHub repo**
4. Select your SHMS repository
5. Railway auto-detects it's a Flask app
6. Add environment variables:
   ```
   JWT_SECRET_KEY=<generate-a-strong-key>
   FLASK_ENV=production
   ```
7. Wait for deployment (2-3 minutes)
8. Copy your API URL (e.g., `https://shms-api-production.up.railway.app`)

### Step 2: Deploy Frontend

1. Go to [vercel.com](https://vercel.com)
2. Click **Import Project**
3. Select your SHMS repository from GitHub
4. **Framework:** React
5. **Root Directory:** `./frontend`
6. Add environment variable:
   ```
   REACT_APP_API_URL=https://your-railway-api.up.railway.app/api
   ```
7. Click **Deploy**
8. Your app is live at: `https://your-app.vercel.app`

### Step 3: Test Online

Visit your deployed frontend URL and test:
- Register a new account
- Login
- Check all features work

---

## 📱 Access on All Devices

### From Desktop/Laptop
Open browser → `https://your-app.vercel.app`

### From Mobile (Phone/Tablet)
1. Open browser on your phone
2. Go to: `https://your-app.vercel.app`
3. (Optional) Add to home screen for app-like experience

### From Another Computer
1. Same URL works everywhere
2. No installation needed
3. Just internet required

### From IoT Simulator
Update `iot-simulator/simulator.py`:
```python
API_BASE_URL = 'https://your-railway-api.up.railway.app/api'
```

Then run:
```bash
python iot-simulator/simulator.py
```

---

## Alternative: Manual Deployment

### Using Heroku (Backend Only)

```bash
# Install Heroku CLI from heroku.com/downloads

cd backend
heroku login
heroku create your-shms-backend
git push heroku main
heroku config:set JWT_SECRET_KEY=your-secret-key
```

### Using Netlify (Frontend Only)

```bash
cd frontend
npm run build

# Then drag 'build' folder to app.netlify.com
# Or use netlify-cli:
npm install -g netlify-cli
netlify deploy --prod
```

---

## Environment Variables for Production

### Backend (.env on Railway/Heroku)
```
JWT_SECRET_KEY=<strong-random-key>
FLASK_ENV=production
DATABASE_URL=postgresql://...  # If using PostgreSQL
```

### Frontend (.env in Vercel)
```
REACT_APP_API_URL=https://your-api-domain/api
```

---

## Database for Production

### Current Setup (SQLite - Local)
Works for development but not recommended for production.

### Upgrade to PostgreSQL

1. Create free PostgreSQL database at:
   - [Railway PostgreSQL](https://railway.app)
   - [Supabase](https://supabase.io)
   - [ElephantSQL](https://www.elephantsql.com)

2. Update backend database URL:
   ```python
   # backend/app/__init__.py
   app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL')
   ```

3. Set DATABASE_URL environment variable on Railway/Heroku

---

## Domain & SSL (Optional)

### Add Custom Domain
After deployment on Vercel/Railway, add your own domain:
- Domain registrar: GoDaddy, Namecheap, Route53
- Point DNS to Vercel/Railway
- SSL is automatic!

Example: `https://health.example.com`

---

## Monitoring & Logs

### Railway
Dashboard → Logs tab → See real-time logs

### Vercel
Dashboard → Analytics & Logs

### Heroku
```bash
heroku logs --tail
```

---

## Scaling & Performance

### Backend
- Railway scales automatically ($5 + usage)
- Monitor CPU/Memory in dashboard
- Database indexes for large datasets

### Frontend
- Vercel uses CDN (auto optimization)
- No scaling needed (fully managed)

---

## Cost Estimate

| Service | Free Tier | Paid Tier | Notes |
|---------|-----------|-----------|-------|
| Railway | None | $5-20/month | Backend |
| Vercel | ✅ Unlimited | $20-80/month | Frontend |
| PostgreSQL | 500 MB | $15-50/month | Database |
| **TOTAL** | - | **$20-150/month** | Production ready |

---

## Continuous Deployment

With GitHub connected:
- Push code to GitHub
- Railway/Vercel auto-deploys
- No manual deployment needed!

```bash
git push origin main  # Automatic deployment!
```

---

## Troubleshooting Deployment

### 502 Bad Gateway
- Backend is not running
- Check Railway logs
- Verify environment variables

### CORS Errors
- Backend URL not updated in frontend
- Check REACT_APP_API_URL variable
- Verify backend CORS config

### Database Errors
- Connection string wrong
- Database not created
- Check DATABASE_URL variable

### Can't Connect to API
- Verify both services are deployed
- Check network requests in browser console
- Verify API_URL in environment variables

---

## Security Checklist

- [ ] JWT_SECRET_KEY is strong (20+ characters)
- [ ] Database credentials not in code
- [ ] HTTPS enabled (automatic on Vercel/Railway)
- [ ] CORS restricted to your domain
- [ ] Environment variables configured
- [ ] No sensitive data in GitHub

---

## Accessing Across Devices

### Same WiFi
- Desktop: `https://your-app.vercel.app`
- Phone: `https://your-app.vercel.app`
- Tablet: `https://your-app.vercel.app`

### Different Networks
- Works everywhere (public URL)
- Just bookmark the URL
- No local network setup needed

### Mobile App Shortcut
1. Go to your Vercel URL on phone
2. Share → Add to Home Screen
3. Looks like an app!

---

## After Deployment

1. ✅ Share link with others
2. ✅ Monitor logs regularly
3. ✅ Update code → Auto-deploys
4. ✅ Scale as needed
5. ✅ Monitor costs

---

## Next Steps

1. Deploy backend to Railway
2. Deploy frontend to Vercel
3. Test all features
4. Share with team
5. Monitor performance
6. Plan scaling

---

## Update Deployment

To update your deployed app:

```bash
# Make changes locally
# Commit and push
git add .
git commit -m "Update features"
git push origin main

# Railway & Vercel auto-deploy!
# No manual steps needed
```

---

## Support & Help

- Railway Support: [railway.app/support](https://railway.app)
- Vercel Support: [vercel.com/support](https://vercel.com/support)
- Flask Deployment: [flask.palletsprojects.com/deployment](https://flask.palletsprojects.com/deployment)
- React Deployment: [create-react-app.dev/deployment](https://create-react-app.dev/deployment)

---

**Your app is now ready for the world!** 🌍
