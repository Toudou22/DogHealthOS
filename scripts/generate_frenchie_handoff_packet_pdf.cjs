const fs = require('fs');
const path = require('path');
const { jsPDF } = require('jspdf');

function generateFrenchieHandoffPacketPDF() {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'letter'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;
  const contentWidth = pageWidth - margin * 2;

  let y = margin;

  function checkPageBreak(requiredHeight) {
    if (y + requiredHeight > pageHeight - 50) {
      doc.addPage();
      y = margin + 15;
      addRunningHeaderFooter();
    }
  }

  function addRunningHeaderFooter() {
    const pageNum = doc.internal.getCurrentPageInfo().pageNumber;
    if (pageNum === 1) return;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(138, 134, 128);
    doc.text('Elysian French Bulldogs × DogHealthOS Pro — Official Puppy Adoption Hand-off Packet', margin, 25);
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.5);
    doc.line(margin, 30, pageWidth - margin, 30);

    doc.line(margin, pageHeight - 30, pageWidth - margin, pageHeight - 30);
    doc.setFontSize(8);
    doc.setTextColor(138, 134, 128);
    doc.text('Verified Digital Breeder Dossier & Audio Passport (AKC-FB-2026-88942)', margin, pageHeight - 18);
    doc.text(`Page ${pageNum}`, pageWidth - margin, pageHeight - 18, { align: 'right' });
  }

  // Header Banner
  doc.setFillColor(16, 185, 129); // Emerald
  doc.roundedRect(margin, y, 290, 20, 4, 4, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(255, 255, 255);
  doc.text('OFFICIAL BREEDER PUPPY HAND-OFF PACKET', margin + 10, y + 13);

  y += 35;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(26, 26, 26);
  doc.text('French Bulldog Adoption Dossier & Audio Passport', margin, y);

  y += 18;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(255, 107, 74);
  doc.text('Co-Branded Health Record: Elysian French Bulldogs × DogHealthOS Pro', margin, y);

  y += 18;
  doc.setDrawColor(26, 26, 26);
  doc.setLineWidth(1.25);
  doc.line(margin, y, pageWidth - margin, y);

  y += 15;

  // Kennel & Puppy Registration Metadata Block
  doc.setFillColor(247, 246, 243);
  doc.roundedRect(margin, y, contentWidth, 80, 6, 6, 'F');
  doc.setDrawColor(225, 222, 216);
  doc.setLineWidth(0.75);
  doc.roundedRect(margin, y, contentWidth, 80, 6, 6, 'S');

  const cLeft = margin + 12;
  const cMid = margin + contentWidth / 2 + 10;
  let cY = y + 16;

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(26, 26, 26);
  doc.text('BREEDER / KENNEL:', cLeft, cY);
  doc.setFont('helvetica', 'normal');
  doc.text('Elysian Frenchies (AKC Breeder of Merit)', cLeft + 92, cY);

  doc.setFont('helvetica', 'bold');
  doc.text('PUPPY NAME:', cMid, cY);
  doc.setFont('helvetica', 'normal');
  doc.text('"Winston" (Blue Fawn Boy)', cMid + 68, cY);

  cY += 15;
  doc.setFont('helvetica', 'bold');
  doc.text('LITTER REGISTRATION:', cLeft, cY);
  doc.setFont('helvetica', 'normal');
  doc.text('AKC-FB-2026-88942', cLeft + 102, cY);

  doc.setFont('helvetica', 'bold');
  doc.text('MICROCHIP ID:', cMid, cY);
  doc.setFont('helvetica', 'normal');
  doc.text('985141002384912', cMid + 68, cY);

  cY += 15;
  doc.setFont('helvetica', 'bold');
  doc.text('WHELPING DATE:', cLeft, cY);
  doc.setFont('helvetica', 'normal');
  doc.text('Aug 10, 2026 (Age: 8 Weeks)', cLeft + 82, cY);

  doc.setFont('helvetica', 'bold');
  doc.text('DAM & SIRE:', cMid, cY);
  doc.setFont('helvetica', 'normal');
  doc.text('Bella Royale × Ch. Grand Duke Pierre', cMid + 60, cY);

  cY += 15;
  doc.setFont('helvetica', 'bold');
  doc.text('VERIFICATION CODE:', cLeft, cY);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(16, 185, 129);
  doc.text('#DHOS-FB-88942-VERIFIED', cLeft + 98, cY);
  doc.setTextColor(26, 26, 26);

  y += 92;

  // SECTION 1: PARENTAL HEALTH CLEARANCES & GENETIC CREDENTIALS
  checkPageBreak(110);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(16, 185, 129);
  doc.text('1. PARENTAL HEALTH CLEARANCES & GENETIC CREDENTIALS', margin, y);
  y += 14;

  // Table Header
  doc.setFillColor(235, 233, 228);
  doc.rect(margin, y, contentWidth, 18, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(26, 26, 26);
  doc.text('OFA / Genetic Test', margin + 8, y + 12);
  doc.text('Dam (Bella Royale)', margin + 130, y + 12);
  doc.text('Sire (Ch. Pierre)', margin + 240, y + 12);
  doc.text('Clinical Status & Protection', margin + 350, y + 12);

  y += 18;

  const parentalData = [
    ['OFA Patellar Luxation', 'Normal (FB-PAT-1042)', 'Normal (FB-PAT-0988)', 'Normal Stifle Joints'],
    ['OFA Cardiac (Echo)', 'Normal (FB-CA-332)', 'Normal (FB-CA-290)', 'Congenital Heart Clear'],
    ['OFA Eye Examination', 'Clear (FB-EYE-811)', 'Clear (FB-EYE-740)', 'Cataract / Cherry Eye Clear'],
    ['JHC (Juvenile Cataracts)', 'Clear (N/N)', 'Clear (N/N)', '100% Non-Carrier Guarantee'],
    ['DM (Degenerative Myelopathy)', 'Clear (N/N)', 'Carrier (N/A)', 'Offspring Non-Affected'],
    ['Cystinuria Type III', 'Clear (N/N)', 'Clear (N/N)', 'Kidney Stone Safe']
  ];

  parentalData.forEach((row, idx) => {
    checkPageBreak(16);
    if (idx % 2 === 1) {
      doc.setFillColor(249, 248, 246);
      doc.rect(margin, y, contentWidth, 16, 'F');
    }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(26, 26, 26);
    doc.text(row[0], margin + 8, y + 11);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    doc.text(row[1], margin + 130, y + 11);
    doc.text(row[2], margin + 240, y + 11);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(16, 185, 129);
    doc.text(row[3], margin + 350, y + 11);

    y += 16;
  });

  y += 14;

  // SECTION 2: PEDIATRIC VACCINATION & DEWORMING LOG
  checkPageBreak(110);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(16, 185, 129);
  doc.text('2. PEDIATRIC VACCINATION & DEWORMING HISTORY', margin, y);
  y += 14;

  doc.setFillColor(235, 233, 228);
  doc.rect(margin, y, contentWidth, 18, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(26, 26, 26);
  doc.text('Date / Age', margin + 8, y + 12);
  doc.text('Biological Milestone / Vaccine', margin + 100, y + 12);
  doc.text('Administrator / Clinic', margin + 360, y + 12);

  y += 18;

  const vaxData = [
    ['Aug 24 (2 Wks)', 'Pyrantel Pamoate Deworming (0.5ml)', 'Elysian Frenchies Kennel'],
    ['Sep 07 (4 Wks)', 'Pyrantel Pamoate Deworming (1.0ml)', 'Elysian Frenchies Kennel'],
    ['Sep 21 (6 Wks)', 'Nobivac DHPP #1 + Fenbendazole 3-Day Protocol', 'Valley Vet Clinic (Dr. Vance, DVM)'],
    ['Oct 05 (8 Wks)', 'Nobivac DHPP #2 + Microchip Placement + Health Cert', 'Valley Vet Clinic (Dr. Vance, DVM)'],
    ['Oct 31 (12 Wks)', 'DUE: Nobivac DHPP #3 + Bordetella Booster', 'Adopter Primary Vet'],
    ['Nov 28 (16 Wks)', 'DUE: Rabies (1-Yr) + DHPP Final Booster #4', 'Adopter Primary Vet']
  ];

  vaxData.forEach((row, idx) => {
    checkPageBreak(16);
    if (idx % 2 === 1) {
      doc.setFillColor(249, 248, 246);
      doc.rect(margin, y, contentWidth, 16, 'F');
    }
    const isDue = row[1].startsWith('DUE:');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(isDue ? 255 : 26, isDue ? 107 : 26, isDue ? 74 : 26);
    doc.text(row[0], margin + 8, y + 11);

    doc.setFont('helvetica', 'normal');
    doc.text(row[1], margin + 100, y + 11);
    doc.text(row[2], margin + 360, y + 11);

    y += 16;
  });

  y += 14;

  // SECTION 3: WALTHAM GROWTH & NUTRITION
  checkPageBreak(100);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(16, 185, 129);
  doc.text('3. WALTHAM PEDIATRIC GROWTH VELOCITY & NUTRITION', margin, y);
  y += 14;

  doc.setFillColor(247, 246, 243);
  doc.roundedRect(margin, y, contentWidth, 52, 4, 4, 'F');

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(26, 26, 26);
  doc.text('8-Week Weight:', margin + 12, y + 16);
  doc.setFont('helvetica', 'normal');
  doc.text('5.10 lbs (2.31 kg) — WALTHAM 50th Percentile Curve', margin + 88, y + 16);

  doc.setFont('helvetica', 'bold');
  doc.text('Target Adult Weight:', margin + 310, y + 16);
  doc.setFont('helvetica', 'normal');
  doc.text('24.0 - 26.0 lbs', margin + 400, y + 16);

  doc.setFont('helvetica', 'bold');
  doc.text('Current Feed:', margin + 12, y + 32);
  doc.setFont('helvetica', 'normal');
  doc.text('Royal Canin French Bulldog Puppy (380 kcal/day split in 3 meals)', margin + 88, y + 32);

  doc.setFont('helvetica', 'bold');
  doc.text('Current BCS:', margin + 310, y + 32);
  doc.setFont('helvetica', 'normal');
  doc.text('4.5 / 9.0 (Ideal Lean Condition)', margin + 375, y + 32);

  y += 64;

  // SECTION 4: FRENCH BULLDOG CLINICAL CARE & HYGIENE
  checkPageBreak(90);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(16, 185, 129);
  doc.text('4. FRENCH BULLDOG CLINICAL CARE PROTOCOL', margin, y);
  y += 14;

  const frenchieCare = [
    '• Thermal Safety & Airway: French Bulldogs cannot dissipate heat. Never expose Winston to temperatures over 78°F (25.5°C). Always use a chest harness (never a neck collar).',
    '• Skin Fold & Tail Pocket Wipes: Clean facial wrinkles and tail pocket 3x weekly with chlorhexidine wipes to keep folds dry and prevent dermatitis.',
    '• Spinal Protection (IVDD Ramps): Avoid letting Winston jump on/off high beds or sofas. Provide ramps or pet stairs to prevent intervertebral disc disease.'
  ];

  frenchieCare.forEach((c) => {
    checkPageBreak(22);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(50, 50, 50);
    const clines = doc.splitTextToSize(c, contentWidth);
    doc.text(clines, margin, y);
    y += clines.length * 11 + 4;
  });

  y += 10;

  // SECTION 5: PUPPY AUDIO PASSPORT TRANSCRIPT
  checkPageBreak(100);
  doc.setFillColor(240, 253, 244); // Soft Emerald tint
  doc.roundedRect(margin, y, contentWidth, 80, 6, 6, 'F');
  doc.setDrawColor(16, 185, 129);
  doc.setLineWidth(1);
  doc.roundedRect(margin, y, contentWidth, 80, 6, 6, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(16, 185, 129);
  doc.text('🎙️ DIGITAL "PUPPY AUDIO PASSPORT" TRANSCRIPT (Dr. Emma Foster, DVM)', margin + 12, y + 18);

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(40, 40, 40);
  const audioTranscript = '"Hello and congratulations! Welcome to Winston\'s official digital health passport from Elysian French Bulldogs and Canine Health OS. Winston is an 8-week-old Blue Fawn French Bulldog. His parents, Bella Royale and Champion Pierre, have tested clear for OFA Patellar, Cardiac, Eye, and Hereditary Cataracts. Winston is eating 380 calories per day split across 3 meals. Please keep Winston cool in warm weather, use a chest harness, and schedule his 12-week DHPP booster for October 31st!"';
  const alines = doc.splitTextToSize(audioTranscript, contentWidth - 24);
  doc.text(alines, margin + 12, y + 33);

  y += 92;

  // Sign-off Block
  checkPageBreak(50);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(26, 26, 26);
  doc.text('Elysian French Bulldogs Kennel Team', margin, y);
  y += 12;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text('Verified via DogHealthOS Breeder Pro Suite | App Link: https://ais-pre-xasmajlo4ibmlxoqh2eyam-28567500933.us-east1.run.app', margin, y);

  // Footer for Page 1
  doc.line(margin, pageHeight - 30, pageWidth - margin, pageHeight - 30);
  doc.setFontSize(8);
  doc.setTextColor(138, 134, 128);
  doc.text('Confidential Breeder Hand-off Packet — DogHealthOS Pro', margin, pageHeight - 18);
  doc.text('Page 1 of ' + doc.internal.getNumberOfPages(), pageWidth - margin, pageHeight - 18, { align: 'right' });

  const docsDir = path.join(__dirname, '..', 'docs');
  const publicDir = path.join(__dirname, '..', 'public');

  if (!fs.existsSync(docsDir)) fs.mkdirSync(docsDir, { recursive: true });
  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

  const pdfBuffer = Buffer.from(doc.output('arraybuffer'));

  fs.writeFileSync(path.join(docsDir, 'French_Bulldog_Puppy_Handoff_Packet_Sample.pdf'), pdfBuffer);
  fs.writeFileSync(path.join(publicDir, 'French_Bulldog_Puppy_Handoff_Packet_Sample.pdf'), pdfBuffer);

  console.log('Successfully generated French_Bulldog_Puppy_Handoff_Packet_Sample.pdf');
}

generateFrenchieHandoffPacketPDF();
