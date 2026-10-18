# Canine Health & Longevity OS (v1.0)
## Professional Step-by-Step Guide & Checklist to Production

---

### Document Control & Release Specifications
- **Application:** Canine Health & Longevity OS (DogHealthOS)
- **Target Release:** v1.0.0 Production Master
- **Document Version:** 1.0.0
- **Author:** Senior Software Engineering & Release Operations
- **Classification:** Production Deployment Architecture & Operational Runbook
- **Infrastructure Target:** Google Cloud Platform (Cloud Run, Firebase Firestore, Cloud Storage, Cloud CDN)
- **Publication Date:** October 2026

---

## Executive Summary & Production Objectives

This document establishes the definitive, end-to-end technical roadmap and verification checklist for transitioning **Canine Health & Longevity OS** from development to a high-availability, enterprise-grade production environment.

### Target Service Level Objectives (SLOs)
- **Availability / Uptime:** 99.9% monthly availability (< 43 minutes downtime/month).
- **Latency (P95):** API routes responding in < 250ms; static assets served in < 80ms via edge CDN.
- **Neural TTS Generation:** Spoken clinical audio generated in < 1,500ms; audio streaming start in < 600ms.
- **Zero-Tolerance Security:** 100% authenticated isolation of user pet medical records via Firebase Security Rules; zero unencrypted API credentials.
- **Data Durability:** Daily automated Firestore backups with multi-region replication.

---

## Table of Contents

