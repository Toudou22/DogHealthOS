# 🧪 Dog Breed Life Expectancy Platform (DogHealthOS™)
## Comprehensive Production Quality Assurance & Practical Testing Plan
*Enterprise Pre-Launch Verification Manual, End-to-End Test Execution Suites, Test Questions, and Expected Results.*

---

## 1. Executive QA Philosophy & Defect Prevention Standard

To guarantee a **100% bug-free, zero-defect release** for companion dog owners, preservation breeders, animal shelters, and veterinary clinics, this testing plan establishes an exhaustive verification protocol across every functional, mathematical, security, and integration layer of **DogHealthOS™**.

### Core QA Verification Objectives:
1. **Mathematical & Biological Rigor:** Validated size-adjusted longevity equations, AAHA senior boundaries, and RER/MER caloric math across all 5 skeletal size classes.
2. **Clinical Evidence Integrity:** Assurance that 100% of diagnostic advice and nutritional formulations cite accredited veterinary authorities (AVMA, AAHA, AAFCO, NRC, RVC VetCompass™).
3. **Resilience & Rate-Limit Graceful Fallbacks:** Verification that Gemini API rate limit events (HTTP 429 quota exhaustion) transition smoothly to curated veterinary fallbacks without breaking the UI.
4. **Commercial Partner & Affiliate Operations:** End-to-end testing of company name search filtering, partner dossier modals, contact history logs, contract terms editing, and notes persistence.
5. **Breeder Pro Telemetry & Vector Health Passports:** Verification of litter weight velocity equations, microchip assignments, Punnett genetic simulations, and vector PDF passport generation.
6. **Data Privacy & Client Encryption:** Verification of AES-256 client-side encryption for Medical Vault records and strict Firestore user-scoped security rules.

---

## 2. Practical Test Suites with Explicit Questions & Expected Results

---

### 🧪 Suite 1: Core Lifespan Engine, Breed Search & Biometric Milestones

| Test ID | Test Title | Test Question / Scenario | Test Input Data | Expected Result | Pass Criteria |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-ENG-01** | Breed Autocomplete Search | *Does the search input instantaneously filter matching breeds upon typing?* | Type `"Gold"` into search input | Dropdown displays Golden Retriever, Goldendoodle, Golden Dox immediately with zero input latency. | Response time $<50\text{ms}$; no duplicate entries. |
| **TC-ENG-02** | Size Class Pill Filter | *Does selecting a size class filter restrict results exclusively to that group?* | Click `Giant` size pill | Displays only breeds weighing $>90\text{ lbs}$ (Great Dane, Mastiff, Irish Wolfhound, Bernese Mountain Dog, Saint Bernard). | 100% size group compliance. |
| **TC-ENG-03** | Age Stepper Boundary Check | *Does the age stepper prevent invalid negative or out-of-range numeric inputs?* | Tap `-` when age is `0.0` or enter `-5` | Stepper clamps at minimum `0.0` or `0.5` years; negative numbers are rejected without NaN errors. | Zero NaN or negative values rendered in UI. |
| **TC-ENG-04** | Brachycephalic BOAS Warning | *Does selecting a flat-faced breed surface clinical airway obstruction alerts?* | Select **French Bulldog** or **Pug** | Screen displays prominent amber/red BOAS Warning badge detailing stenotic nares and thermal stress risks. | BOAS clinical badge visible with RVC citation. |
| **TC-ENG-05** | Timeline Pin Placement | *Does the timeline slider pin drop into the exact developmental stage?* | Select **Golden Retriever** at **7.0 Years** | Timeline pin lands accurately in the **Senior** developmental zone with color-coded stage indicator. | Pin position matches mathematical lifespan ratio. |
| **TC-ENG-06** | Custom Breed Regression | *Does entering a mixed or non-standard breed apply size-category models?* | Custom weight: `45 lbs`, Age: `5.0 Years` | Applies Medium-breed regression multiplier ($5\text{ human yrs/dog yr}$ after Year 2) yielding 39 human years. | Accurate fallback metric displayed. |

---

### 🔬 Suite 2: Certified Clinical Life Stage & Human Age Benchmark Matrix
*15 Explicit Validation Cases verified against AAHA Canine Life Stage Guidelines & AVMA size-adjusted metabolic aging curves:*

