# 🚀 Dog Breed Life Expectancy Platform: Production Deployment Checklist
## Complete Step-by-Step Production Launch & Verification Manual
*For DogHealthOS™ Life Expectancy, Breeder Pro Suite & Commercial Affiliate Platform*

---

## 1. Architectural Strategy & Deployment Targets
The DogHealthOS platform utilizes a high-efficiency serverless dual-tier architecture:
1. **Frontend Client:** High-performance React 19 + TypeScript single-page application built via Vite, styled with Tailwind CSS, utilizing client-side routing, D3 biometric charts, and AES-256 Medical Vault encryption.
2. **Backend Server:** Node.js + Express server bundled via esbuild (`server.ts` -> `dist/server.cjs`), proxying generative Gemini AI endpoints, enforcing IP rate limits, and serving static fallback assets.
3. **Database & Auth:** Google Firebase Authentication and Cloud Firestore for persistent activity logs, user reviews, published FAQ intelligence, and kennel telemetry.
4. **Zero-Downtime Hosting:** Deployable on Google Cloud Run (containerized full-stack) or Firebase Hosting (CDN edge) with scale-to-zero operational cost ($0.00 baseline).

---

## 2. Step-by-Step Production Deployment Checklist

### 📋 Phase 1: Pre-Flight Code Audit & Build Verification
- [ ] **TypeScript Strict Compilation:**
  Execute strict typecheck without emit to confirm zero compiler errors:
  ```bash
  npm run lint
  # Target Output: tsc --noEmit completes with 0 errors
  ```
- [ ] **Dual-Build Bundle Execution:**
  Verify both Vite frontend and esbuild server bundle compile without warnings:
  ```bash
  npm run build
  # Target Output: 
  # 1. vite v6.x building for production... dist/assets/
  # 2. esbuild server.ts --bundle --platform=node -> dist/server.cjs
  ```
- [ ] **Local Asset Verification:**
  Confirm all 62 core breed images are present in `public/dog-images/` and verified in the Admin Dashboard Asset Audit tab.
- [ ] **Environment Variable Isolation:**
  Verify `.env.example` contains non-secret placeholders:
  ```env
  VITE_FIREBASE_API_KEY=your_firebase_api_key
  VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
  VITE_FIREBASE_PROJECT_ID=your_project_id
  VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
  VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
  VITE_FIREBASE_APP_ID=your_app_id
  GEMINI_API_KEY=your_gemini_api_key
  ```

---

### 📋 Phase 2: Database & Security Hardening
- [ ] **Firestore Security Rules Audit:**
  Deploy and verify `firestore.rules` enforcing role-based read/write access:
  ```bash
  # Verify rules allow authenticated users to log actions and submit feedback
  # Ensure admin-only operations on FAQ publishing and log purging
  ```
- [ ] **Client AES-256 Crypto Key Isolation:**
  Confirm Medical Vault encryption keys remain strictly in client memory/localStorage and are never transmitted to backend servers.
- [ ] **Gemini API Secret Protection:**
  Confirm `GEMINI_API_KEY` is referenced solely on the server (`server.ts`) and is never prefixed with `VITE_` or leaked into the client bundle.
- [ ] **API Rate Limiting Activation:**
  Verify express rate limit middleware is mounted on all generative AI routes (`/api/gemini/*`) to mitigate DoS attacks and quota burn.

---

### 📋 Phase 3: Commercial Affiliate & Breeder Suite Auditing
- [ ] **Affiliate Partner Directory Audit:**
  Verify partner seeds (Trupanion, Fetch, Embark, Royal Canin, Hill's, The Farmer's Dog) in `AffiliateManagement.tsx`.
- [ ] **Affiliate Search Bar & Filtering Verification:**
  Test real-time company name filtering in Admin Dashboard -> Affiliates tab.
- [ ] **Affiliate Dossier Modal Testing:**
  Click partner cards and verify contact logs, contract SLAs, and dedicated notes persistence.
- [ ] **Breeder Pro Suite Vector PDF Verification:**
  Generate a sample Puppy Health Passport and confirm vector PDF rendering and microchip barcodes.

---

### 📋 Phase 4: Cloud Run / Firebase Deployment Execution

#### Option A: Google Cloud Run (Recommended for Full-Stack)
1. [ ] **Initialize Cloud Run Service:**
   Connect GitHub repository to Google Cloud Build.
2. [ ] **Configure Container Buildpack:**
   Use Google Cloud Native Buildpack with automatic Node.js runtime detection (`npm run build` and `npm start`).
3. [ ] **Set Container Environment Variables:**
   Inject `GEMINI_API_KEY` and Firebase credentials securely in Cloud Secret Manager.
4. [ ] **Configure Scale-to-Zero Constraints:**
   Set Min Instances = `0`, Max Instances = `10` to eliminate idle hosting charges.

#### Option B: Firebase Hosting + Cloud Functions
1. [ ] Install Firebase CLI: `npm install -g firebase-tools`
2. [ ] Authenticate: `firebase login`
3. [ ] Deploy static assets: `firebase deploy --only hosting`

---

### 📋 Phase 5: Custom Domain & SSL Verification
- [ ] **DNS Record Configuration:**
  Add apex `@` and subdomain `www` `A` / `CNAME` records pointing to Google Cloud load balancer.
- [ ] **Automated TLS 1.3 Provisioning:**
  Confirm Google Cloud / Let's Encrypt managed SSL certificate status is active.
- [ ] **Security Headers Audit:**
  Verify `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, and strict CORS policies.

---

### 📋 Phase 6: Post-Deployment Monitoring & Rollback Protocols
- [ ] **Production Health Check:**
  Verify live health endpoint:
  ```bash
  curl -I https://your-production-domain.com/api/health
  # Expected: HTTP/2 200 OK
  ```
- [ ] **429 Quota Exhaustion Fallback Test:**
  Confirm that simulated rate-limit responses serve verified clinical fallbacks rather than crashing client sessions.
- [ ] **Emergency Rollback SOP:**
  If fatal regression occurs, trigger instant rollback to previous immutable Cloud Run revision via Cloud Console (`gcloud run services update-traffic --to-revisions=PREV_REV=100`).

---

### 📋 Phase 7: Structured Logging & Production Alert Policy Configuration
- [x] **8.1 Structured JSON Logging:**
  Backend logs formatted as structured JSON payloads (`severity`, `message`, `service: doghealthos-api`, `timestamp`, `httpRequest`) for native Google Cloud Logging ingestion.
- [x] **8.2 Google Cloud Monitoring Alert Policies:**
  Configure automated alerting with Email & SMS channels routed to **anthonytoudou@gmail.com**:
  - [x] **High 5xx Error Rate:** Threshold > 1.0% over 5m rolling window (Action: Pager / Immediate Email).
  - [x] **Elevated Latency:** 95th percentile request latency > 1,200ms over 10m (Action: High-priority notification).
  - [x] **Container Memory Exhaustion:** Memory utilization > 85% of allocated 1GB (Action: Auto-scale trigger & memory diagnostic review).
  - [x] **Firebase Security Rule Rejections:** > 10 `permission-denied` occurrences in 5m (Action: Security audit alert).
  - [x] **Automated Provisioning Script:** Run `./scripts/setup-monitoring-alerts.sh` to register channels and policies.
  - [x] **Live In-App Telemetry & Simulation:** Test via Admin Dashboard or `POST /api/monitoring/simulate-alert`.

---
*Certified ready for production deployment upon completion of all 7 phases.*

