# AURIC AROHI — DIRECT FARM-TO-CONSUMER COMMERCE PLATFORM
## Comprehensive Technical & Architecture Documentation

---

### Table of Contents
1. [Project Overview](#1-project-overview)
2. [Problem Statement](#2-problem-statement)
3. [Proposed Solution](#3-proposed-solution)
4. [Key Features](#4-key-features)
5. [Farmer Workflow](#5-farmer-workflow)
6. [Customer Workflow](#6-customer-workflow)
7. [AI Features](#7-ai-features)
8. [13-Language System](#8-13-language-system)
9. [Google Maps Integration](#9-google-maps-integration)
10. [Crop-Specific Image System](#10-crop-specific-image-system)
11. [Frontend Architecture](#11-frontend-architecture)
12. [Backend Architecture](#12-backend-architecture)
13. [PostgreSQL Database Architecture](#13-postgresql-database-architecture)
14. [Authentication & Authorization](#14-authentication--authorization)
15. [Order Lifecycle & State Machine](#15-order-lifecycle--state-machine)
16. [Inventory Management](#16-inventory-management)
17. [API Specification](#17-api-specification)
18. [Security Measures](#18-security-measures)
19. [Technology Stack](#19-technology-stack)
20. [Project Directory Structure](#20-project-directory-structure)
21. [Verification & Testing Results](#21-verification--testing-results)
22. [Future Improvements](#22-future-improvements)
23. [How to Run Locally](#23-how-to-run-locally)

---

### 1. Project Overview
**Auric Arohi** is a full-stack Indian direct farm-to-consumer agricultural commerce prototype. Built with a React + TypeScript frontend, an Express Node.js backend, and a PostgreSQL relational database, it connects rural Indian agricultural producers with urban households. 

The application provides fair-trade price transparency, automated stock synchronization, AI-powered multilingual crop voice assistance for farmers, culinary guidance for consumers, and an Indian e-commerce checkout experience.

---

### 2. Problem Statement
Traditional agricultural supply chains in India face multiple structural challenges:
- **Middleman Exploitation**: Up to 60–75% of consumer retail value is absorbed by commission agents, aggregators, and intermediaries (APMC mandi traders).
- **Delayed Settlements**: Farmers endure 45 to 90-day credit cycles for perishable produce.
- **Language & Tech Barriers**: Many regional farmers have limited English literacy and encounter complex SaaS interfaces.
- **Lack of Provenance**: Consumers lack transparency regarding where, when, and by whom their food was cultivated.
- **Quality Decay**: Multiple storage handoffs degrade freshness and increase post-harvest food waste.

---

### 3. Proposed Solution
Auric Arohi resolves these inefficiencies through a direct digital value chain:
- **Fair Value Protocol**: 85%+ of the retail price flows directly to the grower.
- **Farmer-First Usability**: Prominent Farmer IDs (`AV-FARM-XXXX`), 4-digit PIN logins, and a **"Speak Your Problem"** multilingual voice AI assistant.
- **Full Provenance Transparency**: Every product listing features verified grower profiles, farm locations, acreage, and interactive Google Maps hubs.
- **Zero Cold-Storage Waste**: Harvest-on-demand workflow where produce is harvested only after a customer order is placed.

---

### 4. Key Features
- **Dual Authentication**: Farmer ID + 4-Digit PIN or Universal Email + Password login with JWT tokens.
- **Systematic 9-Category Marketplace**: Vegetables, Fruits, Spices, Grains & Cereals, Pulses & Dals, Herbs & Greens, Organic Products, Other Produce, and All Produce.
- **13 Native Indian Languages**: Real-time interface translation and speech recognition for Kannada, Hindi, Telugu, Tamil, Malayalam, Bengali, Marathi, Gujarati, Punjabi, Odia, Assamese, Urdu, and English.
- **Multimodal AI Agronomist**: Web Speech voice input with symptom diagnosis and same-language text-to-speech replay.
- **Interactive Google Maps**: Farm origin cards with direction intent and pan-India agricultural hub exploration.
- **Harvest Basket & Checkout**: Sliding cart drawer with free delivery progress tracker (₹500 threshold) and Indian address checkout.

---

### 5. Farmer Workflow
1. **Farmer Sign-In**: Enter Farmer ID (e.g. `AV-FARM-1001`) and 4-digit PIN (e.g. `2026`) or email credentials.
2. **Dashboard Overview**: Review real-time KPIs (Total Produce Listings, Active Listings, Sold Out Listings, Pending Orders).
3. **Voice Crop Problem Assistant**: Tap *"🎙️ Tap & Speak Problem"* to describe crop stress symptoms in any of the 13 supported languages.
4. **List Produce**: Add new harvest manifests specifying crop name, category, quantity, unit, price per unit, harvest date, and farm origin.
5. **Manage Stock & Prices**: Edit prices or adjust quantities with one tap.
6. **Order Fulfillment**: Progress orders through the 4-step state machine (`Placed` ➔ `Harvesting` ➔ `Dispatched` ➔ `Delivered`).

---

### 6. Customer Workflow
1. **Explore Produce**: Filter crops via the 9 category tabs or natural language search (e.g., *"organic mangoes under ₹200"*).
2. **Product Details**: Open modal to view verified grower identity, harvest dates, and Google Farm Map location.
3. **AI Culinary Assistant**: Ask questions regarding storage rules, shelf life, and traditional regional recipes.
4. **Cart Management**: Add items to the slide-out cart drawer and track free delivery status.
5. **Checkout**: Select *Doorstep Delivery* (₹40 or FREE on ₹500+) or *Farm Gate Pickup*, enter Indian address details, and select payment method (UPI / COD / Card).
6. **Track & Review**: Monitor status updates from *Harvesting* to *Delivered*, rate growers, and re-order with one-tap *Buy Again*.

---

### 7. AI Features
1. **Farmer "Speak Your Problem" Voice Diagnostic AI**:
   - Integrates browser Web Speech API (`SpeechRecognition` & `SpeechSynthesis`).
   - Supports 13 Indian language speech tags (`kn-IN`, `hi-IN`, `te-IN`, `ta-IN`, `ml-IN`, `bn-IN`, `mr-IN`, `gu-IN`, `pa-IN`, `or-IN`, `as-IN`, `ur-IN`, `en-IN`).
   - Generates structured, safe, non-chemical remedies and KVK consultation guidance.
2. **Multimodal Quality Inspector**:
   - Backend endpoint (`POST /api/analyze-produce-image`) calling Google Gemini with structured JSON schemas.
   - Evaluates skin gloss, turgor pressure, and blemish indices to return freshness ratings.
3. **Customer Floating Shopping Assistant**:
   - Provides seasonal recommendations, nutritional facts, and produce comparison queries.

---

### 8. 13-Language System
The translation system (`src/translations/index.ts` & `src/context/LanguageContext.tsx`) supports:
1. **English** (`en`)
2. **Kannada** (`kn` — ಕನ್ನಡ)
3. **Hindi** (`hi` — हिन्दी)
4. **Telugu** (`te` — తెలుగు)
5. **Tamil** (`ta` — தமிழ்)
6. **Malayalam** (`ml` — മലയാളം)
7. **Bengali** (`bn` — বাংলা)
8. **Marathi** (`mr` — मराठी)
9. **Gujarati** (`gu` — ગુજરાતી)
10. **Punjabi** (`pa` — ਪੰਜਾਬੀ)
11. **Odia** (`or` — ଓଡ଼ಿଆ)
12. **Assamese** (`as` — অসমೀয়া)
13. **Urdu** (`ur` — اردو)

---

### 9. Google Maps Integration
Implemented in `src/components/GoogleFarmMap.tsx`:
- **Single Location Card**: Displays farm coordinates (City, State), verified Farmer ID, and external navigation links (`https://www.google.com/maps/search/?api=1&query=...`).
- **Pan-India Farm Hub Explorer**: Interactive hub selection across Karnataka, Maharashtra, Andhra Pradesh, Tamil Nadu, Kerala, Punjab, Gujarat, and Kashmir.
- **Privacy Compliance**: Exposes district/city/state-level geographic data rather than private residential coordinates.

---

### 10. Crop-Specific Image System
The centralized resolver `src/utils/produceImages.ts` (`getProduceImage`) handles 45+ distinct Indian crops with alias matching:
- **Spices**: Turmeric/Haldi, Saffron/Kesar, Black Pepper, Cardamom, Clove, Cinnamon, Dry Ginger.
- **Fruits**: Alphonso Mango, Kashmiri Apple, Dragonfruit, Robusta Banana, Papaya, Nagpur Orange, Guava.
- **Vegetables**: Shimla Mirch, Baby Spinach/Palak, Fresh Carrots, Organic Red Tomatoes, Potatoes, Brinjal, Bottle Gourd.
- **Grains & Pulses**: Organic Jaggery/Gud, Basmati Rice, Sharbati Wheat, Toor Dal, Moong Dal, Chana.
- **Zero generic tomato fallbacks** for non-tomato items.

---

### 11. Frontend Architecture
- **Framework**: React 19 + TypeScript.
- **Routing**: React Router DOM v7 (SPA with client-side routes: `/`, `/marketplace`, `/farmer-dashboard`, `/customer-dashboard`, `/checkout`, `/order-confirmed`, `/post-produce`, `/login`).
- **Styling**: Tailwind CSS v4 with custom dark gold theme (`gold-text-metallic`, `card-lift-glow`).
- **Context State Layers**:
  - `AuthContext`: JWT persistence, role tracking, and multi-mode authentication.
  - `ProduceContext`: Catalog management with PostgreSQL caching.
  - `CartContext`: Basket state with localStorage persistence.
  - `OrdersContext`: Order management & status synchronization.
  - `ReviewsContext`: Star ratings and verified patron reviews.
  - `LanguageContext`: 13-language active locale and string translation.

---

### 12. Backend Architecture
- **Runtime**: Node.js + Express (TypeScript compiled with `esbuild`).
- **Database Engine**: PostgreSQL 18.x via the `pg` connection pool.
- **Middleware**:
  - `authenticateToken`: Validates Bearer JWT signatures.
  - `requireRole`: Role-based access control (`farmer`, `customer`, `admin`).
  - `validateProduceInput`: Validates product fields, prices, and stock bounds.
  - `errorHandler`: Centralized error sanitizer suppressing internal traces in production.

---

### 13. PostgreSQL Database Architecture

```sql
-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(64) PRIMARY KEY,
  farmer_id VARCHAR(32) UNIQUE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  pin_hash VARCHAR(255),
  role VARCHAR(32) NOT NULL CHECK (role IN ('farmer', 'customer', 'admin')),
  phone VARCHAR(32),
  location VARCHAR(255),
  farm_name VARCHAR(255),
  main_crops VARCHAR(255),
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Farmer Profiles Table
CREATE TABLE IF NOT EXISTS farmer_profiles (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
  farmer_slug VARCHAR(128) UNIQUE NOT NULL,
  farm_name VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  experience VARCHAR(64),
  specialty VARCHAR(128),
  acreage VARCHAR(64),
  highlight_badge VARCHAR(128),
  description TEXT,
  verification_status VARCHAR(32) DEFAULT 'verified'
);

-- 3. Produce Listings Table
CREATE TABLE IF NOT EXISTS produce_listings (
  id VARCHAR(64) PRIMARY KEY,
  farmer_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
  farmer_name VARCHAR(255) NOT NULL,
  farmer_email VARCHAR(255),
  name VARCHAR(255) NOT NULL,
  category VARCHAR(128) NOT NULL,
  quantity_available NUMERIC(10, 2) NOT NULL DEFAULT 0,
  unit VARCHAR(32) NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  harvest_date DATE,
  farm_location VARCHAR(255) NOT NULL,
  description TEXT,
  images TEXT,
  quality_score NUMERIC(3, 1),
  freshness_label VARCHAR(64),
  ai_quality_data TEXT,
  status VARCHAR(32) NOT NULL DEFAULT 'Active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id VARCHAR(64) PRIMARY KEY,
  customer_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255),
  total NUMERIC(10, 2) NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'Placed',
  delivery_address TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
  id VARCHAR(64) PRIMARY KEY,
  order_id VARCHAR(64) REFERENCES orders(id) ON DELETE CASCADE,
  produce_id VARCHAR(64) REFERENCES produce_listings(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  farmer_name VARCHAR(255) NOT NULL,
  farmer_id VARCHAR(64),
  quantity NUMERIC(10, 2) NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  unit VARCHAR(32) NOT NULL
);

-- 6. Farmer Reviews Table
CREATE TABLE IF NOT EXISTS farmer_reviews (
  id VARCHAR(64) PRIMARY KEY,
  farmer_slug VARCHAR(128) NOT NULL,
  farmer_id VARCHAR(64),
  customer_name VARCHAR(255) NOT NULL,
  rating NUMERIC(2, 1) NOT NULL,
  comment TEXT NOT NULL,
  produce_name VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

---

### 14. Authentication & Authorization
- **Farmer ID + PIN Login**: Farmers can log in with Farmer ID (`AV-FARM-1001`) and 4-digit PIN (`2026`).
- **Customer & Universal Login**: Email + Password authentication with bcrypt salt rounds = 10.
- **JWT Authorization**: 7-day signed JSON Web Tokens sent via `Authorization: Bearer <token>`.
- **Role Enforcement**: Protected routes enforce role checks (`requireFarmer`, `requireRole('customer')`).

---

### 15. Order Lifecycle & State Machine
The application enforces an order progression state machine:

```mermaid
graph TD
    A["🛒 Placed"] -->|"Farmer: Start Harvest"| B["🌾 Harvesting"]
    B -->|"Farmer: Pack & Hand Over"| C["🚚 Dispatched"]
    C -->|"Logistics: Confirm Delivery"| D["✅ Delivered"]
```

- **Database Synchronization**: Order state updates use `PATCH /api/orders/:id/status` (or `PUT`), requiring authorization by the vendor farmer or admin.

---

### 16. Inventory Management
- **Zero-Trust Price & Stock Decrement**: When `POST /api/orders` executes, the backend verifies prices and stock against `produce_listings` using a PostgreSQL transaction (`SELECT ... FOR UPDATE`).
- **Automatic Status Transition**: When remaining quantity reaches `0`, the listing status transitions automatically to `'Sold Out'`.
- **Farmer Stock Adjustments**: Farmers can update quantity or price directly via `PUT /api/produce/:id`.

---

### 17. API Specification

| Method | Endpoint | Access | Purpose |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Public | Server & PostgreSQL status check |
| `POST` | `/api/auth/login-farmer-pin` | Public | Farmer login via Farmer ID & 4-digit PIN |
| `POST` | `/api/auth/login` | Public | Universal email/password authentication |
| `POST` | `/api/auth/register` | Public | Register new customer or farmer account |
| `GET` | `/api/auth/me` | Protected | Fetch authenticated user profile & permissions |
| `GET` | `/api/produce` | Public | List produce items with filtering & sorting |
| `GET` | `/api/produce/:id` | Public | Get single produce listing details |
| `POST` | `/api/produce` | Farmer | Create new produce listing |
| `PUT` | `/api/produce/:id` | Owner/Farmer | Update listing stock, price, or description |
| `DELETE` | `/api/produce/:id` | Owner/Farmer | Remove produce listing |
| `GET` | `/api/orders` | Protected | Fetch user's orders (Customer or Farmer) |
| `GET` | `/api/orders/:id` | Protected | Get single order details with ownership verification |
| `POST` | `/api/orders` | Customer | Authoritative order checkout & stock decrement |
| `PATCH` | `/api/orders/:id/status` | Vendor/Admin | Advance order lifecycle state |
| `GET` | `/api/reviews` | Public | Fetch grower reviews and aggregate scores |
| `POST` | `/api/reviews` | Customer | Submit rating and review for verified order |
| `POST` | `/api/analyze-produce-image`| Public | Gemini Multimodal produce freshness grading |
| `POST` | `/api/farmer-ai-assist` | Public | Multilingual agronomy problem diagnosis |

---

### 18. Security Measures
1. **SQL Injection Prevention**: All queries use parameterized inputs (`$1, $2, ...`).
2. **IDOR & Authorization Guards**: Order and produce routes enforce ownership validation against JWT claims.
3. **Sensitive Credential Isolation**: Passwords and PINs are hashed using `bcryptjs`; credentials and hashes are excluded from user serialization.
4. **Backend API Key Shielding**: `GEMINI_API_KEY` is loaded in Node.js runtime and never sent to client bundles.
5. **Production Error Masking**: `errorHandler.ts` masks 500 error traces in production.

---

### 19. Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend Framework** | React 19, TypeScript |
| **Styling & Theme** | Tailwind CSS v4, Custom Metallic Gold Design System |
| **Routing** | React Router DOM v7 |
| **Icons & Motion** | Lucide React, Motion (Framer Motion) |
| **Backend Framework** | Express 4.x, Node.js (TypeScript compiled via esbuild) |
| **Database Engine** | PostgreSQL 18.x via `pg` Connection Pool |
| **Authentication** | JSON Web Tokens (`jsonwebtoken`), `bcryptjs` |
| **Speech Processing** | Web Speech API (`SpeechRecognition`, `SpeechSynthesis`) |
| **AI Multimodal Model** | Google Gemini (`@google/genai`) |

---

### 20. Project Directory Structure

```
auric-farming/
├── dist/                          # Production build output
├── docs/                          # Architectural documentation
├── src/
│   ├── components/                # Modular React UI components
│   │   ├── AboutSection.tsx       # Brand story & direct farm narrative
│   │   ├── AIAssistant.tsx        # Customer AI culinary assistant
│   │   ├── CartDrawer.tsx         # Slide-out cart with free delivery tracker
│   │   ├── CustomerDashboardSection.tsx # Order tracking & Buy Again flow
│   │   ├── FarmerDashboardSection.tsx   # Farmer portal & voice AI diagnostic
│   │   ├── FarmerProfileModal.tsx # Verified grower provenance modal
│   │   ├── FinalCTAAndFooter.tsx  # Footer and newsletter section
│   │   ├── FloatingAIAssistant.tsx# Global assistive floating widget
│   │   ├── Footer.tsx             # Semantic bottom navigation
│   │   ├── GoogleFarmMap.tsx      # Google Maps preview & farm hubs
│   │   ├── Header.tsx             # Top navigation & 13-language selector
│   │   ├── Hero.tsx               # Hero banner & Direct Value Chain diagram
│   │   ├── HowItWorksSection.tsx  # Step-by-step workflow guide
│   │   ├── ImpactSection.tsx      # Fair trade economic statistics
│   │   ├── ProduceMarketplace.tsx # 9-category catalog & search
│   │   ├── ProductDetailModal.tsx # Product view & culinary tabs
│   │   ├── StarRating.tsx         # Reusable rating widget
│   │   ├── TheProblem.tsx         # Comparative value-chain breakdown
│   │   ├── WhyChooseSection.tsx   # 6 core service pillars
│   │   └── WriteReviewModal.tsx   # Review submission dialog
│   ├── context/                   # Application State Providers
│   │   ├── AuthContext.tsx        # Authentication & user profile state
│   │   ├── CartContext.tsx        # Basket state & quantity management
│   │   ├── LanguageContext.tsx    # 13-language active state
│   │   ├── OrdersContext.tsx      # Order management & status synchronization
│   │   ├── ProduceContext.tsx     # Product catalog & PostgreSQL sync
│   │   └── ReviewsContext.tsx     # Reviews & ratings state
│   ├── db/                        # PostgreSQL Database Connection & Schema
│   │   ├── index.ts               # Connection pool & health checker
│   │   ├── migrate.ts             # Schema initialization & table migrations
│   │   └── seed.ts                # Initial verified grower & produce records
│   ├── pages/                     # Full-page route views
│   │   ├── CheckoutPage.tsx       # Indian address & payment checkout
│   │   ├── CustomerDashboardPage.tsx
│   │   ├── FarmerDashboardPage.tsx
│   │   ├── HomePage.tsx           # Landing page
│   │   ├── LoginPage.tsx          # Dual farmer PIN / Email login
│   │   ├── MarketplacePage.tsx    # Catalog view
│   │   ├── OrderConfirmedPage.tsx # Post-checkout confirmation
│   │   └── PostProducePage.tsx    # Farmer harvest listing form
│   ├── server/                    # Express REST API Server
│   │   ├── middleware/            # Auth, validation, error handling
│   │   └── routes/                # Auth, Produce, Orders, Reviews, Farmers
│   ├── translations/              # 13 Indian language dictionaries
│   │   └── index.ts
│   ├── utils/                     # Helper utilities
│   │   └── produceImages.ts       # Crop image mapper (45+ Indian crops)
│   ├── index.css                  # Tailwind styles & luxury gold tokens
│   ├── main.tsx                   # React root entrypoint
│   └── App.tsx                    # Route hierarchy & Context provider wrapping
├── server.ts                      # Backend entrypoint (Express + Vite/Static)
├── package.json                   # Dependencies & scripts
└── tsconfig.json                  # TypeScript compiler options
```

---

### 21. Verification & Testing Results
All test suites and validations passed:
- **TypeScript Compilation**: `npx tsc --noEmit` ➔ **0 errors**
- **ESLint Validation**: `npm run lint` ➔ **0 errors**
- **Production Build**: `npm run build` ➔ **Successful production compilation**
- **Database & Server Health**: `GET /api/health` ➔ **HTTP 200 OK (PostgreSQL 18.6 Healthy)**
- **End-to-End Flows Verified**:
  - Dual Farmer Login (PIN & Email) ➔ Verified
  - Customer Checkout with Atomic Stock Decrement ➔ Verified
  - Order Lifecycle State Machine (`Placed` ➔ `Harvesting` ➔ `Dispatched` ➔ `Delivered`) ➔ Verified
  - 13 Languages Reactive Translation & Web Speech Synthesizer ➔ Verified
  - Pan-India Google Maps Integration ➔ Verified

---

### 22. Future Improvements
- **Real WhatsApp Business API**: Automated order dispatch notifications and pickup manifests sent to farmers via WhatsApp.
- **Direct UPI Deep-Linking**: Integration with NPCI UPI QR dynamic rails for instant settlement.
- **Offline PWA Support**: Service Worker caching enabling rural farmers to record harvest quantities in low-connectivity zones.
- **Cold-Chain IoT Tracking**: Temperature and humidity sensor tracking for high-value perishable harvests (e.g. Kashmiri Saffron, Organic Berries).

---

### 23. How to Run Locally

#### Prerequisites
- Node.js (v18.x or higher)
- PostgreSQL (v14.x or higher) running locally on port 5432

#### Configuration
Create a `.env` file in the root directory:
```env
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/auric_farming
JWT_SECRET=your_super_secret_jwt_key_2026
GEMINI_API_KEY=your_gemini_api_key_here
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_optional
```

#### Commands
```bash
# 1. Install dependencies
npm install

# 2. Run database migrations & seed initial data
npx tsx src/db/seed.ts

# 3. Start development server
npm run dev

# 4. Open in browser
# http://localhost:3000
```
