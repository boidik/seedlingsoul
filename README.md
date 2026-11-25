# Seedling Soul — Aiswarya Chakravorty

Static website for **Aiswarya Chakravorty** (Clinical Psychologist, Kolkata — Seedling Soul Institute), designed for **$0/month hosting** on **GitHub Pages** or **Cloudflare Pages** with free visual content editing via **Pages CMS**.

## Structure

- `index.html` — Home page
- `about-me/index.html` — Bio & event/media photo galleries
- `appointments/index.html` — Clinic locations, Google Maps links & phone booking
- `data/*.json` — Editable content files (`home.json`, `about.json`, `appointments.json`, `site.json`)
- `.pages.yml` — Pages CMS schema for editing text, clinics, quotes, and uploading gallery photos from a web dashboard
- `assets/images/` — All images stored locally (no external Wix dependencies)

## Free Hosting ($0/month)

### Option A: GitHub Pages
1. Open the repository **Settings → Pages**.
2. Under **Build and deployment → Source**, choose **Deploy from a branch**, select `main` and `/ (root)`, then click **Save**.
3. Wait ~1 minute for the live URL (`https://boidik.github.io/seedlingsoul/`).
4. Once tested, add your custom domain `www.aiswaryachakravorty.com` in **Settings → Pages → Custom domain** and update DNS records at your registrar.

### Option B: Cloudflare Pages (Recommended for fast global CDN + custom domain SSL)
1. Log into [Cloudflare Dashboard](https://dash.cloudflare.com/) → **Workers & Pages → Create → Pages → Connect to Git**.
2. Select `boidik/seedlingsoul`, set build command to *(empty)* and build output directory to `.` (or `/`), and deploy.
3. Add `www.aiswaryachakravorty.com` and `aiswaryachakravorty.com` under **Custom domains**.

## Free Visual Content Editing (Pages CMS)
1. Go to [app.pagescms.org](https://app.pagescms.org/) and sign in with your GitHub account.
2. Select `boidik/seedlingsoul`.
3. Edit **Home Page**, **About Me Page**, **Appointments Page**, or **Footer & Contact Settings** and upload new images directly—every save commits to GitHub and automatically updates your live site.
