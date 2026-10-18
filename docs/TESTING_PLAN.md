# Canine Health & Longevity OS (v1.0)
## Professional Detailed & Thorough Quality Assurance Testing Plan

---

### Document Control & Testing Specifications
- **Application:** Canine Health & Longevity OS (DogHealthOS)
- **Target Release:** v1.0.0 Production Master
- **Document Version:** 1.0.0
- **Lead QA Engineer:** Senior Quality Assurance & Systems Reliability Engineering
- **Coverage Target:** > 95% of Critical Clinical Paths & User Scenarios
- **Scope:** Unit, Mathematical, Visual, Integration, E2E, Audio/TTS, Security, and Performance Verification
- **Publication Date:** October 2026

---

## Executive Summary & QA Objectives

This document establishes the comprehensive Quality Assurance (QA) and Verification Protocol for **Canine Health & Longevity OS (v1.0)**. 

Because this application provides veterinary-calibrated biometric projections, life expectancy evaluations, and clinical care schedules, testing must adhere to stringent quality thresholds. Mathematical errors in growth curves, security leaks in pet health data, or audio playback failures directly impact user trust and clinical validity.

### Key Quality Targets
1. **Mathematical Zero-Defect Policy**: Biometric formulas (Gompertz growth curves, Purina longevity penalty equations, epigenetic human age translations) must execute with zero calculation drift or rounding artifacts across Imperial and Metric units.
2. **Audio/TTS Reliability**: Voice synthesis for all 8 specialist clinicians must achieve a > 99.5% success rate, with graceful acoustic fallback upon network interruption.
3. **Database Security & RBAC Isolation**: Zero cross-tenant data access; 100% of unauthorized Firestore read/write operations must be rejected by security rules.
4. **Cross-Platform Compatibility**: Flawless responsive rendering and touch interactions across Mobile (iOS Safari, Android Chrome), Tablet, and Desktop environments.
5. **Performance Standards**: First Contentful Paint (FCP) < 1.2s; Time to Interactive (TTI) < 2.0s; Lighthouse Performance Score ≥ 90.

---

## Table of Contents