| Benchmark ID | Breed Name | Veterinary Size Class | Chronological Age | Verification Question | Expected Human Age Equivalence | Expected Clinical Stage | Physiological Validation Finding |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-BM-01** | **Chihuahua** | **Toy** (<12 lbs) | **10.0 Years** | *What is the human age equivalent for a 10y Chihuahua?* | **56 Human Years** | **Senior** | Crosses human 50+ threshold; enters Senior stage with dental & mitral valve monitoring priority. |
| **TC-BM-02** | **Yorkshire Terrier** | **Toy** (<12 lbs) | **0.5 Years (6 mos)** | *What stage is a 6-month-old Yorkie?* | **7.5 Human Years** | **Puppy** | Neonatal/juvenile growth phase; deciduous teeth transition; primary core vaccination cycle. |
| **TC-BM-03** | **Pomeranian** | **Toy** (<12 lbs) | **2.0 Years** | *What stage is a 2-year-old Pomeranian?* | **24 Human Years** | **Young Adult** | Growth plate closure completed; structural prime; behavioral settling. |
| **TC-BM-04** | **French Bulldog** | **Small** (12–30 lbs) | **6.0 Years** | *What stage is a 6-year-old French Bulldog?* | **40 Human Years** | **Adult** | Mid-life mature adult; routine spinal disk and BOAS airway monitoring indicated. |
| **TC-BM-05** | **Beagle** | **Small** (12–30 lbs) | **10.0 Years** | *What stage is a 10-year-old Beagle?* | **56 Human Years** | **Senior** | Senior onset; baseline metabolic blood panel & thyroid screening recommended. |
| **TC-BM-06** | **Dachshund** | **Small** (12–30 lbs) | **15.0 Years** | *What stage is a 15-year-old Dachshund?* | **76 Human Years** | **Golden Years** | Geriatric longevity champion; intervertebral disk precautions and kidney hydration priority. |
| **TC-BM-07** | **English Bulldog** | **Medium** (30–55 lbs) | **4.0 Years** | *What stage is a 4-year-old English Bulldog?* | **34 Human Years** | **Adult** | Prime adult companion stage; weight control vital to prevent joint and respiratory strain. |
| **TC-BM-08** | **Border Collie** | **Medium** (30–55 lbs) | **8.0 Years** | *What stage is an 8-year-old Border Collie?* | **54 Human Years** | **Senior** | Senior boundary for high-energy working breeds; proactive joint mobility support. |
| **TC-BM-09** | **Siberian Husky** | **Medium** (30–55 lbs) | **13.0 Years** | *What stage is a 13-year-old Siberian Husky?* | **79 Human Years** | **Golden Years** | Geriatric twilight phase; cognitive enrichment and senior vision/hearing accommodations. |
| **TC-BM-10** | **Golden Retriever** | **Large** (55–90 lbs) | **1.0 Year** | *What stage is a 1-year-old Golden Retriever?* | **15 Human Years** | **Puppy** | Adolescent phase; skeletal growth completing; sustained bone-density nutritional balance. |
| **TC-BM-11** | **Labrador Retriever** | **Large** (55–90 lbs) | **7.0 Years** | *What stage is a 7-year-old Labrador?* | **54 Human Years** | **Senior** | Large sporting breed senior transition; strict caloric guardrails to prevent osteoarthritis. |
| **TC-BM-12** | **German Shepherd Dog** | **Large** (55–90 lbs) | **11.0 Years** | *What stage is an 11-year-old German Shepherd?* | **78 Human Years** | **Golden Years** | Venerable geriatric longevity stage; specialized hind-limb mobility and renal care. |
| **TC-BM-13** | **Saint Bernard** | **Giant** (90+ lbs) | **2.0 Years** | *What stage is a 2-year-old Saint Bernard?* | **24 Human Years** | **Young Adult** | Late developmental skeletal maturity completed (~18–24 months). |
| **TC-BM-14** | **Great Dane** | **Giant** (90+ lbs) | **6.0 Years** | *What stage is a 6-year-old Great Dane?* | **52 Human Years** | **Senior** | Accelerated giant breed cellular senescence; senior cardiac & gastric bloat prevention. |
| **TC-BM-15** | **Bernese Mountain Dog**| **Giant** (90+ lbs) | **8.0 Years** | *What stage is an 8-year-old Bernese?* | **66 Human Years** | **Golden Years** | Extended geriatric milestone for giant breeds; oncology vigilance and comfort care. |

