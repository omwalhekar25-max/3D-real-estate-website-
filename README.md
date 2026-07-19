# AUREUM Elite Lifestyle Concierge

A premium, interactive landing page for **AUREUM Elite Lifestyle Concierge** featuring a custom 3D scroll animation rendering experience. 

## Features
- **3D Scroll Animation**: Renders 240 fluid rotation animation frames using HTML5 `<canvas>` synced directly with page scrolling.
- **LERP Smoothing**: Implements Linear Interpolation to keep frame transitions buttery smooth even during rapid scrolling.
- **Luxury Branding**: High-end styling matching the AUREUM brand identity (Champagne Gold accents, Cormorant Garamond headings, and Inter body text).
- **Interactive HUD controls**: Auto-play scrolling demo mode, frame scrubber slider, and scroll percentage readout.
- **Collective Portfolio Grid**: A tabbed interactive portfolio category filter for Residences, Yachts, Destinations, and Events, complete with transition scale/fade effects.
- **3D Card Hover Parallax**: Subtle tilting effect on glassmorphic panels responsive to cursor position.

---

## File Structure
- `index.html`: Webpage structure, sections, preloader, and controls.
- `style.css`: Clean luxury branding styling system, animations, and typography.
- `app.js`: Interactive logic, image loading, canvas drawing, scroll mapping, LERP, autoplay loops, portfolio filters, and tilt parallax.
- `vercel.json`: Pre-configured Vercel routing rules and asset caching configs.
- `server.js`: Static file HTTP node server script.
- `ezgif-frame-001.jpg` to `ezgif-frame-240.jpg`: Animation frames.

---

## Local Development

If Python is installed on your computer, you can serve the directory instantly:
```bash
python -m http.server 3000
```
Open **[http://localhost:3000/](http://localhost:3000/)** in your web browser.

---

## Pushing to GitHub

Since Git is currently not installed on your system, you can choose one of the following methods to push your files:

### Method 1: Direct Python Uploader Script (No Git Required)
We've included a custom Python script `push_to_github.py` that uploads files directly to your repository using the GitHub contents API.
1. Run the script in your terminal:
   ```bash
   python push_to_github.py
   ```
2. Enter your **GitHub Personal Access Token (PAT)** when prompted (the script prints instructions on how to generate one).
3. Confirm the upload to push all code and assets.

### Method 2: Standard Git (Once Git is installed)
Install Git from **[git-scm.com](https://git-scm.com/)** and run the following commands:
```bash
# Initialize git repository
git init

# Add all files (including code and frame JPEGs)
git add .

# Create the initial commit
git commit -m "feat: init AUREUM luxury 3D scroll page with vercel config"

# Rename default branch to main
git branch -M main

# Add the remote GitHub repository link
git remote add origin https://github.com/omwalhekar25-max/3D-real-estate-website-.git

# Push the files to the remote main branch
git push -u origin main
```

---

## Vercel Deployment

This project is configured with a `vercel.json` file containing static asset headers. To deploy:

### Option A: Import via Vercel Dashboard
1. Push the code to your GitHub repository using the steps above.
2. Log in to your **[Vercel Dashboard](https://vercel.com/)**.
3. Click **"New Project"**, select the `3D-real-estate-website-` repository, and click **"Deploy"**.

### Option B: Deploy via Vercel CLI
If you have Vercel CLI installed:
```bash
# Log in and deploy from the project folder
vercel
```
