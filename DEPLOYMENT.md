# Deployment Guide

This document provides instructions for deploying the WasteWise app to various platforms.

## Prerequisites

- Node.js 18+ installed
- pnpm installed (`npm install -g pnpm`)
- Google Maps API Key (for map features)

## Build the App

```bash
pnpm install
pnpm run build
```

The production build will be generated in the `dist/` directory.

## Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Set your Google Maps API Key:
```
VITE_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
```

---

## Deploy to Vercel

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. For production:
   ```bash
   vercel --prod
   ```

**vercel.json** (create in root):
```json
{
  "buildCommand": "pnpm run build",
  "outputDirectory": "dist",
  "devCommand": "pnpm run dev",
  "installCommand": "pnpm install",
  "framework": "vite"
}
```

---

## Deploy to Netlify

1. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Deploy:
   ```bash
   netlify deploy --prod --dir=dist
   ```

**netlify.toml** (create in root):
```toml
[build]
  command = "pnpm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## Deploy to GitHub Pages

1. Install gh-pages:
   ```bash
   pnpm add -D gh-pages
   ```

2. Add to `package.json` scripts:
   ```json
   "deploy": "pnpm run build && gh-pages -d dist"
   ```

3. Update `vite.config.ts` base path:
   ```ts
   base: '/your-repo-name/',
   ```

4. Deploy:
   ```bash
   pnpm run deploy
   ```

---

## Deploy to Cloudflare Pages

1. Install Wrangler:
   ```bash
   npm install -g wrangler
   ```

2. Deploy:
   ```bash
   wrangler pages deploy dist
   ```

---

## Deploy to Firebase Hosting

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Initialize:
   ```bash
   firebase init hosting
   ```

3. Select `dist` as public directory

4. Deploy:
   ```bash
   firebase deploy
   ```

**firebase.json**:
```json
{
  "hosting": {
    "public": "dist",
    "ignore": ["node_modules"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

---

## Deploy to Docker

**Dockerfile** (create in root):
```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build

FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**nginx.conf** (create in root):
```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /assets {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Build and run:
```bash
docker build -t wastewise-app .
docker run -p 80:80 wastewise-app
```

---

## Deploy to AWS S3 + CloudFront

1. Build the app:
   ```bash
   pnpm run build
   ```

2. Create S3 bucket and enable static website hosting

3. Upload dist contents:
   ```bash
   aws s3 sync dist/ s3://your-bucket-name --acl public-read
   ```

4. Configure CloudFront for HTTPS and caching

---

## Post-Deployment Checklist

- [ ] Set environment variables on hosting platform
- [ ] Verify Google Maps integration works
- [ ] Test all routes/pages load correctly
- [ ] Check browser console for errors
- [ ] Verify responsive design on mobile
- [ ] Test production build locally with `pnpm run preview`

## Local Production Preview

To test the production build locally:

```bash
pnpm run preview
```

This serves the `dist/` folder at `http://localhost:4173`