---

### 🧪 Suite 3: Admin Console & Commercial Affiliate Management

| Test ID | Test Title | Test Question / Scenario | Test Input Data | Expected Result | Pass Criteria |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-AFF-01** | Affiliate Search by Name | *Does typing a company name in the search bar filter the partner cards in real-time?* | Type `"Fetch"` or `"Trupanion"` into Affiliate search box | List instantaneously narrows to display only the matching company card; exact matches appear at top. | Real-time filter ($<50\text{ms}$); zero latency. |
| **TC-AFF-02** | Search Results Count Badge | *Does the UI indicate active search query and matching record count?* | Search `"Insurance"` or `"Fetch"` | Displays active filter pill: `Filtering by company: "Fetch" (1 matching partner)` with a one-click `(X)` clear button. | Active search pill visible; resets cleanly on click. |
| **TC-AFF-03** | Interactive Dossier Modal Open | *Does clicking an affiliate card or "Dossier & History" button open the full modal?* | Click anywhere on the **Trupanion** card or click **"Dossier & History"** | Opens `AffiliateDetailModal` displaying full partner dossier across 4 tabs: Overview, Contact History, Contract Terms, and Relationship Notes. | Modal transitions smoothly; background scrolling locked. |
| **TC-AFF-04** | Chronological Contact History Log | *Can administrators view and add entries to the partner communication log?* | Open Dossier $\to$ Contact History $\to$ Click **"Add Communication Log"** $\to$ Submit | New communication entry (type, author, date, notes) is added to the chronological timeline and saved to state/localStorage. | New entry rendered with type badge and timestamp. |
| **TC-AFF-05** | Contract Terms & SLA Inspection | *Can contract parameters (payout schedule, threshold, exclusivity) be edited and saved?* | Open Contract Terms $\to$ Click **"Edit Terms"** $\to$ Change threshold to `$250` $\to$ Save | Contract values update in real-time and persist; badge shows active SLA status. | Saved values reflect immediately in UI without reload. |
| **TC-AFF-06** | Dedicated Notes Persistence | *Does typing in the partner notes field persist and provide instant save feedback?* | Enter custom admin notes in the Notes tab $\to$ Click **"Save Partner Notes"** | System updates local/global state, persists to `localStorage`, and triggers instant success toast: `"Partner notes successfully updated!"`. | Toast visible; notes persist across modal reopenings. |

---

### 🧪 Suite 4: Professional Breeder Pro Suite (Kennel OS)

| Test ID | Test Title | Test Question / Scenario | Test Input Data | Expected Result | Pass Criteria |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-BRD-01** | Litter Telemetry & Growth Velocity | *Does entering daily puppy weights compute accurate daily growth velocity?* | Birth Wt: `380g`, Day 7 Wt: `720g` | Computes velocity: $+48.6\text{ g/day}$ ($+89.5\%$ gain); flags green for healthy neonatal weight trajectory. | Growth formula accurate ($(\text{Wt}_2 - \text{Wt}_1) / \Delta\text{days}$). |
| **TC-BRD-02** | Printable Health Passport (PDF) | *Does exporting a puppy health passport generate a print-ready vector PDF?* | Click **"Export Printable Health Passport (PDF)"** for selected puppy | Generates ISO/A4 formatted PDF complete with kennel header, microchip barcode, DA2PP vaccine log, and vet sign-off block. | Clean vector output; no clipped text or page overflow. |
| **TC-BRD-03** | Punnett Genetic Clearance Matrix | *Does pairing dam and sire calculate exact Mendelian inheritance percentages?* | Dam: `Carrier (N/PRA)` $\times$ Sire: `Clear (N/N)` | Calculates: **50% Clear (N/N)**, **50% Carrier (N/PRA)**, **0% Affected (A/A)**. Displays OFA/CHIC reference badges. | Exact Mendelian distribution; zero calculation error. |
| **TC-BRD-04** | NRC 2006 Lactation & Weaning Math | *Does the lactation calculator compute accurate dam energy needs based on litter size?* | Dam: `25 kg`, Litter: `6 Puppies`, Week 4 Peak | Computes $RER = 70 \times 25^{0.75} = 782.6\text{ kcal}$; applies $3.5\times$ peak multiplier $= 2,739\text{ kcal/day}$; renders 4-phase weaning timeline. | Validated against NRC 2006 / AAFCO standards. |
| **TC-BRD-05** | Adopter CRM Pipeline Transition | *Can prospective adopters be advanced through the 5-stage Kanban pipeline?* | Drag/Move buyer from *Screening* to *Deposit Received* | Updates pipeline stage counters, records deposit amount in kennel ledger, and locks puppy reservation. | Pipeline count updates; state persists cleanly. |

