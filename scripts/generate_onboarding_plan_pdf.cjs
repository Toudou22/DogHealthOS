const fs = require('fs');
const path = require('path');
const { jsPDF } = require('jspdf');

function generateOnboardingPlanPDF() {
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
    doc.text('Canine Health & Longevity OS (v1.0) — User Onboarding & Activation Plan', margin, 30);
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.5);
    doc.line(margin, 35, pageWidth - margin, 35);

    // Running Footer
    doc.line(margin, pageHeight - 35, pageWidth - margin, pageHeight - 35);
    doc.setFontSize(8);
    doc.setTextColor(138, 134, 128);
    doc.text('User Activation, Product Experience & Retention Strategy — Confidential', margin, pageHeight - 22);
    doc.text(`Page ${pageNum}`, pageWidth - margin, pageHeight - 22, { align: 'right' });
  }

  function addTitlePage() {
    // Top banner badge
    doc.setFillColor(16, 185, 129); // Emerald Green #10B981
    doc.roundedRect(margin, y, 225, 22, 4, 4, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text('USER ONBOARDING & ACTIVATION PLAN', margin + 12, y + 15);

    y += 45;

    // Main App Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(26);
    doc.setTextColor(26, 26, 26);
    doc.text('Canine Health & Longevity OS', margin, y);

    y += 24;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(255, 107, 74); // Coral #FF6B4A
    doc.text('Professional User Onboarding, Activation & Retention Framework (v1.0)', margin, y);

    y += 25;
    doc.setDrawColor(26, 26, 26);
    doc.setLineWidth(2);
    doc.line(margin, y, pageWidth - margin, y);

    y += 20;

    // Document Metadata Box
    doc.setFillColor(247, 246, 243);
    doc.roundedRect(margin, y, contentWidth, 90, 6, 6, 'F');
    doc.setDrawColor(225, 222, 216);
    doc.setLineWidth(0.75);
    doc.roundedRect(margin, y, contentWidth, 90, 6, 6, 'S');

    const metaLeft = margin + 16;
    const metaMid = margin + contentWidth / 2 + 10;
    let metaY = y + 20;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(26, 26, 26);
    doc.text('Target Release:', metaLeft, metaY);
    doc.setFont('helvetica', 'normal');
    doc.text('v1.0.0 Commercial Launch', metaLeft + 85, metaY);

    doc.setFont('helvetica', 'bold');
    doc.text('Classification:', metaMid, metaY);
    doc.setFont('helvetica', 'normal');
    doc.text('UX & Customer Retention Strategy', metaMid + 85, metaY);

    metaY += 18;
    doc.setFont('helvetica', 'bold');
    doc.text('Primary Metric:', metaLeft, metaY);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(16, 185, 129);
    doc.text('Time-to-Value (TTV) < 60 Seconds', metaLeft + 85, metaY);
    doc.setTextColor(26, 26, 26);

    doc.setFont('helvetica', 'bold');
    doc.text('Retention Target:', metaMid, metaY);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(16, 185, 129);
    doc.text('Day-7 Retention > 40%', metaMid + 85, metaY);
    doc.setTextColor(26, 26, 26);

    metaY += 18;
    doc.setFont('helvetica', 'bold');
    doc.text('Author / Team:', metaLeft, metaY);
    doc.setFont('helvetica', 'normal');
    doc.text('Head of Product Experience & Growth', metaLeft + 85, metaY);

    doc.setFont('helvetica', 'bold');
    doc.text('Effective Date:', metaMid, metaY);
    doc.setFont('helvetica', 'normal');
    doc.text('October 2026', metaMid + 85, metaY);

    y += 115;

    // Executive Summary Section
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(26, 26, 26);
    doc.text('Executive Summary & Onboarding Philosophy', margin, y);

    y += 18;
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(10);
    doc.setTextColor(255, 107, 74);
    doc.text('"Experience the Epigenetic \'Aha!\' Before the Account Wall."', margin, y);

    y += 18;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(70, 70, 70);

    const execSummaryText = 
      "Most digital pet health applications experience catastrophic activation drop-offs (60-80%) " +
      "because they enforce registration, password creation, and paywalls before delivering any tangible clinical value. " +
      "DogHealthOS eliminates this anti-pattern through a Progressive Disclosure Architecture that delivers instant " +
      "epigenetic longevity calculations and specialist neural audio advice within 60 seconds of arrival—completely anonymous, " +
      "zero-friction, and zero-risk. Account creation is presented naturally as an anchoring vault to preserve their pet's " +
      "newly calculated health baseline.";

    const execLines = doc.splitTextToSize(execSummaryText, contentWidth);
    doc.text(execLines, margin, y);
    y += execLines.length * 13 + 20;

    // Table of Contents
    doc.setFillColor(242, 245, 243);
    doc.roundedRect(margin, y, contentWidth, 140, 6, 6, 'F');
    doc.setDrawColor(16, 185, 129);
    doc.setLineWidth(1);
    doc.roundedRect(margin, y, contentWidth, 140, 6, 6, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(16, 185, 129);
    doc.text('TABLE OF CONTENTS', margin + 15, y + 20);

    const toc = [
      '1. User Segmentation & Onboarding Archetypes (Pediatric, Adult, Geriatric, Pack Breeders)',
      '2. The 4-Stage Progressive Onboarding Journey (Calculation -> Audio Hook -> Vault Migration -> Action)',
      '3. In-App Contextual Guidance & Empty State Architecture (Pulsing Halos & Completeness Gauge)',
      '4. Day-0 to Day-30 Automated Retention & Nurture Sequence (Multi-Channel Activation)',
      '5. Friction Elimination & Accessibility Safeguards (Typo-Tolerant Autocomplete & WCAG 2.1 AA)',
      '6. Key Onboarding Performance Indicators (KPIs) & Analytics Scorecard'
    ];

    let tocY = y + 38;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(40, 40, 40);
    toc.forEach(item => {
      doc.text(item, margin + 15, tocY);
      tocY += 17;
    });

    y += 165;
  }

  function addSectionHeader(title, sectionNum) {
    checkPageBreak(50);
    y += 10;
    doc.setFillColor(16, 185, 129);
    doc.rect(margin, y, 4, 18, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(26, 26, 26);
    doc.text(`${sectionNum}. ${title}`, margin + 12, y + 14);

    y += 26;
  }

  function addParagraph(text, isBold = false) {
    checkPageBreak(30);
    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(50, 50, 50);
    const lines = doc.splitTextToSize(text, contentWidth);
    doc.text(lines, margin, y);
    y += lines.length * 13 + 8;
  }

  function addSubHeader(subTitle) {
    checkPageBreak(35);
    y += 4;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(255, 107, 74);
    doc.text(subTitle, margin, y);
    y += 15;
  }

  function addArchetypeCard(title, mindset, trigger, persona) {
    checkPageBreak(65);
    doc.setFillColor(250, 250, 248);
    doc.roundedRect(margin, y, contentWidth, 56, 4, 4, 'F');
    doc.setDrawColor(220, 220, 215);
    doc.setLineWidth(0.5);
    doc.roundedRect(margin, y, contentWidth, 56, 4, 4, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(26, 26, 26);
    doc.text(title, margin + 10, y + 14);

    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(100, 100, 100);
    doc.text('Mindset: ', margin + 10, y + 27);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(40, 40, 40);
    doc.text(mindset, margin + 55, y + 27);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(100, 100, 100);
    doc.text('Immediate Value Trigger: ', margin + 10, y + 39);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(16, 185, 129);
    doc.text(trigger, margin + 125, y + 39);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(100, 100, 100);
    doc.text('Specialist Voice: ', margin + 10, y + 50);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(40, 40, 40);
    doc.text(persona, margin + 85, y + 50);

    y += 66;
  }

  function addTable(headers, rows, colWidths) {
    checkPageBreak(40 + rows.length * 20);

    // Header row
    doc.setFillColor(30, 41, 59); // Slate-800
    doc.rect(margin, y, contentWidth, 20, 'F');

    let x = margin;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(255, 255, 255);

    headers.forEach((h, i) => {
      doc.text(h, x + 6, y + 14);
      x += colWidths[i];
    });

    y += 20;

    // Body rows
    rows.forEach((row, rIdx) => {
      checkPageBreak(25);
      const isEven = rIdx % 2 === 0;
      doc.setFillColor(isEven ? 255 : 248, isEven ? 255 : 250, isEven ? 255 : 252);
      doc.rect(margin, y, contentWidth, 20, 'F');
      doc.setDrawColor(230, 230, 230);
      doc.setLineWidth(0.5);
      doc.line(margin, y + 20, margin + contentWidth, y + 20);

      x = margin;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(40, 40, 40);

      row.forEach((cell, cIdx) => {
        if (cIdx === 0) doc.setFont('helvetica', 'bold');
        else doc.setFont('helvetica', 'normal');

        const cellStr = String(cell);
        const cellLines = doc.splitTextToSize(cellStr, colWidths[cIdx] - 10);
        doc.text(cellLines[0] || '', x + 6, y + 14);
        x += colWidths[cIdx];
      });

      y += 20;
    });

    y += 12;
  }

  // --- Document Construction ---

  // 1. Title Page
  addTitlePage();

  // Page break to start detailed sections
  doc.addPage();
  y = margin + 20;
  addRunningHeaderFooter();

  // 2. Section 1: User Segmentation & Onboarding Archetypes
  addSectionHeader('User Segmentation & Onboarding Archetypes', '1');
  addParagraph(
    'Canine Health OS rejects generic onboarding. Instead, the interface immediately tunes its clinical highlights ' +
    'and tone based on four distinct owner mindsets determined by the dog\'s initial age and profile characteristics:'
  );

  addArchetypeCard(
    '1.1 The New Puppy Parent (Pediatric Stage: Age 0–12 Months)',
    'Protective, eager, seeking clarity on growth spurts, vaccines, and early socialization.',
    'Pediatric Gompertz growth curve with shaded percentiles; immediate vaccine schedules.',
    'Dr. Emma Foster, DVM (Pediatrics) or Nurse Sarah Jenkins, RVT'
  );

  addArchetypeCard(
    '1.2 The Active Adult Dog Guardian (Maintenance Stage: Age 1–7 Years)',
    'Stable daily routine, focused on preventive longevity, lean body mass, and dental care.',
    'Epigenetic Human Age reveal and interactive Longevity Sensitivity simulation (+2.5 yrs).',
    'Dr. James Barnes, DVM (Chief Medical Officer) or Coach Marcus Vance'
  );

  addArchetypeCard(
    '1.3 The Senior/Geriatric Dog Companion (Palliative & Mobility Stage: Age 7+ Years)',
    'Deeply bonded, vigilant about arthritis stiffness, early cognitive changes, and comfort.',
    'Bi-annual geriatric diagnostic timetable (SDMA, blood pressure, thoracic imaging).',
    'Dr. Brian Gallagher, DVM (Geriatric & Palliative Care Specialist)'
  );

  addArchetypeCard(
    '1.4 The Multi-Dog Owner & Ethical Breeder (Pack Management)',
    'High canine literacy, manages multi-pet litters, requires rapid record retrieval and printing.',
    'Instant pet switching in Pet Medical Vault, WALTHAM curve comparisons, and 1-click reports.',
    'Dr. James Barnes, DVM (Clinical Operations Lead)'
  );

  // 3. Section 2: The 4-Stage Progressive Onboarding Journey
  addSectionHeader('The 4-Stage Progressive Onboarding Journey', '2');
  addParagraph(
    'The user onboarding flow is structured into four seamless stages designed to build compounding trust ' +
    'before requesting any commitment or account creation:'
  );

  // Flow Visualizer Box
  checkPageBreak(50);
  doc.setFillColor(245, 247, 250);
  doc.roundedRect(margin, y, contentWidth, 38, 4, 4, 'F');
  doc.setDrawColor(200, 215, 230);
  doc.setLineWidth(0.5);
  doc.roundedRect(margin, y, contentWidth, 38, 4, 4, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(30, 41, 59);
  doc.text('STAGE 1: 0-60s', margin + 15, y + 15);
  doc.text('STAGE 2: 1-3m', margin + 140, y + 15);
  doc.text('STAGE 3: 3-5m', margin + 265, y + 15);
  doc.text('STAGE 4: Day 1+', margin + 395, y + 15);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(70, 70, 70);
  doc.text('Instant Epigenetic Calc', margin + 15, y + 27);
  doc.text('Neural Voice Audition', margin + 140, y + 27);
  doc.text('1-Click Vault Save', margin + 265, y + 27);
  doc.text('Vet Appointment Sync', margin + 395, y + 27);

  y += 50;

  addSubHeader('Stage 1: Zero-Friction Calculation & Instant "Aha!" (0–60 Seconds)');
  addParagraph(
    '• The Entry Viewport: Visitors land on a distraction-free hero interface. There are no registration popups, ' +
    'no newsletter prompts, and no paywalls. The 3-parameter input card (Breed, Age, Weight) is front-and-center.\n' +
    '• Typo-Tolerant Autocomplete: Real-time search across 200+ AKC breeds resolves typos gracefully.\n' +
    '• Instant Reveal: Within milliseconds of input, the Epigenetic Human Age, median life span envelope, and ' +
    'Gompertz percentile growth curve render smoothly with zero delay.'
  );

  addSubHeader('Stage 2: Interactive Exploration & The Neural Audio Hook (1–3 Minutes)');
  addParagraph(
    '• Palpation & BCS Assessment: Interactive 1-9 Body Condition silhouette selector updates caloric guidance live.\n' +
    '• Sensitivity Simulator: An animated pulse invites the user to drag the longevity slider, revealing live how ' +
    'weight management extends lifespan by up to 2.5 years (Purina 14-Year Lifespan Study).\n' +
    '• Flagship Neural Voice Audition: Clicking "Audio Passport" synthesizes a 60-second broadcast-grade clinical overview ' +
    'tailored to the pet\'s breed and age, complete with waveform animation and glowing synchronized captions.'
  );

  addSubHeader('Stage 3: Profile Anchoring & Cloud Vault Migration (3–5 Minutes)');
  addParagraph(
    '• High-Value Vault Anchor: Rather than generic "Sign Up", the system prompts: "Save [Pet Name]\'s Health Passport ' +
    'and growth velocity curve to your private cloud vault."\n' +
    '• Zero-Data-Loss Migration: Single-click Google or email login immediately syncs the user\'s local state into ' +
    'cloud-secured Firestore collections without refreshing or clearing any entered data.'
  );

  addSubHeader('Stage 4: First Clinical Preventive Action (Day 1)');
  addParagraph(
    '• Quick-Log Milestones: The app proposes age-specific veterinary screenings (e.g., puppy core boosters, ' +
    'adult dental scaling, geriatric SDMA blood panel) with a single-click "Schedule" button.\n' +
    '• Calendar Integration: Instant export of standard .ics calendar appointments for Apple Calendar and Google Calendar.\n' +
    '• Clinical PDF Export: One-click generation of the multi-page Clinical Consultation Dossier to hand to the vet.'
  );

  // 4. Section 3: In-App Contextual Guidance & Empty State Architecture
  addSectionHeader('In-App Contextual Guidance & Empty State Architecture', '3');
  addParagraph(
    'To guarantee effortless discovery without cognitive overload, DogHealthOS deploys targeted visual guidance patterns:'
  );

  addSubHeader('3.1 Pulsing Interactive Guidance Tooltips');
  addParagraph(
    'Discrete emerald pulse halos appear over high-leverage interactive controls during first-time sessions:\n' +
    '• Pulse 1 (Sensitivity Slider): "Scrub here to simulate how weight optimization extends life expectancy."\n' +
    '• Pulse 2 (Audio Passport): "Listen to your pet\'s personalized care plan voiced by specialist clinicians."\n' +
    '• Pulse 3 (PDF Export): "Download a comprehensive multi-page clinical report for your vet."\n' +
    'Halos automatically dismiss permanently once clicked, preserving a clean workspace.'
  );

  addSubHeader('3.2 Action-Oriented Empty States');
  addParagraph(
    'Empty states never present dead ends. Instead, each module features clear educational copy and high-contrast call-to-actions:\n' +
    '• Appointments Module: Displays a friendly veterinary calendar illustration, educational advice on preventive checkups, ' +
    'and an unmistakable [+ Schedule First Milestone] primary button.\n' +
    '• Weight History Module: Explains the clinical significance of early metabolic tracking and offers [+ Record Weigh-In].'
  );

  addSubHeader('3.3 The Health Passport Completeness Gauge');
  addParagraph(
    'A progress bar located in the pet header provides visual reinforcement: 50% upon Breed/Age input; 75% upon BCS & ' +
    'Weight logging; 100% (Fully Protected) once microchip ID is stored, an appointment is scheduled, and a PDF passport is generated.'
  );

  // 5. Section 4: Day-0 to Day-30 Automated Retention & Nurture Sequence
  addSectionHeader('Day-0 to Day-30 Automated Retention & Nurture Sequence', '4');
  addParagraph(
    'To transition initial curiosity into daily and weekly health guardianship, DogHealthOS implements an automated ' +
    'retention schedule triggered by pet milestones:'
  );

  const retentionHeaders = ['Timeline', 'Channel', 'Subject / Notification', 'Core Value & Action Call'];
  const retentionWidths = [70, 75, 170, 207];
  const retentionRows = [
    ['Day 0 (Instant)', 'Email + Toast', 'Welcome to DogHealthOS: [Pet]\'s Baseline', 'Direct link to Health Passport & User Manual PDF'],
    ['Day 3 (+72 hrs)', 'Contextual Email', 'Genetic Health Insights for [Breed]', 'Highlighting breed-specific OFA/cardiac tests'],
    ['Day 7 (Week 1)', 'Push / Email', 'Time for [Pet]\'s First Weekly Weigh-In', 'Calibration of growth trajectory against breed median'],
    ['Day 14 (Week 2)', 'Seasonal Advisory', 'Seasonal Wellness Update for [Current Season]', 'Real-time tips: hydration, paw care, or parasite risks'],
    ['Day 21 (Week 3)', 'Specialist Spotlight', 'Meet Chef Stella: Nutrition & Caloric Intake', 'Auditioning dietary guidance via Flagship Voice'],
    ['Day 30 (Month 1)', 'Monthly Summary', '[Pet]\'s 30-Day Longevity Progress Report', 'Comprehensive review of weight, human age & milestones']
  ];
  addTable(retentionHeaders, retentionRows, retentionWidths);

  // 6. Section 5: Friction Elimination & Accessibility Safeguards
  addSectionHeader('Friction Elimination & Accessibility Safeguards', '5');
  addParagraph(
    '1. Intelligent Typo-Tolerant Autocomplete: Real-time fuzzy matching accommodates common phonetic misspellings ' +
    '(e.g., typing "shepard" resolves to German Shepherd; "frenchie" resolves to French Bulldog).\n' +
    '2. Natural Language Decimal Conversion: Puppy owners can type "4m" or "16w" into the age field; the system ' +
    'automatically calculates decimal year equivalents (0.33y or 0.30y) without throwing validation errors.\n' +
    '3. Dual Unit Support: Instant 1-click toggle between Imperial (lbs) and Metric (kg) conversions with dynamic axis re-scaling.\n' +
    '4. Full Accessibility (WCAG 2.1 AA): High contrast ratios (>4.5:1), explicit aria-label attributes for all audio and ' +
    'interactive controls, and full keyboard navigation (Tab/Enter/Esc).'
  );

  // 7. Section 6: Key Onboarding Performance Indicators (KPIs) & Analytics
  addSectionHeader('Key Onboarding Performance Indicators (KPIs) & Analytics', '6');
  addParagraph(
    'Product and growth engineering track the following core activation benchmarks via front-end telemetry events:'
  );

  const kpiHeaders = ['Metric Name', 'Definition', 'Target Benchmark', 'Tracking Instrument'];
  const kpiWidths = [120, 160, 95, 147];
  const kpiRows = [
    ['Time-to-First-Calculation (TTFC)', 'Landing to Epigenetic Age render', '< 45 Seconds', 'Performance telemetry event'],
    ['First-Session Activation Rate', '% of visitors entering Breed, Age, Weight', '> 72%', 'Funnel: session_start -> calc_ready'],
    ['Audio Passport Engagement', '% of activated users playing specialist voice', '> 48%', 'Event: audio_audition_started'],
    ['Anonymous-to-Vault Conversion', '% saving pet to cloud database vault', '> 28%', 'Event: auth_signup_completed'],
    ['Day-7 Re-Engagement Rate', '% returning within 7 days of signup', '> 42%', 'Weekly cohort retention analysis'],
    ['First Appointment Schedule Rate', '% creating an upcoming vet appointment', '> 35%', 'Event: vet_appointment_created']
  ];
  addTable(kpiHeaders, kpiRows, kpiWidths);

  // Sign-off box
  checkPageBreak(50);
  y += 10;
  doc.setFillColor(247, 246, 243);
  doc.roundedRect(margin, y, contentWidth, 35, 4, 4, 'F');
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 100, 100);
  doc.text(
    'Approved by Head of Product Experience & User Activation Engineering for Canine Health & Longevity OS (v1.0).',
    margin + 15,
    y + 22
  );

  // Save to file paths
  const docsDir = path.join(process.cwd(), 'docs');
  const publicDir = path.join(process.cwd(), 'public');

  if (!fs.existsSync(docsDir)) fs.mkdirSync(docsDir, { recursive: true });
  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

  const docsPdfPath = path.join(docsDir, 'DogHealthOS_Onboarding_Plan_v1.0.pdf');
  const publicPdfPath = path.join(publicDir, 'DogHealthOS_Onboarding_Plan_v1.0.pdf');

  const pdfOutput = doc.output('arraybuffer');
  fs.writeFileSync(docsPdfPath, Buffer.from(pdfOutput));
  fs.writeFileSync(publicPdfPath, Buffer.from(pdfOutput));

  console.log(`Successfully generated Onboarding Plan PDFs:`);
  console.log(`- ${docsPdfPath} (${fs.statSync(docsPdfPath).size} bytes)`);
  console.log(`- ${publicPdfPath} (${fs.statSync(publicPdfPath).size} bytes)`);
}

generateOnboardingPlanPDF();
