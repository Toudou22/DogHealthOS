const fs = require('fs');
const path = require('path');
const { jsPDF } = require('jspdf');

function generateNutritionPitchPDF() {
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
    doc.text('Canine Health OS (v1.0) — Premium Nutrition Partnership & Caloric Matching Blueprint', margin, 30);
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
    doc.roundedRect(margin, y, 250, 22, 4, 4, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text('PREMIUM NUTRITION PARTNERSHIP PROPOSAL', margin + 12, y + 15);

    y += 45;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(24);
    doc.setTextColor(26, 26, 26);
    doc.text('Canine Health & Longevity OS', margin, y);

    y += 24;
    doc.setFontSize(13);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(255, 107, 74);
    doc.text('Caloric & BCS-Matched Lead Generation & Nutrition Integration Blueprint', margin, y);

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
    doc.text('VP of Growth / DTC Pet Food Leaders', metaLeft + 90, metaY);

    doc.setFont('helvetica', 'bold');
    doc.text('Core Advantage:', metaMid, metaY);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(16, 185, 129);
    doc.text('Caloric & BCS-Matched Targeting', metaMid + 85, metaY);
    doc.setTextColor(26, 26, 26);

    metaY += 18;
    doc.setFont('helvetica', 'bold');
    doc.text('AI Audio Engine:', metaLeft, metaY);
    doc.setFont('helvetica', 'normal');
    doc.text('Chef Stella Voice Consultation Integration', metaLeft + 90, metaY);

    doc.setFont('helvetica', 'bold');
    doc.text('Conversion Rate:', metaMid, metaY);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(16, 185, 129);
    doc.text('35%–48% Trial-to-Subscriber', metaMid + 85, metaY);
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
    doc.text('Executive Summary: The Ultimate Nutrition Matchmaking Engine', margin, y);

    y += 18;
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(10);
    doc.setTextColor(255, 107, 74);
    doc.text('"Recommend your specific formulas when pet parents evaluate Body Condition Score & Caloric Intake."', margin, y);

    y += 18;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(70, 70, 70);

    const execSummaryText = 
      "Finding health-conscious pet parents willing to invest in premium fresh food or prescription diets is increasingly " +
      "competitive. DogHealthOS provides premium nutrition brands with an unprecedented advantage: acting as an intelligent " +
      "clinical matchmaker that recommends your specific formulas based on the pet's exact weight, ideal target weight, " +
      "Body Condition Score (BCS 1–9), life stage, and daily caloric requirement (kcal/day).";

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
      '1. Contextual In-App Placements & Trigger Mechanics (BCS, Chef Stella Voice, Marketplace, PDFs)',
      '2. Caloric & Portion Matching Engineering (NRC RER & MER Portion Calculation Engine)',
      '3. Projected Unit Economics & Conversion Benchmarks (CTR, Subscriber Conversion, Retention)',
      '4. Ethical Data Privacy, FTC Compliance & Non-Invasive Trust Standards',
      '5. Turnkey 5-Day Technical Rollout Schedule'
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
    'Your nutrition products are integrated into our core health modules as scientifically backed feeding solutions:'
  );

  addSubHeader('A. Body Condition Score (BCS 1–9) & Weight Calibration Trigger');
  addParagraph(
    '• Trigger: Activated when a user assesses their dog\'s BCS (e.g., BCS 6+ Overweight or BCS 3 Underweight) or logs weight drift.\n' +
    '• Copy & UI: "Recommended Weight Management Formula for [Pet Name] (Target: 420 kcal/day)" with subscriber discount badge.'
  );

  addSubHeader('B. "Chef Stella" Neural Nutrition Specialist Voice Consultation');
  addParagraph(
    '• Trigger: Displayed inside the active speech visualizer during Chef Stella (Veterinary Nutrition Specialist) consultations.\n' +
    '• Voice & UI Integration: Chef Stella recommends your formula by name and caloric target, accompanied by "Claim Exclusive 20% Discount".'
  );

  addSubHeader('C. Dedicated "Partner Perks & Health Marketplace" Hub');
  addParagraph(
    '• Location: Embedded in the Pet Medical Vault under "Partner Care & Member Perks", displaying key USPs and subscriber codes.'
  );

  addSubHeader('D. Exported Clinical PDF Dossier Inclusions');
  addParagraph(
    '• Component: A dedicated "Dietary Baseline & Nutritional Recommendations" page on exported veterinary PDFs with trackable QR codes.'
  );

  addSectionHeader('Caloric & Portion Matching Engineering', '2');
  addParagraph(
    'DogHealthOS calculates exact daily cup/gram meal portioning using NRC (National Research Council) Resting Energy Requirement equations:'
  );

  // Formula Box
  checkPageBreak(45);
  doc.setFillColor(245, 247, 250);
  doc.roundedRect(margin, y, contentWidth, 32, 4, 4, 'F');
  doc.setDrawColor(200, 215, 230);
  doc.setLineWidth(0.5);
  doc.roundedRect(margin, y, contentWidth, 32, 4, 4, 'S');

  doc.setFont('courier', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  doc.text('RER = 70 * (Weight in kg)^0.75   |   MER = RER * Life_Stage_Factor', margin + 15, y + 19);

  y += 42;

  addParagraph(
    'Pet owners see exact daily portion guidance: "Feed [Pet Name] exactly 1.5 cups / 1.2 fresh packs per day of [Your Brand Formula]." ' +
    'This removes portion guesswork and drives immediate subscription confidence.'
  );

  addSectionHeader('Projected Unit Economics & Conversion Benchmarks', '3');

  const headers = ['Metric / KPI', 'Standard E-Commerce Ads', 'DogHealthOS Integrated Channel', 'Commercial Advantage'];
  const widths = [110, 130, 150, 132];
  const rows = [
    ['Targeting Precision', 'Broad Demographic Interests', 'Exact Weight, BCS & Caloric Need', '100% Caloric Precision'],
    ['Click-Through Rate (CTR)', '1.1% – 1.8%', '9.2% – 14.5%', '8x Higher Click Intent'],
    ['Trial-to-Subscriber Conv.', '12% – 18%', '35% – 48%', 'Calorically Portioned Trust'],
    ['Monthly Subscriber Retention', '45% at Month 6', '68% at Month 6', 'Integrated Weight Tracking'],
    ['Acquisition Cost (CAC)', '$85 – $140 per subscriber', '40% – 60% CAC Reduction', 'Rev-Share / CPA Basis']
  ];
  addTable(headers, rows, widths);

  addSectionHeader('Ethical Data Privacy & FTC Compliance', '4');
  addParagraph(
    '• Zero Personal Data Sales: User weight records and profiles remain strictly encrypted and private.\n' +
    '• User-Driven Coupon Claims: Promo codes and links activate only upon direct user tap.\n' +
    '• FTC Transparency: Clean partner badges ("DogHealthOS Verified Nutrition Partner") ensure complete transparency.'
  );

  addSectionHeader('Turnkey 5-Day Technical Rollout Schedule', '5');
  addParagraph(
    '1. Product SKU & Nutritional Data Ingestion (Day 1–2): We ingest your formula caloric densities and subscription discount links.\n' +
    '2. UI & Audio Script Integration (Day 3): Configure Chef Stella\'s voice triggers and visual recommendation cards.\n' +
    '3. Caloric Matching QA (Day 4): Test automated portion calculations across pediatric, adult, and senior weight profiles.\n' +
    '4. Live Campaign Launch (Day 5): Your brand is activated live to high-intent pet parents.'
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

  const docsPdfPath = path.join(docsDir, 'DogHealthOS_Nutrition_Partnership_Pitch_v1.0.pdf');
  const publicPdfPath = path.join(publicDir, 'DogHealthOS_Nutrition_Partnership_Pitch_v1.0.pdf');

  const pdfOutput = doc.output('arraybuffer');
  fs.writeFileSync(docsPdfPath, Buffer.from(pdfOutput));
  fs.writeFileSync(publicPdfPath, Buffer.from(pdfOutput));

  console.log(`Successfully generated Nutrition Pitch PDFs:`);
  console.log(`- ${docsPdfPath} (${fs.statSync(docsPdfPath).size} bytes)`);
  console.log(`- ${publicPdfPath} (${fs.statSync(publicPdfPath).size} bytes)`);
}

generateNutritionPitchPDF();