---

### 🧪 Suite 5: Generative AI, Rate Limiting & Resilience

| Test ID | Test Title | Test Question / Scenario | Test Input Data | Expected Result | Pass Criteria |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-RES-01** | HTTP 429 Graceful Fallback | *How does the app respond when Gemini API returns 429 quota exhaustion?* | Simulate 429 error on `/api/gemini/health-tip` or `/api/gemini/chat` | Server catches 429 and serves verified veterinary-certified fallback response. UI displays response normally with zero error banners. | Zero unhandled promise rejections; zero blank screens. |
| **TC-RES-02** | Evidence Citation Integrity | *Do 100% of AI diagnostic responses contain verified clinical citations?* | Query: *"My dog ate 10 grapes, what should I do?"* | Response explicitly cites **ASPCA Animal Poison Control** or **Pet Poison Helpline** and urges immediate emergency induction. | Accredited authority citation present in body text. |
| **TC-RES-03** | Local Asset Fallback Speed | *Do all 62 mapped breeds render local images instantly without external network calls?* | Disconnect network or block image domain | Local pencil-sketch/photo assets render from `/public/dog-images/` in $<10\text{ms}$. | 100% image availability; zero broken image icons. |
| **TC-RES-04** | Client AES-256 Vault Encryption | *Are pet medical records encrypted client-side prior to storage?* | Save vaccine date in Medical Vault $\to$ Inspect `localStorage` | Stored string is an encrypted ciphertext blob (`AES-256-GCM`); plaintext medical notes are unreadable in raw storage. | Verified cryptographic security. |

---

## 3. Bug Defect Severity & Resolution SLA Matrix

| Defect Severity | Classification Criteria | Maximum Resolution SLA | Regression Requirement |
| :--- | :--- | :--- | :--- |
| **P0 - Blocker** | System crash, blank screen, unhandled fatal exception, security/encryption breach, or calculation mathematical failure. | **< 2 Hours** | Full test suite re-execution across all 5 size classes prior to redeployment. |
| **P1 - Critical** | Feature failure in Breeder Pro Suite, AI fallback breakdown, affiliate dossier state loss, or broken PDF export. | **< 12 Hours** | Targeted suite re-execution plus dual-build bundle verification. |
| **P2 - Moderate** | Visual misalignment, filter debounce latency ($>150\text{ms}$), or styling defect in dark mode. | **< 48 Hours** | UI responsiveness verification across mobile, tablet, and desktop viewports. |
| **P3 - Minor** | Typos, tooltip wording enhancements, or cosmetic icon padding adjustments. | **< 5 Business Days** | Standard linting and smoke check. |

---

## 4. Production QA Sign-Off Checklist

- [ ] **Suite 1:** Core Lifespan Engine (TC-ENG-01 to 06) passed with 100% compliance.
- [ ] **Suite 2:** All 15 Certified Clinical Benchmarks (TC-BM-01 to 15) match exact AAHA/AVMA criteria.
- [ ] **Suite 3:** Admin Affiliate Management (TC-AFF-01 to 06) tested and verified.
- [ ] **Suite 4:** Breeder Pro Suite (TC-BRD-01 to 05) verified with sample litter and PDF export.
- [ ] **Suite 5:** HTTP 429 rate limit fallbacks and AES-256 vault encryption confirmed resilient.
- [ ] **Build Validation:** `npm run lint` and `npm run build` both return **0 errors**.

---
*Signed off for production deployment upon successful execution of all test criteria.*
