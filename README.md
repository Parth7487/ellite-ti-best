# Elite Ti Build Studio

Elite Ti Build Studio is a premium web-based configurator app designed for custom titanium automotive components, exhaust systems, and bespoke body kits (specializing in Nissan 350Z and FD3S RX-7 platforms).

---

## 🌟 Key Features

### 1. Interactive Product Configurator
* **Real-time Customization**: Dynamically select finishes (Matte Carbon, Gloss Carbon, Forged Carbon, Kevlar Weave) and individual package components.
* **Smart Scaling & Pricing**: Automatic calculation of prices based on custom component selections and material multipliers.
* **Multi-View Carousel**: Interactive high-resolution galleries showing multiple angles (front, side, rear, hood) with scroll alignment.

### 2. Active Recolour System (Photoroom AI Powered)
* **Custom Vehicle Recolouring**: Upload any vehicle photo or use preset catalog variants to dynamically customize car paint colors using hex color inputs.
* **Serverless Processing**: Runs an online AI-driven recolouring pipeline utilizing the **Photoroom API** to remove backgrounds and apply paint prompts while preserving specular reflections, dark trims, carbon weaves, and brand logos.
* **Relative API Routing**: Automatically proxies requests locally and integrates as Vercel serverless Python functions in production.

### 3. Staggered HUD "About Us" Page
* **Game-Style Team Roster**: Staggered grid showing real founders and developers, featuring hover-triggered game HUD overlay telemetry panels (Clearance levels, specialty charts, and progress bars).
* **Sponsored Drivers & Rigs**: Showcases professional drivers (such as Mad Mike Whiddett, Rob Dahm, and Jon Wong) with details, stats, and customized titanium specifications.

### 4. Bespoke Resources & FAQ Directory
* **Interactive FAQs**: Fully animated, search-indexed accordions grouping real FAQ resources.
* **Articles & Guides**: Grayscale-to-color hover article cards providing technical carbon fiber details.

---

## 🛠️ Project Structure

```
├── api/                    # Vercel Serverless Functions
│   ├── index.py            # Python Flask app entrypoint
│   ├── recolour.py         # OpenCV/Photoroom image-processing core
│   └── requirements.txt    # Python backend dependencies
├── public/                 # Static assets (images, logos, fonts)
│   └── images/             # Product and driver photography assets
├── src/                    # React Frontend
│   ├── components/         # Page components (AboutUs, Blog, Resources, etc.)
│   ├── App.tsx             # Main router, configurator, and recolour coordinator
│   └── main.tsx            # Vite root mounting
├── vercel.json             # Vercel deployment rewrites config
└── vite.config.ts          # Vite bundle configuration with server proxy
```

---

## 💻 Local Development Setup

To run both the React frontend and Python recolour server locally:

### Prerequisites
* **Node.js** (v18+)
* **Python** (3.10+)

### 1. Run the Frontend (Vite)
1. Navigate to the root directory and install dependencies:
   ```bash
   npm install
   ```
2. Set up local credentials by creating `.env.local` in the root:
   ```env
   GEMINI_API_KEY="your-gemini-api-key"
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   *The frontend is now running at http://localhost:3000*

### 2. Run the Recolour Backend (Flask)
1. Set up a Python virtual environment inside the `recolour-backend` directory (used for local execution):
   ```bash
   cd recolour-backend
   virtualenv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```
2. Configure your local backend secrets in `recolour-backend/.env`:
   ```env
   PHOTOROOM_API_KEY="your-photoroom-api-key"
   FLASK_ENV="development"
   PORT=5050
   ```
3. Launch the Python backend from the root directory:
   ```bash
   npm run recolour-server
   ```
   *The backend is now running at http://localhost:5050*

Vite is pre-configured with a development proxy in `vite.config.ts` to forward all local `/api/*` fetch requests to the Flask server on port `5050` automatically.

---

## 🚀 Vercel Production Deployment

The project is fully configured for zero-setup Vercel deployments:

1. **Deploying the App**:
   * Import the repository directly in your Vercel Dashboard.
   * Vercel will automatically detect the Vite React configuration for frontend static rendering.
   * Vercel will automatically compile the `/api/index.py` serverless function using the `@vercel/python` builder.
2. **Environment Variables**:
   * In your Vercel project settings, add your keys under **Environment Variables**:
     * `PHOTOROOM_API_KEY`: Required for the AI recolour tool.
     * `GEMINI_API_KEY`: Required for AI integration features.

All API fetch calls in the React code are relative (`/api/recolour` and `/api`), ensuring they connect cleanly in production.
