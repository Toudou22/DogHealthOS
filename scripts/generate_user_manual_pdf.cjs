const fs = require('fs');
const path = require('path');
const { jsPDF } = require('jspdf');

function generateUserManualPDF() {
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

  // Helper functions
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
    doc.text('Canine Health & Longevity OS (v1.0) — Official User Manual & Clinical Guide', margin, 30);
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.5);
    doc.line(margin, 35, pageWidth - margin, 35);

    // Running Footer
    doc.line(margin, pageHeight - 35, pageWidth - margin, pageHeight - 35);
    doc.setFontSize(8);
    doc.setTextColor(138, 134, 128);
    doc.text('Confidential & Proprietary — Canine Health & Longevity OS', margin, pageHeight - 22);
    doc.text(`Page ${pageNum}`, pageWidth - margin, pageHeight - 22, { align: 'right' });
  }

  function addTitlePage() {
    // Top banner badge
    doc.setFillColor(45, 140, 111); // Emerald #2D8C6F
    doc.roundedRect(margin, y, 190, 22, 4, 4, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text('OFFICIAL V1.0 PRODUCTION RELEASE', margin + 12, y + 15);

    y += 45;

    // Main App Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(26);
    doc.setTextColor(26, 26, 26); // #1A1A1A
    doc.text('Canine Health & Longevity OS', margin, y);

    y += 24;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(255, 107, 74); // Coral #FF6B4A
    doc.text('Comprehensive User Manual & Clinical Interpretation Guide', margin, y);

    y += 25;
    doc.setDrawColor(26, 26, 26);
    doc.setLineWidth(2);
    doc.line(margin, y, pageWidth - margin, y);

    y += 30;

    // Executive Summary Box
    doc.setFillColor(248, 246, 242); // Warm stone background
    doc.setDrawColor(220, 215, 205);
    doc.setLineWidth(1);
    doc.roundedRect(margin, y, contentWidth, 120, 6, 6, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(26, 26, 26);
    doc.text('EXECUTIVE INTRODUCTION & CLINICAL MISSION', margin + 16, y + 24);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(70, 70, 70);
    const summaryText = 
      'Canine Health & Longevity OS is a specialized veterinary intelligence system designed to extend ' +
      'the healthy lifespan (healthspan) of domestic canines. By synthesizing peer-reviewed epidemiological ' +
      'datasets—including the landmark Purina 14-Year Lifespan Study, the Banfield 50,000+ dog cohort, and ' +
      'WALTHAM pediatric growth standards—this platform translates complex biometric indicators into actionable, ' +
      'preventative life-stage strategies for pet parents and clinical teams.';
    
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
    doc.text('DOCUMENT SPECIFICATIONS', margin + 12, y + 20);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(50, 50, 50);
    doc.text('• Document Version: 1.0.0 Production', margin + 12, y + 40);
    doc.text('• Release Date: October 2026', margin + 12, y + 58);
    doc.text('• Target Platforms: Web, Mobile, Desktop', margin + 12, y + 76);
    doc.text('• Classification: Official End-User Manual', margin + 12, y + 94);
    doc.text('• Verification: WSAVA / AAHA Guidelines', margin + 12, y + 112);

    // Right Metadata Card
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(230, 230, 230);
    doc.roundedRect(margin + colWidth + 20, y, colWidth, 140, 6, 6, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(255, 107, 74);
    doc.text('CORE CLINICAL CAPABILITIES', margin + colWidth + 32, y + 20);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(50, 50, 50);
    doc.text('• Epigenetic Human Age Non-Linear Scaling', margin + colWidth + 32, y + 40);
    doc.text('• D3 Biometric Growth & Longevity Curves', margin + colWidth + 32, y + 58);
    doc.text('• Preventative Appointment & Vaccine Matrix', margin + colWidth + 32, y + 76);
    doc.text('• Flagship Neural Studio Spoken Passports', margin + colWidth + 32, y + 94);
    doc.text('• Lifetime Veterinary Cost & Hygiene Engine', margin + colWidth + 32, y + 112);

    y += 165;

    // Table of Contents Preview
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(26, 26, 26);
    doc.text('TABLE OF CONTENTS OVERVIEW', margin, y);

    y += 15;
    const tocItems = [
      'Section 1: Executive Overview & Scientific Philosophy',
      'Section 2: Getting Started, Breed Selection & Calibration',
      'Section 3: Understanding Life Expectancy & 5 Biological Life Stages',
      'Section 4: D3 Interactive Growth Trajectory & Longevity Curve Suite',
      'Section 5: Body Condition Scoring (BCS) & Historical Weight Engine',
      'Section 6: Vet Appointments & Clinical Milestones Scheduler',
      'Section 7: AI Care Center & Flagship Neural Spoken Audio Passports',
      'Section 8: Preventive Protocols (Screening, Hygiene, Cost Forecaster)',
      'Section 9: Clinical PDF Consultation Export & Pet Profile Vault',
      'Section 10: Frequently Asked Questions (FAQ) & Clinical Glossary'
    ];

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(70, 70, 70);
    tocItems.forEach((item, index) => {
      doc.text(item, margin + 10, y + (index * 17));
    });

    // Add page break after Title Page
    doc.addPage();
    y = margin + 20;
    addRunningHeaderFooter();
  }

  function addSectionHeading(num, title) {
    checkPageBreak(50);
    y += 10;
    doc.setFillColor(45, 140, 111);
    doc.rect(margin, y, 4, 18, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(26, 26, 26);
    doc.text(`Section ${num}: ${title}`, margin + 12, y + 14);

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
    doc.setFontSize(10.5);
    doc.setTextColor(255, 107, 74);
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
    doc.setFontSize(9);
    doc.setTextColor(30, 30, 30);
    checkPageBreak(28);

    const prefix = `• ${bulletTitle}: `;
    const prefixWidth = doc.getTextWidth(prefix);
    
    doc.text(prefix, margin + 8, y);
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    
    const remainingWidth = contentWidth - 8 - prefixWidth;
    const splitText = doc.splitTextToSize(text, contentWidth - 24);
    
    // If text wraps, print nicely
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

  // BUILD COMPLETE DOCUMENT BODY
  addTitlePage();

  // SECTION 1
  addSectionHeading(1, 'Executive Overview & Scientific Philosophy');
  addParagraph(
    'Canine Health & Longevity OS (v1.0) is built on a fundamental veterinary premise: a dog\'s lifespan ' +
    'is not merely an unalterable genetic timeline. Modern veterinary epidemiology confirms that between 30% ' +
    'and 40% of lifespan variation is driven by modifiable environmental and metabolic factors. By intervening ' +
    'early in body condition management, scheduling age-calibrated clinical diagnostics, and monitoring breed-specific ' +
    'risk factors, pet owners can meaningfully add years of vibrant health to their dog\'s life.'
  );
  addCalloutBox(
    'THE THREE PILLARS OF CANINE LONGEVITY',
    '1. Caloric & Adiposity Control: Maintaining an ideal Body Condition Score (BCS 4.5–5.0) prevents chronic low-grade systemic inflammation and extends lifespan by an average of 1.8 to 2.5 years.\n' +
    '2. Age-Calibrated Diagnostics: Detecting subtle renal, hepatic, or cardiac shifts during asymptomatic life stages preserves vital organ reserve.\n' +
    '3. Targeted Breed Prophylaxis: Proactively managing recognized breed health predispositions (e.g., hip screening, cardiac auscultation, ocular panels) mitigates late-stage disease.',
    'info'
  );

  // SECTION 2
  addSectionHeading(2, 'Getting Started, Breed Selection & Calibration');
  addSubheading('2.1 Intelligent Breed Selection');
  addParagraph(
    'The application features an extensive catalog of over 200 recognized American Kennel Club (AKC) and international ' +
    'breeds. Simply type your dog\'s breed into the search bar. The autocomplete engine searches breed names, aliases, and size ' +
    'categories to instantly load historical lifespans, standard weight envelopes, and genetic profiles.'
  );

  addSubheading('2.2 Chronological Age & Puppy Precision');
  addParagraph(
    'Enter your dog\'s current age using either the direct decimal input or the smooth slider. For puppies under 12 months, ' +
    'decimal inputs (such as 0.3 for ~3.5 months or 0.5 for 6 months) automatically engage specialized pediatric ' +
    'Gompertz growth equations, puppy vaccination schedules, and skeletal milestone indicators.'
  );

  addSubheading('2.3 Imperial & Metric Biometric Toggle');
  addParagraph(
    'Users can switch between Imperial (pounds / lbs) and Metric (kilograms / kg) at any time. The entire application, ' +
    'including D3 charts, historical weight records, and dosage guides, updates dynamically without loss of precision.'
  );

  // SECTION 3
  addSectionHeading(3, 'Understanding Life Expectancy & 5 Biological Life Stages');
  addSubheading('3.1 Epigenetic Non-Linear Human Age Calibration');
  addParagraph(
    'The traditional belief that "one dog year equals seven human years" is a known physiological fallacy. Domestic dogs ' +
    'undergo rapid somatic and hormonal development in their first two years, followed by a steadier aging pace. Furthermore, ' +
    'size class drastically impacts cellular aging rates. Canine Health OS utilizes non-linear epigenetic methylation models ' +
    'calibrated specifically to your breed\'s adult mass class.'
  );

  addSubheading('3.2 The 5 Physiological Life Stages');
  addBullet('Puppyhood (0–12 Months)', 'Rapid skeletal accretion, immune system priming, maternal antibody decline, core immunization series.');
  addBullet('Adolescent / Young Adult (1–3 Years)', 'Hormonal and behavioral stabilization, epiphyseal growth plate fusion, baseline clinical chemistry profiling.');
  addBullet('Mature Adult (3–7 Years)', 'Metabolic equilibrium, peak physical performance, annual wellness exams, preventive dental scaling.');
  addBullet('Senior (7–10 Years)', 'Cellular metabolic deceleration, subclinical organ shifts; bi-annual physical exams, SDMA renal monitoring.');
  addBullet('Geriatric (10+ Years)', 'Advanced organ preservation, mobility management, proactive arthritis pain control, environmental adaptation.');

  // SECTION 4
  addSectionHeading(4, 'D3 Interactive Growth Trajectory & Longevity Suite');
  addParagraph(
    'The hallmark analytical feature of Canine Health OS is its custom D3-based SVG line visualization suite. ' +
    'It provides real-time mathematical modeling across three dedicated analytical modes, backed by an interactive sensitivity slider.'
  );

  addSubheading('4.1 Mode 1: Projected Weight Growth Trajectory (Age vs. Mass)');
  addParagraph(
    'Visualizes the canine developmental curve from birth through maturity. It plots a shaded emerald P10–P90 healthy ' +
    'tolerance corridor, the breed median growth line, and your dog\'s individual developmental projection. Milestone markers ' +
    'highlight key physiological stages: Weaning (2m), 50% Adult Mass Spurt, and Skeletal Plate Fusion.'
  );

  addSubheading('4.2 Mode 2: Weight-to-Longevity Impact Correlation');
  addParagraph(
    'Grounded in the landmark 14-Year Purina Life Span Study (Kealy et al.) and Banfield epidemiological cohorts (Salt et al.), ' +
    'this curve plots adult body weight directly against estimated lifespan in years. It clearly displays the "Peak Longevity Corridor" ' +
    '(BCS 4.5–5.0) and the steep longevity penalty curve for excess adiposity (up to -2.5 years for severe obesity).'
  );

  addSubheading('4.3 Mode 3: Canine Allometric Size Spectrum (Toy to Giant)');
  addParagraph(
    'Demonstrates the unique canine allometric paradox: unlike wild mammals where larger species live longer, giant domestic dogs ' +
    'age faster due to accelerated early-life cellular division and heightened oxidative stress. This mode allows owners to compare ' +
    'Toy, Small, Medium, Large, and Giant cohorts side by side.'
  );

  addSubheading('4.4 Real-Time Interactive Sensitivity Simulator');
  addParagraph(
    'Pet parents can adjust the simulation slider below the chart (-40% to +60% of breed baseline) to instantly observe how ' +
    'weight gains or weight losses impact life expectancy in real time, with an instant one-click reset to actual logged weight.'
  );

  // SECTION 5
  addSectionHeading(5, 'Body Condition Scoring (BCS) & Historical Weight Engine');
  addSubheading('5.1 WSAVA 9-Point Scoring System');
  addParagraph(
    'Visual silhouettes and palpation instructions guide users through evaluating ribs, abdominal tuck, and waistline hourglass contour. ' +
    'Scores 1–3 represent Underweight; 4–5 represent Optimal/Ideal; 6 represents Mild Overweight; and 7–9 indicate Moderate to Severe Obesity.'
  );

  addSubheading('5.2 Historical Multi-Entry Weight Logger');
  addParagraph(
    'Users can record historical weigh-ins with dates and clinician notes. The projection engine computes current growth velocity, ' +
    'alerting the user if the pet\'s trajectory deviates significantly from normal breed percentiles.'
  );

  // SECTION 6
  addSectionHeading(6, 'Vet Appointments & Clinical Milestones Scheduler');
  addParagraph(
    'An enterprise-grade veterinary appointment scheduler calibrated to the dog\'s chronological age and health stage.'
  );
  addBullet('Age-Calibrated Recommendations', 'Pre-populates recommended procedures based on whether the dog is a puppy, adult, or senior.');
  addBullet('Custom Appointment Logging', 'Log consultation dates, times, clinics, attending veterinarians, and pre-visit checklists.');
  addBullet('Calendar Integration (.ics)', 'Download standard calendar events compatible with Apple Calendar, Google Calendar, and Microsoft Outlook.');
  addBullet('Clinical Care Sheet Export', 'Print formatted pre-visit clinical handoff sheets for your veterinary team.');

  // SECTION 7
  addSectionHeading(7, 'AI Care Center & Flagship Neural Spoken Audio Passports');
  addParagraph(
    'The AI Care Center incorporates the Flagship Neural Studio Engine, utilizing Microsoft Azure / Edge HD models to generate ' +
    'natural, articulate, warm veterinary specialist spoken narrations.'
  );

  addSubheading('7.1 Specialist Voice Personas');
  addBullet('Dr. James Barnes, DVM (Fenrir)', 'Chief Veterinary Medical Officer. Deep, authoritative baritone for clinical plans and triage.');
  addBullet('Chef Stella Artois (Kore)', 'Clinical Nutritionist. Energetic, reassuring, articulate guidance on portions and caloric density.');
  addBullet('Nurse Sarah Jenkins, RVT (Zephyr)', 'Lead Technician. Soothing, empathetic guidance for post-op care and gentle handling.');
  addBullet('Coach Marcus Vance (Puck)', 'Conditioning Specialist. High-energy, motivating guidance on canine fitness and joint health.');
  addBullet('Lord Arthur Vance (Charon)', 'Breed Registrar & Historian. Formal Mid-Atlantic cadence covering breed heritage and breed standards.');
  addBullet('Dr. Emma Foster, DVM (Emma)', 'Pediatric Specialist. Warm and cheerful guidance on puppy socialization and vaccinations.');
  addBullet('Dr. Brian Gallagher, DVM (Brian)', 'Geriatric Specialist. Gentle, measured guidance on senior palliative comfort and mobility.');
  addBullet('Dr. Michelle Wu, DVM (Michelle)', 'Integrative Medicine. Modern, poised guidance on holistic wellness and diet.');

  addSubheading('7.2 Acoustic Prosody & Audio Downloads');
  addParagraph(
    'Features pitch resonance adjustments (-2 Hz, 0 Hz, +2 Hz), real-time speech visualizer waveforms, synchronized glowing transcript ' +
    'readouts, and one-click master MP3 export for offline playback.'
  );

  // SECTION 8
  addSectionHeading(8, 'Preventive Protocols: Screening, Hygiene & Cost Forecaster');
  addSubheading('8.1 Genetic Predispositions & Health Screening');
  addParagraph(
    'Details official health certifications (OFA hips/elbows, CERF eye exams, echocardiograms, DNA testing) tailored to the selected breed.'
  );

  addSubheading('8.2 Hygiene & Grooming Cadence Matrix');
  addParagraph(
    'Defines required maintenance cadences for coat brushing, deshedding baths, nail clipping, ear flushes, and daily dental care.'
  );

  addSubheading('8.3 Lifetime Veterinary Cost Estimator');
  addParagraph(
    'Forecasts annual and cumulative lifetime medical expenditures, categorizing routine preventative care vs. potential emergency reserves.'
  );

  // SECTION 9
  addSectionHeading(9, 'Clinical PDF Consultation Export & Pet Profile Vault');
  addParagraph(
    'Clicking "Export Full Clinical PDF" compiles all active parameters—breed statistics, age, human age conversion, BCS evaluation, ' +
    'D3 growth and longevity curves, appointment schedules, and preventive protocols—into a clean, publication-ready multi-page report ' +
    'suitable for sharing with veterinarians and pet insurers. The Pet Profile Vault stores multiple pets with photos, microchip IDs, and birthdates.'
  );

  // SECTION 10
  addSectionHeading(10, 'Frequently Asked Questions (FAQ) & Clinical Glossary');
  addCalloutBox(
    'FAQ: CAN MAINTAINING IDEAL WEIGHT REALLY EXTEND LIFE BY 1.8 - 2.5 YEARS?',
    'Yes. In the 14-year Purina Life Span Study, 48 Labrador Retrievers were monitored across their entire lives. ' +
    'Dogs kept in a lean body condition (BCS 4.5–5.0) lived an average of 1.8 years longer (with the leanest cohort gaining up to 2.5 years) ' +
    'and delayed the clinical onset of osteoarthritis by 2.1 years compared to littermates fed just 25% more calories.',
    'info'
  );

  addCalloutBox(
    'CLINICAL GLOSSARY HIGHLIGHTS',
    '• Allometric Scaling: Mathematical relationship between canine body mass, metabolic rate, and aging rates.\n' +
    '• Epiphyseal Plate: The active cartilage growth zone at the end of long bones in growing puppies.\n' +
    '• SDMA (Symmetric Dimethylarginine): Early biomarker for canine kidney function loss, detecting impairment at 25-40% loss.\n' +
    '• Healthspan: The period of life lived in optimal vitality, free from debilitating chronic degenerative disease.',
    'info'
  );

  // Ensure output directory exists
  const docsDir = path.join(process.cwd(), 'docs');
  const publicDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(docsDir)) fs.mkdirSync(docsDir, { recursive: true });
  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

  const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
  
  const docsPath = path.join(docsDir, 'DogHealthOS_User_Manual_v1.0.pdf');
  const publicPath = path.join(publicDir, 'DogHealthOS_User_Manual_v1.0.pdf');

  fs.writeFileSync(docsPath, pdfBuffer);
  fs.writeFileSync(publicPath, pdfBuffer);

  console.log(`[SUCCESS] PDF User Manual generated successfully:`);
  console.log(`- Docs Path: ${docsPath} (${(pdfBuffer.length / 1024).toFixed(1)} KB)`);
  console.log(`- Public Path: ${publicPath}`);
}

generateUserManualPDF();