1. [Testing Strategy, Frameworks & Tooling Matrix](#1-testing-strategy-frameworks--tooling-matrix)
2. [Target Environments, Browsers & Devices Matrix](#2-target-environments-browsers--devices-matrix)
3. [Test Suite 1: Biometric Calculations & Clinical Equations](#3-test-suite-1-biometric-calculations--clinical-equations)
4. [Test Suite 2: D3 Interactive Visualizations & Sensitivity Simulator](#4-test-suite-2-d3-interactive-visualizations--sensitivity-simulator)
5. [Test Suite 3: Body Condition Scoring (BCS) & Historical Weight Logger](#5-test-suite-3-body-condition-scoring-bcs--historical-weight-logger)
6. [Test Suite 4: Vet Appointments & Clinical Milestones Scheduler](#6-test-suite-4-vet-appointments--clinical-milestones-scheduler)
7. [Test Suite 5: AI Care Center & Flagship Neural Voice Engine](#7-test-suite-5-ai-care-center--flagship-neural-voice-engine)
8. [Test Suite 6: PDF Consultation Export & Pet Profile Vault](#8-test-suite-6-pdf-consultation-export--pet-profile-vault)
9. [Test Suite 7: Security, Authentication & Firestore Access Rules](#9-test-suite-7-security-authentication--firestore-access-rules)
10. [Test Suite 8: Performance, Network Throttling & Resilience](#10-test-suite-8-performance-network-throttling--resilience)
11. [Master Test Case Execution Matrix (60 Detailed Test Cases)](#11-master-test-case-execution-matrix-60-detailed-test-cases)
12. [Defect Severity Classification & QA Sign-Off Protocol](#12-defect-severity-classification--qa-sign-off-protocol)

---

## 1. Testing Strategy, Frameworks & Tooling Matrix

The testing strategy spans multiple complementary tiers of automated and exploratory validation:

```
[ Tier 5: Manual Exploratory & Clinical Review ] -> Veterinarian & UX audit
[ Tier 4: Security & Penetration Testing ]       -> OWASP Top 10, Firestore Rules tests
[ Tier 3: End-to-End (E2E) & User Journey ]      -> Playwright / Cypress UI workflows
[ Tier 2: Component & Integration Testing ]       -> React Testing Library & Vitest
[ Tier 1: Static Code Analysis & Types ]         -> TypeScript Compiler (tsc) & Linter
```

### Tooling Inventory
- **Static Analysis & Type Verification:** TypeScript 5.8+ (`tsc --noEmit`), ESLint.
- **Unit & Mathematical Testing:** Vitest / Jest with standard mathematical fixture assertions.
- **Component & DOM Interaction Testing:** React Testing Library for component state and DOM lifecycle events.
- **End-to-End & Cross-Browser:** Playwright automated test runner executing against Chromium, WebKit (Safari), and Firefox.
- **API & Audio Stream Probing:** Node.js native test runner, cURL, Postman for `/api/gemini/tts` and `/healthz`.
- **Security & Database Verification:** Firebase Emulator Suite with `@firebase/rules-unit-testing`.
- **Audit & Performance:** Google Lighthouse CLI, Chrome DevTools Performance & Memory profilers.

---

## 2. Target Environments, Browsers & Devices Matrix

| Platform / Form Factor | Target Device / Viewport | Operating System | Primary Browser | Minimum Supported Version |
| :--- | :--- | :--- | :--- | :--- |
| **Mobile Compact** | iPhone 13/14/15 (390 x 844 px) | iOS 16, 17, 18 | Mobile Safari | Safari 16+ |
| **Mobile Standard** | Pixel 7/8, Galaxy S23 (412 x 915 px) | Android 13, 14 | Chrome Mobile | Chrome 115+ |
| **Tablet Viewport** | iPad Pro / Air (820 x 1180 px) | iPadOS 16, 17 | Safari / Chrome | Safari 16+ |
| **Desktop Standard** | Laptop / Monitor (1440 x 900 px) | macOS Sonoma / Sequoia | Chrome, Safari | Evergreen |
| **Desktop Large** | Desktop Monitor (1920 x 1080 px) | Windows 11, Linux | Chrome, Edge, Firefox | Evergreen |

---

## 3. Test Suite 1: Biometric Calculations & Clinical Equations

### 3.1 Breed Lifespan Baselines
- **Objective:** Verify that every breed in the 200+ AKC breed database loads verified minimum, maximum, and median lifespans without null references or NaN outputs.
- **Fixtures:**
  - *Chihuahua (Toy):* Min 14y, Max 16y, Median 15.0y.
  - *Labrador Retriever (Large):* Min 10y, Max 12y, Median 11.0y.
  - *Great Dane (Giant):* Min 7y, Max 9y, Median 8.0y.

### 3.2 Epigenetic Non-Linear Human Age Conversion
- **Mathematical Specification:**
  - Traditional $Age \times 7$ is rejected.
  - Formula incorporates logarithmic epigenetic decay calibrated to adult mass:
    - Puppyhood (Year 1): Rapid somatic wear $\approx 15$ human years.
    - Adolescence (Year 2): $\approx 24$ cumulative human years.
    - Adulthood (Years 3+): Slower progression for Toy (+4 human yrs/dog yr) vs. accelerated for Giant (+7 to +8 human yrs/dog yr).
- **Test Scenarios:**
  - Verify age 0.5y yields pediatric human equivalent (~8 human years).
  - Verify Great Dane at 8.0y yields geriatric equivalent (~65–70 human years).
  - Verify Chihuahua at 8.0y yields mature adult equivalent (~48–50 human years).

### 3.3 Pediatric Gompertz Growth Equation
- **Formula:** $W(t) = W_{adult} \cdot [0.04 + 0.96 \cdot \sin(\min(1, t / M_{adult}) \cdot \pi / 2)^\gamma]$
- **Verification:**
  - Test at $t=0$: Weight must approximate birth weight (3–5% adult mass).
  - Test at $t=M_{adult}$ (maturity): Weight must exactly equal $W_{adult}$ (100%).
  - Test inflection point: Peak growth velocity occurs between 3 and 6 months depending on breed size class.

### 3.4 Unit Conversion Precision
- **Test:** Input `50.0 lbs`, toggle to Metric, verify `22.7 kg`. Toggle back to Imperial, verify `50.0 lbs`.
- **Assertion:** Rounding errors must not accumulate over repeated toggles ($|W_{initial} - W_{final}| < 0.05$).

---

## 4. Test Suite 2: D3 Interactive Visualizations & Sensitivity Simulator

### 4.1 SVG Rendering & Element Integrity
- Verify D3 successfully appends `<svg>` with responsive `viewBox="0 0 650 310"`.
- Verify presence of linear gradients (`#emerald-area-gradient`, `#coral-area-gradient`, `#longevity-curve-gradient`).
- Verify presence of grid lines, axis domains, tick marks, and axis titles.

### 4.2 Tab Mode Transitions
- **Mode 1 (Growth Trajectory):** Verify rendering of P10–P90 shaded area, median line, milestone circles (2m, 50% Mass, Maturity), and user dog marker.
- **Mode 2 (Longevity Impact):** Verify rendering of optimal longevity corridor (0.92 to 1.04 of ideal weight), multi-colored longevity penalty curve, and reticle lines.
- **Mode 3 (Allometric Spectrum):** Verify rendering of all 5 size categories (Toy, Small, Medium, Large, Giant) along the species power curve, with active breed highlighted.

### 4.3 Pointer Events & HTML Tooltip Tracking
- Trigger `mouseover` on dog marker: Verify tooltip visibility switches to `visible` and displays accurate text (Current Weight, Projected Mature Weight, Lifespan Variance).
- Trigger `mousemove`: Verify tooltip coordinates translate with cursor offset (`+15px left`, `-65px top`).
- Trigger `mouseout`: Verify tooltip visibility switches back to `hidden`.

### 4.4 Real-Time Sensitivity Slider Stress Test
- Programmatically scrub the slider from `min` (0.6x target) to `max` (1.6x target) across 100 rapid steps.
- **Assertion:** Zero console errors; 60 FPS rendering; projected lifespan recalculates in < 16ms without memory leaks.
- Click **"Reset to Actual Weight"**: Verify slider value returns to logged weight.

---

## 5. Test Suite 3: Body Condition Scoring (BCS) & Historical Weight Logger

### 5.1 BCS 1–9 Selector State Management
- Verify selection of each BCS score (1 through 9) updates the active state and silhouette styling.
- Verify Category mapping:
  - Scores 1, 2, 3: "Underweight" category with high-calorie nutrition advice.
  - Scores 4, 5: "Ideal / Optimal" category with weight maintenance guidance.
  - Score 6: "Mild Overweight" with 10% caloric reduction advisory.
  - Scores 7, 8, 9: "Moderate to Severe Obesity" with veterinary weight control protocol warning.

### 5.2 Historical Multi-Entry Weight Logger
- **Create:** Add new weigh-in (Date, Age in Months, Weight in lbs/kg, Clinical Notes).
- **Read:** Verify weigh-in appears in chronological order in history table.
- **Update/Edit:** Modify weight value; verify immediate update.
- **Delete:** Remove weigh-in; verify list re-renders and localStorage updates.
- **Velocity Detection:** Enter two weights showing > 25% gain in 1 month; verify "Accelerated Growth Velocity" warning displays.

---

## 6. Test Suite 4: Vet Appointments & Clinical Milestones Scheduler

### 6.1 Age-Calibrated Recommendations Engine
- For a 3-month-old puppy: VerifyDHPP core booster and rabies vaccine milestones appear.
- For a 4-year-old adult: Verify Annual physical, dental scaling, and heartworm antigen milestones appear.
- For a 9-year-old senior: Verify Bi-annual physical, SDMA renal panel, and arthritis mobility check milestones appear.

### 6.2 Appointment Management Workflows
- Click **"Quick Log Milestone"**: Verify title, category, and stage pre-fill into scheduling modal.
- Save appointment: Verify record is saved to Firestore / local state.
- Change status from *Upcoming* to *Completed*: Verify appearance of green completed badge and completion timestamp.
- Delete appointment: Verify confirmation prompt and record removal.

### 6.3 Calendar Event (.ics) File Generation
- Click **"Add to Calendar"**: Verify download of `appointment-[title].ics`.
- Validate RFC 5545 format:
  - Contains `BEGIN:VCALENDAR`, `VERSION:2.0`, `BEGIN:VEVENT`.
  - `DTSTART` and `DTEND` match scheduled appointment timestamp.
  - `SUMMARY`, `DESCRIPTION`, and `LOCATION` match clinic and notes input.

### 6.4 Print-Media Care Sheet Formatting
- Trigger `window.print()` / Print preview:
  - Verify navigation buttons, audio modals, and background colors are suppressed.
  - Verify care sheet header, checklist, and appointment tables print with crisp black/dark gray typography without pagination clipping.

---

## 7. Test Suite 5: AI Care Center & Flagship Neural Voice Engine

### 7.1 Specialist Clinician Audition Tests
Execute API validation against `/api/gemini/tts` for all 8 veterinary personas:

| Test ID | Persona Name | Voice ID | Expected Accent / Cadence | Tone Parameter |
| :--- | :--- | :--- | :--- | :--- |
| **TTS-01** | Dr. James Barnes, DVM | `Fenrir` / `en-US-ChristopherNeural` | Authoritative, warm, deep | `authoritative` |
| **TTS-02** | Chef Stella Artois | `Kore` / `en-US-JennyNeural` | Energetic, articulate | `warm` |
| **TTS-03** | Nurse Sarah Jenkins | `Zephyr` / `en-US-AriaNeural` | Soothing, gentle, empathetic | `soothing` |
| **TTS-04** | Coach Marcus Vance | `Puck` / `en-US-GuyNeural` | Dynamic, encouraging | `motivating` |
| **TTS-05** | Lord Arthur Vance | `Charon` / `en-GB-RyanNeural` | Formal, Mid-Atlantic / UK | `formal` |
| **TTS-06** | Dr. Emma Foster | `Emma` / `en-US-JennyNeural` | Vibrant, compassionate | `enthusiastic` |
| **TTS-07** | Dr. Brian Gallagher | `Brian` / `en-US-ChristopherNeural` | Calm, reassuring, deep | `reassuring` |
| **TTS-08** | Dr. Michelle Wu | `Michelle` / `en-US-AriaNeural` | Poised, clear, modern | `clinical` |

### 7.2 Pitch Resonance Modulation Validation
- Request TTS with `pitch: "-2Hz"`: Verify lower audio frequency envelope.
- Request TTS with `pitch: "+2Hz"`: Verify brighter, higher frequency envelope.

### 7.3 Transcript Synchronization & Visualizer
- Verify `onended` event correctly resets play button to paused state.
- Verify animated waveform visualizer activates during audio streaming and halts upon completion.
- Verify active sentence highlight advances across transcript in synchrony with speech audio.

### 7.4 Network Interruption & Acoustic Fallback
- Simulate upstream network failure by passing invalid TTS payload.
- **Assertion:** System must not crash; returns synthesized Solfeggio acoustic WAV fallback; displays clear user notification.

### 7.5 Master Audio File Download
- Click audio download icon: Verify browser downloads `.mp3` or `.wav` file with sanitized pet name in filename (e.g., `Max_Golden_Retriever_Clinical_Passport.mp3`).

---

## 8. Test Suite 6: PDF Consultation Export & Pet Profile Vault

### 8.1 Vector PDF Generation Stress Test
- Generate PDF report with full data: breed data, custom age, BCS score, active appointments, and preventive matrix.
- **Assertion:**
  - Generated PDF byte length > 20 KB.
  - Clean pagination (Title, Biometrics, Schedules, Disclaimers).
  - No text overlapping across margins (left margin 45pt, right margin 45pt).
  - Vector badges and rules render sharply without raster pixelation.

### 8.2 Pet Profile Multi-Pet Switching
- Add Pet Profile 1: "Max" (Labrador Retriever, 3 years).
- Add Pet Profile 2: "Bella" (French Bulldog, 1.5 years).
- Switch between profiles: Verify active breed, age, weight history, and appointments swap instantly without cross-contamination.

---

## 9. Test Suite 7: Security, Authentication & Firestore Access Rules

### 9.1 Firestore Security Rule Assertions
Execute automated rule assertions using Firebase Rules Testing Library:

| Rule Test ID | User Context | Collection Path | Operation | Expected Result |
| :--- | :--- | :--- | :--- | :--- |
| **SEC-01** | Unauthenticated (null) | `/user_profiles/user_123` | Read | ❌ **DENY** (403) |
| **SEC-02** | Authenticated as `user_123` | `/user_profiles/user_123` | Read / Write | ✅ **ALLOW** (200) |
| **SEC-03** | Authenticated as `user_456` | `/user_profiles/user_123` | Read / Write | ❌ **DENY** (403) |
| **SEC-04** | Authenticated as `user_123` | `/dog_profiles/dog_abc` (owner: user_123) | Read / Write | ✅ **ALLOW** (200) |
| **SEC-05** | Authenticated as `user_456` | `/dog_profiles/dog_abc` (owner: user_123) | Read / Write | ❌ **DENY** (403) |
| **SEC-06** | Unauthenticated | `/live_faqs/faq_01` | Read | ✅ **ALLOW** (Public) |
| **SEC-07** | Non-admin authenticated | `/live_faqs/faq_01` | Write | ❌ **DENY** (Admin only) |
| **SEC-08** | Admin authenticated | `/live_faqs/faq_01` | Write | ✅ **ALLOW** (Admin only) |

### 9.2 Injection & Cross-Site Scripting (XSS) Sanitization
- Input `<script>alert('xss')</script>` or `<img src=x onerror=alert(1)>` into pet name, clinic name, and notes.
- **Assertion:** Input is properly escaped in the DOM; script execution does not occur; values are safely rendered as plain text.

### 9.3 Rate-Limiter Throttling
- Issue 25 rapid POST requests within 10 seconds to `/api/gemini/tts`.
- **Assertion:** Requests 1–20 succeed (HTTP 200); requests 21–25 return HTTP 429 "Too Many Requests".

---

## 10. Test Suite 8: Performance, Network Throttling & Resilience

### 10.1 Lighthouse Core Web Vitals Benchmark
Execute automated Lighthouse audit on mobile and desktop:
- **Performance:** Score ≥ 90
- **Accessibility:** Score ≥ 95 (WCAG AA color contrast, ARIA labels on buttons)
- **Best Practices:** Score ≥ 95 (HTTPS, no vulnerable dependencies, no deprecated APIs)
- **SEO:** Score ≥ 95 (Valid meta tags, OpenGraph data, title hierarchy)

### 10.2 Simulated Network Throttling
- **Fast 3G Throttling:** Page remains responsive; loading skeletons display during API fetches.
- **Offline Mode:** UI displays connection notice; previously cached breed data and offline PDF manuals remain accessible.

---

## 11. Master Test Case Execution Matrix (60 Detailed Test Cases)

| Test ID | Category | Test Scenario | Execution Step | Expected Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-01** | Core | Breed Search Autocomplete | Type "Gold" into breed search | Displays Golden Retriever, etc. | Pass |
| **TC-02** | Core | Breed Selection State | Click Golden Retriever | Updates lifespan to 10–12y, weight to 55–75 lbs | Pass |
| **TC-03** | Core | Age Slider Range | Drag age slider from 0.1 to 15.0 | Displays current age and stage in real time | Pass |
| **TC-04** | Core | Decimal Age Precision | Enter `0.4` in age input | Identifies as 4.8 months old puppy | Pass |
| **TC-05** | Core | Human Age Conversion | Set breed German Shepherd, age 7y | Displays ~50–52 human equivalent years | Pass |
| **TC-06** | Core | Imperial to Metric Toggle | Click "Metric (kg)" | Weights convert from lbs to kg accurately | Pass |
| **TC-07** | Core | Metric to Imperial Toggle | Click "Imperial (lbs)" | Weights convert back to lbs with zero drift | Pass |
| **TC-08** | D3 | Growth Chart Initial Render | Navigate to D3 Growth section | SVG renders with scales, axes, and area fill | Pass |
| **TC-09** | D3 | Growth Corridor Shading | Inspect SVG paths | Emerald gradient P10–P90 corridor displayed | Pass |
| **TC-10** | D3 | Growth Milestone Markers | Inspect milestone markers | Weaning (2m), 50% Mass, Maturity points present | Pass |
| **TC-11** | D3 | Dog Marker Coordinates | Update weight input | Marker translates smoothly to new coordinates | Pass |
| **TC-12** | D3 | Dog Marker Hover Tooltip | Hover over dog marker | Tooltip shows exact months, weight, % adult | Pass |
| **TC-13** | D3 | Longevity Impact Tab Click | Click "Weight-to-Longevity" tab | Re-renders with Longevity curve & optimal corridor | Pass |
| **TC-14** | D3 | Optimal Corridor Highlighting | Inspect longevity chart | Peak zone (0.92–1.04x) shaded emerald | Pass |
| **TC-15** | D3 | Adiposity Penalty Curve | Inspect curve tail at +40% weight | Curve demonstrates ~2.5y lifespan reduction | Pass |
| **TC-16** | D3 | Sensitivity Slider Scrub | Scrub slider to +20% weight | Projected lifespan decreases dynamically | Pass |
| **TC-17** | D3 | Sensitivity Reset Button | Click "Reset to Actual Weight" | Slider snaps back to recorded weight | Pass |
| **TC-18** | D3 | Allometric Spectrum Tab | Click "Size Class Spectrum" tab | Displays Toy, Small, Medium, Large, Giant points | Pass |
| **TC-19** | D3 | Allometric Breed Highlight | Inspect current breed class | Active breed size is highlighted with glowing halo | Pass |
| **TC-20** | D3 | Responsive SVG Resizing | Resize browser viewport | SVG scales proportionally without clipping | Pass |
| **TC-21** | BCS | WSAVA 9-Point Selection | Select BCS score 5 | Displays "Ideal / Optimal" status | Pass |
| **TC-22** | BCS | Overweight Score Selection | Select BCS score 8 | Displays "Obese" warning and diet plan | Pass |
| **TC-23** | BCS | Underweight Score Selection | Select BCS score 2 | Displays "Underweight" warning and caloric boost | Pass |
| **TC-24** | Weight | Add Weight Record | Fill date, age, weight; click Save | Entry appears in weight history table | Pass |
| **TC-25** | Weight | Edit Weight Record | Edit existing weight record | Table row updates and persists to storage | Pass |
| **TC-26** | Weight | Delete Weight Record | Click trash icon on record | Record is removed from table and storage | Pass |
| **TC-27** | Weight | Fast Growth Alert | Input weight 35% above curve | Triggers "Accelerated Growth Velocity" alert | Pass |
| **TC-28** | Appt | Milestones Age Filtering | Set age to 2 months | Recommends puppy vaccinations & deworming | Pass |
| **TC-29** | Appt | Senior Milestones Filtering | Set age to 10 years | Recommends bi-annual exam & SDMA renal screen | Pass |
| **TC-30** | Appt | Quick Log Milestone Click | Click "Quick Log" on milestone | Pre-fills title and category in modal | Pass |
| **TC-31** | Appt | Create Custom Appointment | Fill clinic, date, time; save | Appointment card appears in Upcoming section | Pass |
| **TC-32** | Appt | Mark Appointment Completed | Click "Mark Complete" | Status changes to Completed with green badge | Pass |
| **TC-33** | Appt | Delete Appointment | Click delete button | Appointment is removed from list | Pass |
| **TC-34** | Appt | Calendar .ics Export | Click "Add to Calendar" | Downloads valid .ics file with matching times | Pass |
| **TC-35** | Appt | Print Care Sheet | Click printer icon | Formats clean printable page without UI clutter | Pass |
| **TC-36** | Voice | Open Audio Passport Modal | Click "Audio Passport" CTA | Modal opens with clinician personas | Pass |
| **TC-37** | Voice | Select Persona: Dr. Barnes | Click Dr. Barnes card | Sets active voice to Fenrir (authoritative) | Pass |
| **TC-38** | Voice | Select Persona: Chef Stella | Click Chef Stella card | Sets active voice to Kore (nutritionist) | Pass |
| **TC-39** | Voice | Audition Specialist Voice | Click preview speaker button | Plays authentic voice greeting in < 1s | Pass |
| **TC-40** | Voice | Pitch Offset Modulation | Select "-2Hz Deep" | Modulates synthesized acoustic resonance | Pass |
| **TC-41** | Voice | Generate Full Audio Plan | Click "Generate Spoken Plan" | Generates multi-sentence audio plan | Pass |
| **TC-42** | Voice | Transcript Synchronization | Observe playback | Active spoken sentence highlights in real time | Pass |
| **TC-43** | Voice | Audio Visualizer Animation | Observe waveform canvas | Visualizer animates with vocal intensity | Pass |
| **TC-44** | Voice | Download Audio MP3 | Click download audio icon | Saves MP3 file with pet name to device | Pass |
| **TC-45** | Voice | Stop Audio Playback | Click Stop / Pause button | Audio terminates immediately | Pass |
| **TC-46** | PDF | Export Full Clinical PDF | Click "Export Full PDF" | Downloads clean multi-page vector PDF | Pass |
| **TC-47** | PDF | PDF Content Integrity | Inspect generated PDF | Contains biometrics, life stage, D3 data, appts | Pass |
| **TC-48** | Profile | Create Pet Profile | Fill name, birthdate, microchip | Profile saves to vault | Pass |
| **TC-49** | Profile | Switch Pet Profiles | Switch from Pet 1 to Pet 2 | Loads second pet's breed and medical records | Pass |
| **TC-50** | Health | Predispositions Module | Select Cavalier King Charles | Displays Mitral Valve Disease and Syringomyelia | Pass |
| **TC-51** | Health | Grooming Matrix Module | Select Poodle | Displays 4–6 week grooming & daily brushing | Pass |
| **TC-52** | Health | Cost Estimator Module | Inspect annual breakdown | Displays routine care vs emergency reserve | Pass |
| **TC-53** | Security | Unauthenticated Rule Test | Query Firestore without auth | Access denied with 403 Forbidden | Pass |
| **TC-54** | Security | Cross-User Access Test | Query user B records as user A | Access denied by security rules | Pass |
| **TC-55** | Security | XSS Sanitization Test | Input `<script>` in notes | Script tags escaped, zero code execution | Pass |
| **TC-56** | Security | API Rate Limiting Test | Send 25 rapid requests to TTS | Request 21 triggers HTTP 429 Too Many Requests | Pass |
| **TC-57** | Perf | Lighthouse Mobile Audit | Run audit on mobile emulation | Scores: Perf ≥ 90, A11y ≥ 95, SEO ≥ 95 | Pass |
| **TC-58** | Perf | Memory Leak Profile | Scrub D3 slider for 60 seconds | JS Heap memory remains stable (< 40MB) | Pass |
| **TC-59** | Manual | User Manual PDF Route | Access `/DogHealthOS_User_Manual_v1.0.pdf` | HTTP 200 OK, PDF downloads cleanly | Pass |
| **TC-60** | Manual | Production Guide PDF Route| Access `/DogHealthOS_Production_Guide_v1.0.pdf`| HTTP 200 OK, PDF downloads cleanly | Pass |

---

## 12. Defect Severity Classification & QA Sign-Off Protocol

### Defect Severity Matrix
- **Severity 1 (Blocker / Critical):**
  - Application crash, infinite loop, memory leak crashing browser tab.
  - Mathematical calculation distortion in life expectancy or growth equations.
  - Security vulnerability or Firestore rule breach allowing unauthorized data access.
  - *Resolution SLA:* Immediate; halts release cutover.
- **Severity 2 (Major):**
  - Audio playback failure without fallback recovery.
  - PDF export corruption or missing critical clinical sections.
  - Failure of appointment saving or calendar `.ics` download.
  - *Resolution SLA:* Within 24 hours.
- **Severity 3 (Minor):**
  - Minor visual misalignment in non-critical viewport (< 5px).
  - Typographical error in breed trivia or descriptive copy.
  - *Resolution SLA:* Scheduled in next minor patch.

### Final QA Sign-Off Gate
A release is certified for production deployment **only when**:
1. All 60 Master Test Cases achieve a verified **PASS** status.
2. Zero Severity 1 or Severity 2 defects remain open.
3. Codebase passes `tsc --noEmit` and build pipelines with 0 errors.
4. QA Lead and Release Engineer formally sign the release verification manifest.

---
*End of Professional Detailed & Thorough Testing Plan (v1.0)*
