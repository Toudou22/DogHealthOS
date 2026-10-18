const fs = require('fs');
const path = require('path');
const { jsPDF } = require('jspdf');

function generateProductionGuidePDF() {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'letter'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 45;
  const contentWidth = pageWidth - margin * 2;

  let y = margin;

  function checkPageBreak(requiredHeight) {
    if (y + requiredHeight > pageHeight - 55) {
      doc.addPage();
      y = margin + 20;
      addRunningHeaderFooter();
    }
  }

  function addRunningHeaderFooter() {
    const pageNum = doc.internal.getCurrentPageInfo().pageNumber;
    if (pageNum === 1) return; // Skip title page

    // Running Header
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(138, 134, 128); // #8A8680
    doc.text('Canine Health & Longevity OS (v1.0) — Production Guide & Operational Runbook', margin, 30);
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.5);
    doc.line(margin, 35, pageWidth - margin, 35);

    // Running Footer
    doc.line(margin, pageHeight - 35, pageWidth - margin, pageHeight - 35);
    doc.setFontSize(8);
    doc.setTextColor(138, 134, 128);
    doc.text('Release Engineering & Operations — DogHealthOS Production Checklist', margin, pageHeight - 22);
    doc.text(`Page ${pageNum}`, pageWidth - margin, pageHeight - 22, { align: 'right' });
  }

  function addTitlePage() {
    // Top banner badge
    doc.setFillColor(255, 107, 74); // Coral #FF6B4A
    doc.roundedRect(margin, y, 220, 22, 4, 4, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text('OFFICIAL PRODUCTION RELEASE RUNBOOK', margin + 12, y + 15);

    y += 45;

    // Main App Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(26);
    doc.setTextColor(26, 26, 26);
    doc.text('Canine Health & Longevity OS', margin, y);

    y += 24;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(45, 140, 111); // Emerald #2D8C6F
    doc.text('Professional Step-by-Step Guide & Checklist to Production', margin, y);

    y += 25;
    doc.setDrawColor(26, 26, 26);
    doc.setLineWidth(2);
    doc.line(margin, y, pageWidth - margin, y);

    y += 30;

    // Executive Summary Box
    doc.setFillColor(248, 246, 242);
    doc.setDrawColor(220, 215, 205);
    doc.setLineWidth(1);
    doc.roundedRect(margin, y, contentWidth, 125, 6, 6, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(26, 26, 26);
    doc.text('EXECUTIVE DEPLOYMENT SPECIFICATION & TARGET SLOs', margin + 16, y + 24);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(70, 70, 70);
    const summaryText = 
      'This production operations guide governs the commercial transition of Canine Health & Longevity OS ' +
      'to a zero-downtime, autoscaling cloud architecture. The system integrates Express.js 4.x, React 19, ' +
      'Google Cloud Run container orchestration, Firebase Firestore security hardening, Microsoft Azure / Edge ' +
      'HD Neural Studio synthesis, and Google Gemini API services. Compliance with the 40 verification criteria ' +
      'is mandatory prior to production traffic cutover.';
    
    const splitSummary = doc.splitTextToSize(summaryText, contentWidth - 32);
    doc.text(splitSummary, margin + 16, y + 42);

    y += 145;

    // Metadata Details Grid
    const colWidth = (contentWidth - 20) / 2;
    
    // Left Metadata Card
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(230, 230, 230);
    doc.roundedRect(margin, y, colWidth, 140, 6, 6, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(45, 140, 111);
    doc.text('TARGET SERVICE LEVEL OBJECTIVES', margin + 12, y + 20);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(50, 50, 50);
    doc.text('• System Availability: 99.9% Monthly Uptime', margin + 12, y + 40);
    doc.text('• API Latency: P95 < 250ms Across US Regions', margin + 12, y + 58);
    doc.text('• Edge CDN Static Delivery: < 80ms Latency', margin + 12, y + 76);
    doc.text('• TTS Audio Streaming: Initial Byte < 600ms', margin + 12, y + 94);
    doc.text('• Data Durability: Automated Daily Backups (30d)', margin + 12, y + 112);

    // Right Metadata Card
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(230, 230, 230);
    doc.roundedRect(margin + colWidth + 20, y, colWidth, 140, 6, 6, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(255, 107, 74);
    doc.text('INFRASTRUCTURE PROFILE', margin + colWidth + 32, y + 20);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(50, 50, 50);
    doc.text('• Runtime: Google Cloud Run (Node 22 Alpine)', margin + colWidth + 32, y + 40);
    doc.text('• Database: Google Cloud Firestore (Managed)', margin + colWidth + 32, y + 58);
    doc.text('• Secrets: Google Cloud Secret Manager', margin + colWidth + 32, y + 76);
    doc.text('• Ingress: HTTPS / Managed TLS 1.3 Certificate', margin + colWidth + 32, y + 94);
    doc.text('• Autoscaling: 1 to 20 Concurrent Instances', margin + colWidth + 32, y + 112);

    y += 165;

    // Table of Contents Preview
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(26, 26, 26);
    doc.text('RUNBOOK PHASES & VERIFICATION MODULES', margin, y);

    y += 15;
    const tocItems = [
      'Phase 1: Environment Variables, Secrets & Configuration Management',
      'Phase 2: Database Hardening, Firestore Security Rules & Indexes',
      'Phase 3: Backend Express Hardening & Audio Engine Resilience',
      'Phase 4: Frontend Optimization, Asset Bundling & Caching Headers',
      'Phase 5: Multi-Stage Dockerization & Cloud Run Orchestration',
      'Phase 6: Custom Domain, Managed SSL/TLS & Cloud CDN Edge Setup',
      'Phase 7: Monitoring, Telemetry, Structured Logging & Alert Policies',
      'Phase 8: Master Pre-Flight Go / No-Go Checklist (40 Strict Criteria)',
      'Phase 9: Day-1 Operational Runbook & Rapid Rollback Procedures'
    ];

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(70, 70, 70);
    tocItems.forEach((item, index) => {
      doc.text(`• ${item}`, margin + 10, y + (index * 17));
    });

    // Add page break after Title Page
    doc.addPage();
    y = margin + 20;
    addRunningHeaderFooter();
  }

  function addPhaseHeading(num, title) {
    checkPageBreak(50);
    y += 10;
    doc.setFillColor(255, 107, 74);
    doc.rect(margin, y, 4, 18, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12.5);
    doc.setTextColor(26, 26, 26);
    doc.text(`Phase ${num}: ${title}`, margin + 12, y + 14);

    y += 24;
    doc.setDrawColor(230, 230, 230);
    doc.setLineWidth(1);
    doc.line(margin, y, pageWidth - margin, y);
    y += 15;
  }

  function addSubheading(title) {
    checkPageBreak(35);
    y += 8;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(45, 140, 111);
    doc.text(title, margin, y);
    y += 16;
  }

  function addParagraph(text) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(60, 60, 60);
    const splitText = doc.splitTextToSize(text, contentWidth);
    checkPageBreak(splitText.length * 13 + 8);
    doc.text(splitText, margin, y);
    y += splitText.length * 13 + 8;
  }

  function addBullet(bulletTitle, text) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.8);
    doc.setTextColor(30, 30, 30);
    checkPageBreak(28);

    const prefix = `• ${bulletTitle}: `;
    const prefixWidth = doc.getTextWidth(prefix);
    
    doc.text(prefix, margin + 8, y);
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    
    const splitText = doc.splitTextToSize(text, contentWidth - 24);
    doc.text(splitText, margin + 8 + prefixWidth, y);
    y += splitText.length * 13 + 5;
  }

  function addCalloutBox(title, body, type = 'info') {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    const splitBody = doc.splitTextToSize(body, contentWidth - 28);
    const boxHeight = splitBody.length * 12 + 36;

    checkPageBreak(boxHeight + 10);

    const bgCol = type === 'alert' ? [254, 242, 242] : [240, 249, 245];
    const borderCol = type === 'alert' ? [239, 68, 68] : [45, 140, 111];
    const titleCol = type === 'alert' ? [185, 28, 28] : [45, 140, 111];

    doc.setFillColor(bgCol[0], bgCol[1], bgCol[2]);
    doc.setDrawColor(borderCol[0], borderCol[1], borderCol[2]);
    doc.setLineWidth(1);
    doc.roundedRect(margin, y, contentWidth, boxHeight, 5, 5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(titleCol[0], titleCol[1], titleCol[2]);
    doc.text(title, margin + 14, y + 18);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(50, 50, 50);
    doc.text(splitBody, margin + 14, y + 32);

    y += boxHeight + 12;
  }

  function addChecklistItem(num, text) {
    checkPageBreak(22);
    doc.setDrawColor(45, 140, 111);
    doc.setFillColor(255, 255, 255);
    doc.rect(margin + 6, y - 9, 10, 10, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(26, 26, 26);
    doc.text(`[ ${num} ]`, margin + 22, y);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    const splitText = doc.splitTextToSize(text, contentWidth - 65);
    doc.text(splitText, margin + 55, y);
    y += Math.max(16, splitText.length * 12 + 4);
  }

  // BUILD COMPLETE DOCUMENT
  addTitlePage();

  // PHASE 1
  addPhaseHeading(1, 'Environment Variables, Secrets & Configuration');
  addParagraph(
    'Production security mandates zero plain-text secrets in source repositories. All server-side credentials ' +
    'must be provisioned via Google Cloud Secret Manager and injected at runtime into Cloud Run containers.'
  );
  addBullet('NODE_ENV=production', 'Enables Express production caching, disables verbose error stack traces.');
  addBullet('GEMINI_API_KEY', 'Injected exclusively into Cloud Run container memory; inaccessible from browser bundles.');
  addBullet('PORT=3000', 'Server listening port matching the internal Cloud Run container routing.');
  addBullet('CORS & Origin Hardening', 'Strictly binds allowed origins to production domain (https://doghealthos.com).');

  // PHASE 2
  addPhaseHeading(2, 'Database Hardening, Firestore Security & Schema Rules');
  addParagraph(
    'The Firestore database enforces strict User Access Isolation (RBAC) via declarative security rules deployed directly ' +
    'to the production project (ai-studio-dogbreedlifeexpe-6edb2685-ea7c-424d-97f2-ce6b32cfa948).'
  );
  addCalloutBox(
    'FIRESTORE SECURITY RULE ENFORCEMENT',
    '• User Isolation: User profiles, dog profiles, and appointment records are strictly constrained by request.auth.uid == userId.\n' +
    '• Admin Boundary: Administrative write privileges for global FAQs and system settings require verified admin claims.\n' +
    '• Automated Backups: Cloud Firestore automated daily backup schedule configured with 30-day retention for point-in-time disaster recovery.',
    'info'
  );

  // PHASE 3
  addPhaseHeading(3, 'Backend Express Hardening & Audio Engine Resilience');
  addParagraph(
    'The backend server provides a resilient bridge between client interactions, neural voice generation, and Gemini AI services.'
  );
  addBullet('Helmet Security Headers', 'Enforces CSP, X-Frame-Options, HSTS (31536000s), and nosniff content security headers.');
  addBullet('Rate-Limiting Protection', 'Caps TTS requests at 20 req/min per IP to prevent abusive resource exhaustion.');
  addBullet('In-Memory Stream Buffer', 'Directly buffers EdgeTTS synthesized audio into memory Base64 data without residual disk fragmentation.');
  addBullet('Health Check Probes', 'Provides /healthz and /readyz endpoints returning HTTP 200 OK for Cloud Run ingress probes.');

  // PHASE 4
  addPhaseHeading(4, 'Frontend Optimization, Asset Bundling & Caching Headers');
  addParagraph(
    'The frontend SPA is compiled into an optimized static distribution via Vite, minimizing bandwidth and maximizing First Contentful Paint (FCP).'
  );
  addBullet('Code Splitting & Dynamic Chunks', 'Heavy visualization libraries (D3, jsPDF) are dynamically chunked to keep entry bundle < 350KB.');
  addBullet('Immutable Asset Caching', 'Hashed bundles (/assets/*.js, *.css) served with max-age=31536000, immutable.');
  addBullet('Dynamic HTML Freshness', 'HTML entry point served with no-cache, no-store, must-revalidate to ensure instant deployment cutovers.');

  // PHASE 5
  addPhaseHeading(5, 'Multi-Stage Dockerization & Cloud Run Orchestration');
  addParagraph(
    'The application executes inside a hardened, two-stage Docker container based on node:22-alpine.'
  );
  addBullet('Non-Root Security Context', 'Container executes under the non-privileged "node" user, neutralizing container-breakout vectors.');
  addBullet('Min Instances = 1', 'Maintains a warm container instance 24/7 to completely eliminate cold-start latency for end users.');
  addBullet('Concurrency & Auto-Scaling', 'Configured for 80 concurrent requests per container, scaling dynamically from 1 to 20 instances.');

  // PHASE 6
  addPhaseHeading(6, 'Custom Domain, Managed SSL/TLS & Cloud CDN Edge Setup');
  addParagraph(
    'Global routing leverages Google Cloud Load Balancing with automated multi-region TLS certificates.'
  );
  addBullet('DNS Records', 'Directs apex (@) and app CNAME records to Google Hosted ingress points with 300s TTL.');
  addBullet('Managed SSL/TLS', 'Auto-renewed 2048-bit RSA/ECC certificates with automatic HTTP-to-HTTPS redirect.');
  addBullet('Cloud CDN Acceleration', 'Static UI assets and PDF manuals cached globally across 100+ edge points of presence.');

  // PHASE 7
  addPhaseHeading(7, 'Monitoring, Telemetry, Structured Logging & Alerts');
  addParagraph(
    'Cloud-native telemetry provides immediate visibility into application health and anomalies. Alerts are configured in Google Cloud Monitoring with email and SMS escalation to anthonytoudou@gmail.com.'
  );
  addBullet('8.1 Structured JSON Logging', 'All server events output standardized JSON payloads with severity levels for Google Cloud Logging.');
  addBullet('8.2.1 High 5xx Error Rate Alert', 'Threshold: > 1.0% of requests returning 5xx status codes over 5m rolling window (Action: Pager / Immediate Email).');
  addBullet('8.2.2 Elevated Latency Alert', 'Threshold: 95th percentile request latency exceeding 1,200ms over 10m (Action: High-priority notification).');
  addBullet('8.2.3 Memory Exhaustion Alert', 'Threshold: Memory utilization exceeding 85% of allocated 1GB (Action: Auto-scale trigger & memory review).');
  addBullet('8.2.4 Firebase Security Rule Rejections', 'Threshold: > 10 permission-denied occurrences within 5 minutes (Action: Security audit alert).');


  // PHASE 8: 40 CHECKLIST CRITERIA
  addPhaseHeading(8, 'Master Pre-Flight Go / No-Go Checklist (40 Criteria)');
  addParagraph(
    'Every single criterion below must be verified and checked off prior to opening production traffic:'
  );

  const checklist = [
    'Zero hardcoded API keys or secrets in Git repository.',
    'GEMINI_API_KEY stored exclusively in Google Cloud Secret Manager.',
    'firestore.rules deployed and verified (user isolation strictly enforced).',
    'Helmet HTTP security headers active (X-Frame-Options, CSP, HSTS).',
    'API rate limiting active on /api/gemini/tts and public routes.',
    'CORS policy restricted to production domain origins.',
    'Client distribution bundle verified clean of private env vars.',
    'Express request payload size limits enforced (1mb max).',
    'Breed selector autocompletes accurately across all 200+ AKC breeds.',
    'Chronological age decimal calculation accurate for puppies and seniors.',
    'Imperial (lbs) and Metric (kg) toggle converts without distortion.',
    'D3 Growth Chart renders sigmoidal curves, P10-P90 bands, and milestones.',
    'D3 Longevity Impact curve accurately reflects Purina Lifespan model.',
    'Weight Sensitivity Slider recalculates lifespan in real time.',
    'Body Condition Scoring (BCS 1-9) renders silhouettes and actions.',
    'Historical Weight Logger successfully records, edits, and deletes logs.',
    'Vet Appointments scheduler creates, edits, and completes visits.',
    'Calendar .ics export generates valid events for Apple & Google Calendar.',
    'All 8 veterinary specialist voice personas audition cleanly.',
    'Pitch resonance controls (-2 Hz, 0 Hz, +2 Hz) modulate frequency.',
    'Live glowing transcript highlights synchronize with spoken audio.',
    'Animated waveform visualizer functions smoothly without stutter.',
    'Audio Master MP3 export generates downloadable, playable audio.',
    'Graceful acoustic chime fallback executes if network drops occur.',
    'Export Full Clinical PDF compiles clean multi-page consultation doc.',
    'UI responsive layouts verified across Mobile (375px) and Desktop (1440px).',
    'Dark and light mode contrast verified (WCAG AA compliant).',
    'Printable clinical care sheets format cleanly without ink waste.',
    'Official User Manual PDF serves and downloads cleanly via web route.',
    'Pet profile modal saves custom names, microchips, and dates reliably.',
    'npm run lint (tsc --noEmit) passes with 0 errors.',
    'npm run build succeeds cleanly with optimal code-splitting.',
    'Cloud Run minimum instances set to 1 (eliminating cold starts).',
    'Cloud Run memory configured to 1Gi and CPU to 1.',
    'Liveness probe /healthz responds with HTTP 200 OK.',
    'Daily automated Firestore backups scheduled with 30-day retention.',
    'SSL/TLS certificates active with A+ rating on Qualys SSL Labs.',
    'Cloud Monitoring alerts active for 5xx errors and latency spikes.',
    'DNS propagation verified globally across major nameservers.',
    'Executive Sign-off: Final release approval granted by Lead Engineer.'
  ];

  checklist.forEach((item, idx) => {
    addChecklistItem(idx + 1, item);
  });

  // PHASE 9
  addPhaseHeading(9, 'Day-1 Operational Runbook & Rapid Rollback Procedures');
  addParagraph(
    'Standard operating procedures for immediate post-launch operations and critical incident response.'
  );
  addCalloutBox(
    'EMERGENCY ONE-COMMAND ROLLBACK PROTOCOL (< 15 SECONDS)',
    'If a Sev-1 defect occurs in production, immediately shift 100% of live traffic back to the prior stable revision:\n\n' +
    'gcloud run services update-traffic doghealthos-prod --to-revisions=doghealthos-prod-00012-xyz=100\n\n' +
    'This instantly redirects user requests to the previous immutable container without rebuilding or restarting the cluster.',
    'alert'
  );

  // Output files
  const docsDir = path.join(process.cwd(), 'docs');
  const publicDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(docsDir)) fs.mkdirSync(docsDir, { recursive: true });
  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

  const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
  
  const docsPath = path.join(docsDir, 'DogHealthOS_Production_Guide_v1.0.pdf');
  const publicPath = path.join(publicDir, 'DogHealthOS_Production_Guide_v1.0.pdf');

  fs.writeFileSync(docsPath, pdfBuffer);
  fs.writeFileSync(publicPath, pdfBuffer);

  console.log(`[SUCCESS] PDF Production Guide generated successfully:`);
  console.log(`- Docs Path: ${docsPath} (${(pdfBuffer.length / 1024).toFixed(1)} KB)`);
  console.log(`- Public Path: ${publicPath}`);
}

generateProductionGuidePDF();