1. [Architectural Overview & Infrastructure Topology](#1-architectural-overview--infrastructure-topology)
2. [Phase 1: Environment Variables, Secrets & Configuration](#2-phase-1-environment-variables-secrets--configuration)
3. [Phase 2: Database Hardening, Firestore Security & Schema Rules](#3-phase-2-database-hardening-firestore-security--schema-rules)
4. [Phase 3: Backend Express Hardening & Audio Engine Resilience](#4-phase-3-backend-express-hardening--audio-engine-resilience)
5. [Phase 4: Frontend Optimization, Asset Bundling & Caching Strategy](#5-phase-4-frontend-optimization-asset-bundling--caching-strategy)
6. [Phase 5: Containerization, Docker & Cloud Run Deployment](#6-phase-5-containerization-docker--cloud-run-deployment)
7. [Phase 6: Custom Domain, SSL/TLS, DNS & Cloud CDN Setup](#7-phase-6-custom-domain-ssltls-dns--cloud-cdn-setup)
8. [Phase 7: Monitoring, Telemetry, Structured Logging & Alerts](#8-phase-7-monitoring-telemetry-structured-logging--alerts)
9. [Phase 8: Master Pre-Flight Go / No-Go Checklist (40 Criteria)](#9-phase-8-master-pre-flight-go--no-go-checklist-40-criteria)
10. [Phase 9: Day-1 Operational Runbook & Disaster Recovery (Rollback)](#10-phase-9-day-1-operational-runbook--disaster-recovery-rollback)

---

## 1. Architectural Overview & Infrastructure Topology

The production architecture employs a modern, full-stack unified runtime model:

```
[ Client Browser / Mobile Web ]
            │
            ▼ (HTTPS / TLS 1.3 via Global Edge CDN)
[ Google Cloud Load Balancer / Cloud CDN ]
            │
            ▼
[ Cloud Run Service: doghealthos-prod (Auto-scaling 1–20 instances) ]
  ├── Express 4.x Production Server (Port 3000 / 8080)
  │    ├── Security Middleware (Helmet, Rate Limiter, CORS)
  │    ├── Static Asset Pipeline (Pre-built Vite dist bundle)
  │    ├── REST API Endpoints (/api/gemini/tts, /api/gemini/health-tip)
  │    └── Health Probes (/healthz, /readyz)
  │
  ├── Microsoft Azure / Edge Neural TTS Engine (node-edge-tts)
  │    └── Ephemeral In-Memory Audio Buffer & Clean Stream Pipeline
  │
  ├── Google Gemini API (Server-side @google/genai SDK with Fallback)
  │    └── Grounded Seasonal Search & Medical Enrichment
  │
  └── Google Firebase Firestore (ai-studio-dogbreedlifeexpe-*)
       ├── user_profiles (Protected Auth UID boundary)
       ├── dog_profiles (Indexed by petId & userId)
       ├── vet_appointments (Chronological Milestones & Status)
       └── live_faqs (Public Read, Admin Write)
```

---

## 2. Phase 1: Environment Variables, Secrets & Configuration

### 2.1 Production Environment Inventory
All production environment variables must be injected securely via **Google Cloud Secret Manager** or Cloud Run environment variables. Never commit `.env` files with live credentials to Git.

| Variable Name | Environment | Description | Example / Required Format |
| :--- | :--- | :--- | :--- |
| `NODE_ENV` | Production | Enables Express/Node production optimizations | `production` |
| `PORT` | Production | Server listening port (Cloud Run defaults to 8080 or 3000) | `3000` |
| `GEMINI_API_KEY` | Server-only | Secret key for Google Gen AI API | `AIzaSy...` (Secret Manager) |
| `VITE_FIREBASE_API_KEY` | Client / Web | Public Firebase Web API Key | Configured in `firebase-applet-config.json` |
| `VITE_FIREBASE_PROJECT_ID` | Client / Web | Firebase Project ID | `ai-studio-dogbreedlifeexpe-6edb2685-...` |
| `ALLOWED_ORIGIN` | Server-only | Permitted CORS origins for API requests | `https://doghealthos.com, https://app.doghealthos.com` |

### 2.2 Client vs. Server Separation Audit
1. **Verify No Exposed Server Keys**: Search the compiled client code in `dist/assets/*.js` to ensure `GEMINI_API_KEY` or any administrative service credentials are not bundled into the client build.
2. **Proxy All Sensitive AI Services**: All generative intelligence and text-to-speech calls must execute exclusively through backend endpoints (`/api/*`), keeping API credentials strictly server-side.

---

## 3. Phase 2: Database Hardening, Firestore Security & Schema Rules

### 3.1 Security Rules Audit (`firestore.rules`)
The Firestore database must enforce strict User Access Isolation (RBAC) before accepting production traffic.

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper function to verify authenticated session
    function isAuthenticated() {
      return request.auth != null && request.auth.uid != null;
    }

    // Helper function to verify resource ownership
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }

    // Helper function for administrative access
    function isAdmin() {
      return isAuthenticated() && 
        (request.auth.token.admin == true || 
         request.auth.token.email == 'anthonytoudou@gmail.com');
    }

    // 1. User Profiles: Isolated strictly to the authenticating user
    match /user_profiles/{userId} {
      allow read, write: if isOwner(userId);
    }

    // 2. Dog Profiles: Owner-only read/write
    match /dog_profiles/{docId} {
      allow read, write: if isAuthenticated() && 
        (resource == null || resource.data.userId == request.auth.uid) &&
        (request.resource.data.userId == request.auth.uid);
    }

    // 3. Vet Appointments & Milestones
    match /vet_appointments/{appId} {
      allow read, write: if isAuthenticated() && 
        (resource == null || resource.data.userId == request.auth.uid) &&
        (request.resource.data.userId == request.auth.uid);
    }

    // 4. User Analytics / Action Logs
    match /user_actions/{logId} {
      allow create: if true; // Write telemetry
      allow read, update, delete: if isAdmin();
    }

    // 5. Live Published FAQs
    match /live_faqs/{faqId} {
      allow read: if true; // Public cached read
      allow write: if isAdmin(); // Admin-only updates
    }
  }
}
```

### 3.2 Indexing Strategy
Ensure the following composite indexes are active in the Firebase Console:
- `vet_appointments`: `userId` (ASC), `date` (ASC)
- `vet_appointments`: `userId` (ASC), `status` (ASC), `date` (ASC)
- `dog_profiles`: `userId` (ASC), `createdAt` (DESC)

### 3.3 Automated Backup & Disaster Recovery Schedule
1. Enable **Cloud Firestore Scheduled Backups** using Google Cloud CLI:
   ```bash
   gcloud firestore backups schedules create \
     --database='ai-studio-dogbreedlifeexpe-6edb2685-ea7c-424d-97f2-ce6b32cfa948' \
     --recurrence=daily \
     --retention=30d
   ```
2. Set 30-day retention to support point-in-time recovery for critical user medical logs.

---

## 4. Phase 3: Backend Express Hardening & Audio Engine Resilience

### 4.1 Production Security Middleware
1. **Helmet & Security Headers**:
   - `Content-Security-Policy`: Prevent cross-site scripting (XSS).
   - `X-Frame-Options: SAMEORIGIN`: Prevent unauthorized clickjacking.
   - `Strict-Transport-Security`: Enforce HTTPS for 31536000 seconds (1 year) with preload.
   - `X-Content-Type-Options: nosniff`.
2. **API Rate Limiting**:
   - Limit `/api/gemini/tts` to **20 requests per minute** per IP address to safeguard system audio resources.
   - Limit standard `/api/*` queries to **60 requests per minute** per IP address.
3. **Payload Sanitization**: Restrict JSON body size to `1mb` (`express.json({ limit: '1mb' })`) to prevent memory exhaustion attacks.

### 4.2 Neural TTS Buffer Management & Fallback Protocol
1. **Direct Stream-to-Buffer**: In `server.ts`, audio generated via `node-edge-tts` is processed into memory buffers and converted to Base64 data URLs without leaving persistent clutter in `/tmp`.
2. **Fallback Acoustic Chimes**: In the rare event of upstream provider rate-limits or temporary packet drop, the server returns an acoustic Solfeggio frequency WAV with formatted clinical transcripts so the user experience never degrades to an error page.

### 4.3 Health Check Probes
Implement active container readiness and liveness endpoints:
- `GET /healthz`: Returns `{"status": "ok", "uptime": process.uptime(), "timestamp": Date.now()}` with HTTP 200.
- Used by Cloud Run and uptime monitoring agents to verify container viability.

---

## 5. Phase 4: Frontend Optimization, Asset Bundling & Caching Strategy

### 5.1 Build Optimization & Bundle Splitting
Run the production build:
```bash
npm run build
```
Verify the build output:
- **`dist/assets/*.js`**: JavaScript bundles compressed with Gzip/Brotli.
- **Code-Splitting**: Large dependencies (`d3`, `jspdf`, `recharts`, `lucide-react`) must be dynamically chunked to ensure initial route bundle size remains **< 350 KB**.
- **CSS Optimization**: Tailwind CSS purged of unused classes via `@tailwindcss/vite` compiler.

### 5.2 HTTP Cache-Control Matrix
Configure Express static file serving with aggressive, modern caching headers:

| Asset Type | Path / Extension | Cache-Control Header | Rationale |
| :--- | :--- | :--- | :--- |
| **Hashed Bundles** | `/assets/*.js`, `/assets/*.css` | `public, max-age=31536000, immutable` | Permanent caching; hash changes on deploy |
| **User Manuals & PDFs** | `/*.pdf` | `public, max-age=86400, stale-while-revalidate=43200` | Cached for 24h with background revalidation |
| **HTML Entry Point** | `/index.html`, `/` | `no-cache, no-store, must-revalidate` | Always serve freshest release entry point |
| **API Responses** | `/api/*` | `private, no-cache, no-store` | Dynamic, sensitive pet records |

---

## 6. Phase 5: Containerization, Docker & Cloud Run Deployment

### 6.1 Production Multi-Stage Dockerfile
Use this hardened, multi-stage `Dockerfile` optimized for minimal attack surface and small image size (< 180MB):

```dockerfile
# Stage 1: Build & Dependencies
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production Minimal Runtime
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

# Security: Run as non-root user
USER node

# Copy package descriptors and production-only dependencies
COPY --chown=node:node package*.json ./
RUN npm ci --only=production

# Copy pre-compiled server and client bundles
COPY --chown=node:node --from=builder /app/dist ./dist
COPY --chown=node:node --from=builder /app/server.ts ./server.ts
COPY --chown=node:node --from=builder /app/public ./public

EXPOSE 3000

# Start server using tsx or bundled node script
CMD ["node", "dist/server.cjs"]
```

### 6.2 Cloud Run Deployment Command
Deploy using the Google Cloud SDK:
```bash
gcloud run deploy doghealthos-prod \
  --image gcr.io/ai-studio-dogbreedlifeexpe/doghealthos:v1.0.0 \
  --platform managed \
  --region us-east1 \
  --allow-unauthenticated \
  --min-instances 1 \
  --max-instances 20 \
  --memory 1Gi \
  --cpu 1 \
  --timeout 60s \
  --concurrency 80 \
  --set-env-vars="NODE_ENV=production,PORT=3000" \
  --set-secrets="GEMINI_API_KEY=projects/28567500933/secrets/GEMINI_API_KEY:latest"
```

*Note on `--min-instances 1`: Setting minimum instances to 1 eliminates cold-start latency for pet parents seeking urgent clinical guidance.*

---

## 7. Phase 6: Custom Domain, SSL/TLS, DNS & Cloud CDN Setup

### 7.1 Domain Mapping Architecture
Map your custom domain (e.g., `doghealthos.com` and `app.doghealthos.com`):
1. In the Google Cloud Console, navigate to **Cloud Run > Manage Custom Domains**.
2. Add your verified domain `doghealthos.com`.
3. Configure the following DNS records with your registrar (Cloudflare, Google Domains, or Route 53):

| Type | Name / Host | Target / Destination | TTL |
| :--- | :--- | :--- | :--- |
| **A** | `@` (root) | `216.239.32.21`, `216.239.34.21` (Google IP) | 300 / Auto |
| **AAAA** | `@` (root) | `2001:4860:4802:32::15` (Google IPv6) | 300 / Auto |
| **CNAME** | `www` | `ghs.googlehosted.com.` | 300 / Auto |
| **CNAME** | `app` | `ghs.googlehosted.com.` | 300 / Auto |

### 7.2 Managed SSL/TLS Certificates
- Google Cloud automatically provisions and renews free, managed 2048-bit RSA / ECC SSL certificates through Let's Encrypt / Google Trust Services.
- Verify issuance status: DNS propagation typically finishes within 15–30 minutes.
- Enforce HTTP-to-HTTPS automatic redirection at the load balancer level.

---

## 8. Phase 7: Monitoring, Telemetry, Structured Logging & Alerts

### 8.1 Structured JSON Logging
All backend server logs must be output in structured JSON to standard output (`stdout`) to integrate seamlessly with **Google Cloud Logging**:

```typescript
function logServerEvent(level: 'INFO' | 'WARN' | 'ERROR', message: string, meta: Record<string, any> = {}) {
  const payload = {
    severity: level,
    message,
    timestamp: new Date().toISOString(),
    service: 'doghealthos-api',
    ...meta
  };
  console.log(JSON.stringify(payload));
}
```

### 8.2 Production Alert Policy Configuration
Configure alerts in **Google Cloud Monitoring** with email and SMS notifications to `anthonytoudou@gmail.com`:

1. **High 5xx Error Rate**:
   - *Threshold:* > 1.0% of requests returning 5xx status codes over a 5-minute rolling window.
   - *Action:* Pager / Immediate Email.
   - *Policy Template:* `monitoring/alert-policies/alert-high-5xx-rate.json`
2. **Elevated Latency**:
   - *Threshold:* 95th percentile request latency exceeding 1,200ms over 10 minutes.
   - *Action:* High-priority notification.
   - *Policy Template:* `monitoring/alert-policies/alert-elevated-latency.json`
3. **Container Memory Exhaustion**:
   - *Threshold:* Memory utilization exceeding 85% of allocated 1GB (>870MB).
   - *Action:* Auto-scale trigger & memory leak diagnostic review.
   - *Policy Template:* `monitoring/alert-policies/alert-memory-exhaustion.json`
4. **Firebase Security Rule Rejections**:
   - *Threshold:* > 10 `permission-denied` occurrences within 5 minutes.
   - *Action:* Security audit alert (potential unauthorized enumeration).
   - *Policy Template:* `monitoring/alert-policies/alert-firebase-security-rejections.json`

#### Automated Cloud Monitoring Provisioning Command
Execute the automated alert deployment script:
```bash
# Provision notification channels for anthonytoudou@gmail.com and all 4 alert policies:
./scripts/setup-monitoring-alerts.sh
```

#### Step-by-Step Manual gcloud Setup Commands
```bash
# 1. Create Notification Channel for Anthony Toudou
CHANNEL_ID=$(gcloud beta monitoring channels create \
  --display-name="Anthony Toudou (Production Alerts)" \
  --type="email" \
  --channel-labels="email_address=anthonytoudou@gmail.com" \
  --format="value(name)")

# 2. Deploy Alert Policy 1: High 5xx Error Rate (>1.0% in 5m)
gcloud alpha monitoring policies create \
  --policy-from-file=monitoring/alert-policies/alert-high-5xx-rate.json

# 3. Deploy Alert Policy 2: Elevated Latency (P95 > 1,200ms in 10m)
gcloud alpha monitoring policies create \
  --policy-from-file=monitoring/alert-policies/alert-elevated-latency.json

# 4. Deploy Alert Policy 3: Container Memory Exhaustion (>85% of 1GB)
gcloud alpha monitoring policies create \
  --policy-from-file=monitoring/alert-policies/alert-memory-exhaustion.json

# 5. Deploy Alert Policy 4: Firebase Security Rejections (>10 in 5m)
gcloud alpha monitoring policies create \
  --policy-from-file=monitoring/alert-policies/alert-firebase-security-rejections.json

# 6. Verify Deployed Policies Status
gcloud alpha monitoring policies list --filter="displayName:DogHealthOS"
```

#### In-App Telemetry & Alert Testing API Endpoints
- **Live Status & Metrics:** `GET /api/monitoring/alerts` & `GET /api/monitoring/metrics`
- **Simulate Alert Trigger:** `POST /api/monitoring/simulate-alert` with `{ "alertType": "5xx" | "latency" | "memory" | "firebase_security" }`


---

## 9. Phase 8: Master Pre-Flight Go / No-Go Checklist (40 Criteria)

Prior to cutting over production traffic, every item below must be verified and checked off.

### A. Security & Secrets Hardening (1–8)
- [ ] 1. Zero hardcoded API keys or credentials present in Git codebase.
- [ ] 2. `GEMINI_API_KEY` stored exclusively in Google Cloud Secret Manager.
- [ ] 3. `firestore.rules` deployed and verified (only authenticated users can read/write their pet records).
- [ ] 4. Helmet HTTP security headers active (`X-Frame-Options`, `Content-Security-Policy`, `HSTS`).
- [ ] 5. Rate limiting active on all public API endpoints (`/api/gemini/tts`, `/api/gemini/health-tip`).
- [ ] 6. CORS policy restricted to production domain origins (`https://doghealthos.com`).
- [ ] 7. Client bundle analyzed to verify no private environmental variables leaked.
- [ ] 8. Express request payload limits enforced (`1mb` max).

### B. Functional Verification & Core Modules (9–18)
- [ ] 9. Breed selector autocompletes accurately across all 200+ AKC breeds.
- [ ] 10. Chronological age decimal calculation functions correctly for puppies (0.1–1.0y) and seniors (10y+).
- [ ] 11. Imperial (lbs) and Metric (kg) toggle accurately converts weights across all modules without rounding distortion.
- [ ] 12. D3 Growth Chart renders sigmoidal curves, P10–P90 corridors, and milestone points seamlessly.
- [ ] 13. D3 Weight-to-Longevity Impact Correlation curve correctly reflects the Purina Lifespan model.
- [ ] 14. Interactive Weight Sensitivity Slider dynamically recalculates lifespan and net variances in real time.
- [ ] 15. Body Condition Scoring (BCS 1–9) correctly renders visual silhouettes and clinical recommendations.
- [ ] 16. Historical Weight Logger successfully stores, edits, and deletes weigh-in logs.
- [ ] 17. Vet Appointments scheduler allows creating, editing, completing, and deleting appointments.
- [ ] 18. Calendar `.ics` export successfully generates valid, importable events for Apple Calendar and Google Calendar.

### C. Voice & Audio Studio Engine (19–24)
- [ ] 19. All 8 veterinary specialist personas (Fenrir, Kore, Zephyr, Puck, Charon, Emma, Brian, Michelle) audition cleanly.
- [ ] 20. Pitch resonance controls (-2 Hz, 0 Hz, +2 Hz) accurately modulate synthesized frequency.
- [ ] 21. Live glowing transcript highlights synchronize with spoken audio cadences.
- [ ] 22. Animated waveform visualizer displays active audio pulses without canvas stutter.
- [ ] 23. Audio Master MP3 export generates downloadable, playable audio files on iOS, Android, and Desktop.
- [ ] 24. Graceful acoustic chime fallback executes if network drops occur.

### D. Export, Printing & Multi-Device Responsive UI (25–30)
- [ ] 25. "Export Full Clinical PDF" compiles a vector-clean multi-page consultation document without clipping.
- [ ] 26. UI responsive layouts verified across Mobile (375px), Tablet (768px), and Desktop (1440px).
- [ ] 27. Dark mode and light mode contrast verified (WCAG AA compliance, > 4.5:1 text contrast).
- [ ] 28. Printable clinical care sheets format cleanly without navigation headers or background ink waste.
- [ ] 29. Official User Manual (`/DogHealthOS_User_Manual_v1.0.pdf`) loads and downloads cleanly.
- [ ] 30. Pet profile modal saves custom names, birth dates, and microchips reliably.

### E. Infrastructure, Performance & Reliability (31–40)
- [ ] 31. `npm run lint` (`tsc --noEmit`) passes with 0 errors.
- [ ] 32. `npm run build` succeeds cleanly with optimal code-splitting and asset hashing.
- [ ] 33. Cloud Run minimum instance set to `1` (eliminating cold starts).
- [ ] 34. Cloud Run memory set to `1Gi` and CPU to `1`.
- [ ] 35. Liveness probe `/healthz` responds with HTTP 200 OK.
- [ ] 36. Daily automated Firestore backups scheduled with 30-day retention.
- [ ] 37. SSL/TLS certificates active with A+ rating on Qualys SSL Labs.
- [ ] 38. Cloud Monitoring alerts active for 5xx errors and elevated latency.
- [ ] 39. DNS propagation verified globally across major nameservers.
- [ ] 40. **Executive Sign-off**: Final approval granted by Lead Engineer & Product Owner.

---

## 10. Phase 9: Day-1 Operational Runbook & Disaster Recovery (Rollback)

### 10.1 Post-Launch Monitoring Milestones
- **T+0 to T+1 Hour (Initial Ingress)**:
  - Monitor live Cloud Run instance count and active CPU utilization.
  - Inspect server access logs for any unhandled 4xx/5xx status spikes.
  - Perform live smoke tests on mobile and desktop from external cellular connections.
- **T+24 Hours (Day-1 Review)**:
  - Review Firestore read/write quota consumption in Firebase Console.
  - Audit error tracking for client-side JavaScript runtime exceptions.
  - Inspect average audio generation latency metrics.
- **T+7 Days (Stabilization Sign-off)**:
  - Verify first automated database backup completed successfully.
  - Review user analytics and query volumes.
  - Transition system state from "Release Monitoring" to "Steady-State Operations".

### 10.2 Emergency Rollback Protocol
In the event of an unforeseen critical defect (Sev-1: Data corruption or continuous application crashes):

1. **Instant Cloud Run Traffic Shifting** (Duration: < 15 seconds):
   ```bash
   # Route 100% of live traffic back to the previous stable revision
   gcloud run services update-traffic doghealthos-prod \
     --to-revisions=doghealthos-prod-00012-xyz=100
   ```
2. **Git Reversion & Tagging**:
   ```bash
   git revert HEAD -m 1
   git push origin main
   git tag -a v1.0.1-hotfix -m "Emergency rollback to stable build"
   ```
3. **Post-Mortem Incident Documentation**:
   - Convene post-mortem within 24 hours.
   - Document root cause, detection timeline, mitigation actions, and preventive test additions.

---
*End of Professional Step-by-Step Guide & Checklist to Production (v1.0)*
