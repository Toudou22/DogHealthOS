const fs = require('fs');
const path = require('path');
const { jsPDF } = require('jspdf');

function generateInsurancePitchPDF() {
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
    if (pageNum === 1) return;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(138, 134, 128);
    doc.text('Canine Health OS (v1.0) — Pet Insurance Partnership & Technical Integration Blueprint', margin, 30);
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.5);
    doc.line(margin, 35, pageWidth - margin, 35);

    doc.line(margin, pageHeight - 35, pageWidth - margin, pageHeight - 35);
    doc.setFontSize(8);
    doc.setTextColor(138, 134, 128);
    doc.text('Commercial Partnership Proposal — Confidential & Proprietary', margin, pageHeight - 22);
    doc.text(`Page ${pageNum}`, pageWidth - margin, pageHeight - 22, { align: 'right' });
  }

  function addTitlePage() {
    doc.setFillColor(16, 185, 129); // Emerald
    doc.roundedRect(margin, y, 240, 22, 4, 4, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text('PET INSURANCE PARTNERSHIP PROPOSAL', margin + 12, y + 15);

    y += 45;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(24);
    doc.setTextColor(26, 26, 26);
    doc.text('Canine Health & Longevity OS', margin, y);

    y += 24;
    doc.setFontSize(13);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(255, 107, 74);
    doc.text('High-Intent Lead Generation & Frictionless Insurance Integration Blueprint', margin, y);

    y += 25;
    doc.setDrawColor(26, 26, 26);
    doc.setLineWidth(2);
    doc.line(margin, y, pageWidth - margin, y);

    y += 20;

    // Metadata Box
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
    doc.text('Target Partners:', metaLeft, metaY);
    doc.setFont('helvetica', 'normal');
    doc.text('VP of Business Development / Growth', metaLeft + 90, metaY);

    doc.setFont('helvetica', 'bold');
    doc.text('Core Value Prop:', metaMid, metaY);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(16, 185, 129);
    doc.text('Zero-Ad-Waste High-Intent Leads', metaMid + 85, metaY);
    doc.setTextColor(26, 26, 26);

    metaY += 18;
    doc.setFont('helvetica', 'bold');
    doc.text('Quote Tech:', metaLeft, metaY);
    doc.setFont('helvetica', 'normal');
    doc.text('1-Click Pre-Filled API Payload', metaLeft + 90, metaY);

    doc.setFont('helvetica', 'bold');
    doc.text('Conversion Advantage:', metaMid, metaY);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(16, 185, 129);
    doc.text('3x–5x Higher Completion Rate', metaMid + 115, metaY);
    doc.setTextColor(26, 26, 26);

    metaY += 18;
    doc.setFont('helvetica', 'bold');
    doc.text('Author / Team:', metaLeft, metaY);
    doc.setFont('helvetica', 'normal');
    doc.text('Executive Growth & Partnerships', metaLeft + 90, metaY);

    doc.setFont('helvetica', 'bold');
    doc.text('Publication Date:', metaMid, metaY);
    doc.setFont('helvetica', 'normal');
    doc.text('October 2026', metaMid + 85, metaY);

    y += 115;

    // Executive Summary
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(26, 26, 26);
    doc.text('Executive Summary: The "No-Brainer" Acquisition Channel', margin, y);

    y += 18;
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(10);
    doc.setTextColor(255, 107, 74);
    doc.text('"Position your policy quotes at the exact second a pet parent plans their dog\'s longevity."', margin, y);

    y += 18;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(70, 70, 70);

    const execSummaryText = 
      "Every year, pet insurance providers spend millions on cold digital advertising (Google Search, Social Ads) " +
      "plagued by skyrocketing CAC and high quote form abandonment. DogHealthOS provides your brand with a direct, " +
      "high-intent channel: embedding your policy estimate cards directly inside our Pet Medical Vault, Life Stage " +
      "Assessment Engine, and exported Clinical PDF Dossiers. We connect your brand with highly engaged pet parents " +
      "who are actively seeking preventive financial protection for their companion.";

    const execLines = doc.splitTextToSize(execSummaryText, contentWidth);
    doc.text(execLines, margin, y);
    y += execLines.length * 13 + 20;

    // Table of Contents
    doc.setFillColor(242, 245, 243);
    doc.roundedRect(margin, y, contentWidth, 130, 6, 6, 'F');
    doc.setDrawColor(16, 185, 129);
    doc.setLineWidth(1);
    doc.roundedRect(margin, y, contentWidth, 130, 6, 6, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(16, 185, 129);
    doc.text('TABLE OF CONTENTS', margin + 15, y + 20);

    const toc = [
      '1. Contextual In-App Placements & Trigger Mechanics (Vault, Breed Risks, Scheduler, PDFs)',
      '2. Frictionless 1-Click Quote Engineering (Pre-Filled Payload API Integration)',
      '3. Projected Unit Economics & Conversion Benchmarks (CTR, Completion, LTV)',
      '4. Ethical Data Privacy, FTC Compliance & Non-Invasive Trust Standards',
      '5. Turnkey 5-Day Onboarding & Technical Rollout Roadmap'
    ];

    let tocY = y + 38;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(40, 40, 40);
    toc.forEach(item => {
      doc.text(item, margin + 15, tocY);
      tocY += 17;
    });

    y += 155;
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

  function addTable(headers, rows, colWidths) {
    checkPageBreak(40 + rows.length * 22);

    doc.setFillColor(30, 41, 59);
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

    rows.forEach((row, rIdx) => {
      checkPageBreak(25);
      const isEven = rIdx % 2 === 0;
      doc.setFillColor(isEven ? 255 : 248, isEven ? 255 : 250, isEven ? 255 : 252);
      doc.rect(margin, y, contentWidth, 22, 'F');
      doc.setDrawColor(230, 230, 230);
      doc.setLineWidth(0.5);
      doc.line(margin, y + 22, margin + contentWidth, y + 22);

      x = margin;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(40, 40, 40);

      row.forEach((cell, cIdx) => {
        if (cIdx === 0) doc.setFont('helvetica', 'bold');
        else doc.setFont('helvetica', 'normal');

        const cellStr = String(cell);
        const cellLines = doc.splitTextToSize(cellStr, colWidths[cIdx] - 10);
        doc.text(cellLines[0] || '', x + 6, y + 15);
        x += colWidths[cIdx];
      });

      y += 22;
    });

    y += 12;
  }

  // --- Document Construction ---
  addTitlePage();

  doc.addPage();
  y = margin + 20;
  addRunningHeaderFooter();

  addSectionHeader('Contextual In-App Placements & Trigger Mechanics', '1');
  addParagraph(
    'Your insurance products are integrated natively into our clinical workflows as essential preventive protection:'
  );

  addSubHeader('A. Breed-Specific Genetic Vulnerability Cards');
  addParagraph(
    '• Trigger: Activated when users select breeds with recognized hereditary risks (e.g., Hip Dysplasia in German Shepherds, ' +
    'BOAS in French Bulldogs, or IVDD in Dachshunds).\n' +
    '• Copy & UI: "Protect [Pet Name] Against [Breed]\'s Top Hereditary Health Risks. Coverage starting at $28/mo."'
  );

  addSubHeader('B. Pet Medical Vault & Longevity Header Integration');
  addParagraph(
    '• Trigger: Displayed prominently inside the Pet Medical Vault where users store microchip IDs and vaccination records.\n' +
    '• Copy & UI: "Complete [Pet Name]\'s Health Protection Shield" card featuring your brand logo, rating badge, and instant quote button.'
  );

  addSubHeader('C. Preventive Milestone & Veterinary Scheduler Integration');
  addParagraph(
    '• Trigger: Displayed when pet parents schedule upcoming wellness checkups, vaccine boosters, or geriatric diagnostic panels.\n' +
    '• Copy & UI: "Ensure 100% of [Pet Name]\'s upcoming veterinary diagnostics are covered."'
  );

  addSubHeader('D. Exported Clinical PDF Dossier Inclusions');
  addParagraph(
    '• Component: A dedicated "Protection & Policy Summary" page attached to the multi-page Clinical Summary PDF printed ' +
    'or emailed for veterinary visits, complete with a trackable QR Code for fast mobile scanning.'
  );

  addSectionHeader('Frictionless 1-Click Quote Engineering (Zero Form Fatigue)', '2');
  addParagraph(
    'Quote abandonment is the #1 drop-off factor in digital insurance sales. DogHealthOS eliminates form fatigue via ' +
    'pre-filled URL payload handoffs:'
  );

  // Payload Box
  checkPageBreak(45);
  doc.setFillColor(245, 247, 250);
  doc.roundedRect(margin, y, contentWidth, 32, 4, 4, 'F');
  doc.setDrawColor(200, 215, 230);
  doc.setLineWidth(0.5);
  doc.roundedRect(margin, y, contentWidth, 32, 4, 4, 'S');

  doc.setFont('courier', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(30, 41, 59);
  doc.text('https://partner.insurance.com/quote?ref=doghealthos&breed=German+Shepherd&age=2.5&weight=68&zip=90210', margin + 10, y + 19);

  y += 42;

  addParagraph(
    '1. Client Payload Transmission: Our application passes Breed, Age, Weight, Body Condition Score, and ZIP Code directly to your funnel.\n' +
    '2. 100% Pre-Filled Landing Page: Users arrive with zero form fields remaining to type.\n' +
    '3. High Conversion Velocity: Quote completion time decreases from 3 minutes to under 15 seconds, boosting conversions by 3x–5x.'
  );

  addSectionHeader('Projected Unit Economics & Conversion Benchmarks', '3');

  const headers = ['Metric / KPI', 'Industry Baseline (Cold Ads)', 'DogHealthOS Integrated Channel', 'Commercial Advantage'];
  const widths = [110, 130, 150, 132];
  const rows = [
    ['User Mindset', 'Passive / Scrolling Social Media', 'Active Longevity & Health Planning', 'High Receptivity & Intent'],
    ['Click-Through Rate (CTR)', '0.8% – 1.2%', '8.5% – 12.0%', '10x Higher Engagement'],
    ['Quote Completion Rate', '8% – 12%', '28% – 38%', '3x Higher Completion'],
    ['Policyholder Retention LTV', 'Average 24 Months', '36+ Months', 'Health-Conscious Owners Retain'],
    ['Acquisition Cost (CAC)', '$120 – $180 per policy', '35% – 50% Lower CAC', 'Rev-Share / CPA Basis']
  ];
  addTable(headers, rows, widths);

  addSectionHeader('Ethical Data Privacy & FTC Compliance', '4');
  addParagraph(
    '• Zero Personal Data Sales: User names, email addresses, and microchips remain strictly private and encrypted.\n' +
    '• Explicit User Consent: Quote payloads transmit only when users explicitly tap the "Get Quote" button.\n' +
    '• FTC Transparency: Clean disclosures ("DogHealthOS Verified Insurance Partner") maintain total user trust.'
  );

  addSectionHeader('Turnkey 5-Day Technical Rollout Schedule', '5');
  addParagraph(
    '1. Agreement & Parameter Setup (Day 1–2): Establish tracking parameters, referral tags, and rev-share terms.\n' +
    '2. UI Asset Ingestion (Day 3): Upload partner logo, custom value props, and estimate cards into our dynamic configuration.\n' +
    '3. Deep-Link Payload Testing (Day 4): Test 1-click quote payload handoffs across 200+ dog breeds.\n' +
    '4. Live Campaign Launch (Day 5): Your partner campaign goes live to health-focused pet parents.'
  );

  // Sign-off
  checkPageBreak(50);
  y += 10;
  doc.setFillColor(247, 246, 243);
  doc.roundedRect(margin, y, contentWidth, 35, 4, 4, 'F');
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 100, 100);
  doc.text(
    'Prepared & Approved by Executive Growth Team — Canine Health & Longevity OS (v1.0).',
    margin + 15,
    y + 22
  );

  const docsDir = path.join(process.cwd(), 'docs');
  const publicDir = path.join(process.cwd(), 'public');

  if (!fs.existsSync(docsDir)) fs.mkdirSync(docsDir, { recursive: true });
  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

  const docsPdfPath = path.join(docsDir, 'DogHealthOS_Insurance_Partnership_Pitch_v1.0.pdf');
  const publicPdfPath = path.join(publicDir, 'DogHealthOS_Insurance_Partnership_Pitch_v1.0.pdf');

  const pdfOutput = doc.output('arraybuffer');
  fs.writeFileSync(docsPdfPath, Buffer.from(pdfOutput));
  fs.writeFileSync(publicPdfPath, Buffer.from(pdfOutput));

  console.log(`Successfully generated Insurance Pitch PDFs:`);
  console.log(`- ${docsPdfPath} (${fs.statSync(docsPdfPath).size} bytes)`);
  console.log(`- ${publicPdfPath} (${fs.statSync(publicPdfPath).size} bytes)`);
}

generateInsurancePitchPDF();
