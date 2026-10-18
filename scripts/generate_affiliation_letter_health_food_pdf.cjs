const fs = require('fs');
const path = require('path');
const { jsPDF } = require('jspdf');

function generateNutritionLetterPDF() {
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
    doc.text('Canine Health OS (v1.0) — Formal Affiliation Request Letter: Health Food', margin, 30);
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.5);
    doc.line(margin, 35, pageWidth - margin, 35);

    doc.line(margin, pageHeight - 35, pageWidth - margin, pageHeight - 35);
    doc.setFontSize(8);
    doc.setTextColor(138, 134, 128);
    doc.text('Confidential Business Outreach & Affiliation Proposal', margin, pageHeight - 22);
    doc.text(`Page ${pageNum}`, pageWidth - margin, pageHeight - 22, { align: 'right' });
  }

  function addLetterHeader() {
    doc.setFillColor(16, 185, 129);
    doc.roundedRect(margin, y, 260, 22, 4, 4, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text('FORMAL AFFILIATION OUTREACH LETTER', margin + 12, y + 15);

    y += 42;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(26, 26, 26);
    doc.text('Canine Health & Longevity OS', margin, y);

    y += 20;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(255, 107, 74);
    doc.text('Executive Partnership Outreach: Premium Nutrition & Health Food', margin, y);

    y += 22;
    doc.setDrawColor(26, 26, 26);
    doc.setLineWidth(1.5);
    doc.line(margin, y, pageWidth - margin, y);

    y += 20;

    // Contact Block
    doc.setFillColor(247, 246, 243);
    doc.roundedRect(margin, y, contentWidth, 75, 6, 6, 'F');
    doc.setDrawColor(225, 222, 216);
    doc.setLineWidth(0.75);
    doc.roundedRect(margin, y, contentWidth, 75, 6, 6, 'S');

    const metaLeft = margin + 15;
    const metaMid = margin + contentWidth / 2 + 10;
    let metaY = y + 18;

    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(26, 26, 26);
    doc.text('FROM:', metaLeft, metaY);
    doc.setFont('helvetica', 'normal');
    doc.text('[Your Name], Founder & CEO — DogHealthOS', metaLeft + 45, metaY);

    doc.setFont('helvetica', 'bold');
    doc.text('TO:', metaMid, metaY);
    doc.setFont('helvetica', 'normal');
    doc.text('[VP of DTC Growth], [Health Food Company Name]', metaMid + 30, metaY);

    metaY += 16;
    doc.setFont('helvetica', 'bold');
    doc.text('EMAIL:', metaLeft, metaY);
    doc.setFont('helvetica', 'normal');
    doc.text('[your-email@example.com]', metaLeft + 45, metaY);

    doc.setFont('helvetica', 'bold');
    doc.text('DATE:', metaMid, metaY);
    doc.setFont('helvetica', 'normal');
    doc.text('October 2026', metaMid + 30, metaY);

    metaY += 16;
    doc.setFont('helvetica', 'bold');
    doc.text('SUBJECT:', metaLeft, metaY);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(16, 185, 129);
    doc.text('Strategic Affiliate Partnership Proposal: Precision Caloric & BCS-Matched Integration', metaLeft + 55, metaY);

    y += 95;
  }

  function addParagraph(text, isBold = false) {
    checkPageBreak(25);
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
    doc.setFontSize(11);
    doc.setTextColor(255, 107, 74);
    doc.text(subTitle, margin, y);
    y += 16;
  }

  function addInAppMockupBox(title, sampleText, buttonText) {
    checkPageBreak(65);
    doc.setFillColor(245, 247, 250);
    doc.roundedRect(margin, y, contentWidth, 58, 4, 4, 'F');
    doc.setDrawColor(200, 215, 230);
    doc.setLineWidth(0.75);
    doc.roundedRect(margin, y, contentWidth, 58, 4, 4, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(30, 41, 59);
    doc.text(title, margin + 12, y + 15);

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(70, 70, 70);
    doc.text(`"${sampleText}"`, margin + 12, y + 28);

    doc.setFillColor(16, 185, 129);
    doc.roundedRect(margin + 12, y + 36, 210, 15, 3, 3, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(255, 255, 255);
    doc.text(buttonText, margin + 18, y + 46);

    y += 68;
  }

  // --- Construct PDF ---
  addLetterHeader();

  addParagraph("Dear [Partner Name / DTC Growth Team],");
  addParagraph(
    "I am writing to propose a high-converting commercial affiliate partnership between [Health Food Company Name] and " +
    "Canine Health & Longevity OS (DogHealthOS v1.0)—a personalized healthspan calculator and nutrition management application " +
    "used by health-conscious pet owners."
  );
  addParagraph(
    "Finding pet parents willing to invest in premium fresh food or prescription diets is increasingly competitive. " +
    "DogHealthOS acts as an intelligent clinical matchmaker—recommending your specific dietary formulas at the exact second a pet " +
    "parent calculates their dog's ideal weight, Body Condition Score (BCS 1–9), and daily caloric requirement (kcal/day)."
  );

  addSubHeader("HOW WE WILL PROMOTE [HEALTH FOOD COMPANY NAME] IN OUR APP");
  addParagraph("Your formulas are presented as scientifically calculated nutrition solutions tailored to the pet's exact weight profile:");

  addInAppMockupBox(
    "1. Body Condition Score (BCS 1–9) & Weight Calibration Integration",
    "Target: 420 kcal/day (1.5 cups / 1.2 packs per day of [Health Food Company Formula]). Formulated for lean muscle & BCS 5.0.",
    "[ Button: Claim Exclusive 20% Partner Discount ]"
  );

  addInAppMockupBox(
    "2. 'Chef Stella' Neural Voice Consultation Integration",
    "Chef Stella (AI Specialist): 'For a [Breed] at [Weight] lbs, our partner [Health Food Company] provides fresh pre-portioned meals.'",
    "[ Visual Card: Order Fresh Meals ]"
  );

  addInAppMockupBox(
    "3. Dedicated 'Partner Care & Member Perks' Marketplace",
    "Verified Longevity Partner: [Health Food Company Name]. DogHealthOS members receive an exclusive 20% discount code.",
    "[ Button: Redeem Member Promo Code ]"
  );

  doc.addPage();
  y = margin + 20;
  addRunningHeaderFooter();

  addInAppMockupBox(
    "4. Exported Clinical PDF Dossier Attachment",
    "Dedicated 'Dietary Baseline & Recommended Nutrition' page attached to exported veterinary PDFs with trackable QR code.",
    "[ QR Code: Scan to Subscribe ]"
  );

  addSubHeader("EXACT CALORIC & PORTION MATCHING TECHNOLOGY");
  addParagraph(
    "Our application calculates exact daily meal portioning using NRC (National Research Council) Resting Energy Requirement equations:\n" +
    "RER (kcal/day) = 70 * (Weight in kg)^0.75\n\n" +
    "Because pet owners are shown exact daily cup or pack portion guidance for your formula, guesswork is removed, " +
    "resulting in an estimated 35%–48% trial-to-subscriber conversion rate and 68% Month-6 subscriber retention."
  );

  addSubHeader("PROPOSED AFFILIATE BUSINESS TERMS");
  addParagraph(
    "• Cost Per Sale / First Order CPA: Fixed bounty or percentage payout for new customer acquisitions.\n" +
    "• Recurring Subscription Rev-Share: Ongoing percentage of monthly recurring subscription revenue for active subscribers.\n" +
    "• Exclusive Discount Code Co-Marketing: Dedicated promo code (e.g. DOGHEALTH20) for attribution."
  );

  addSubHeader("NEXT STEPS & DEMONSTRATION");
  addParagraph(
    "I would love to schedule a brief 15-minute call this week to demonstrate our live application and review custom " +
    "feeding recommendation cards pre-loaded with [Health Food Company Name] formulas.\n\n" +
    "Please let me know a day and time that works best for your team."
  );

  y += 15;
  addParagraph("Sincerely,", true);
  addParagraph("[Your Name / Founder Name]\nFounder & CEO | Canine Health & Longevity OS\nEmail: [your-email@example.com]");

  const docsDir = path.join(process.cwd(), 'docs');
  const publicDir = path.join(process.cwd(), 'public');

  if (!fs.existsSync(docsDir)) fs.mkdirSync(docsDir, { recursive: true });
  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

  const docsPdfPath = path.join(docsDir, 'Affiliation_Request_Letter_Health_Food.pdf');
  const publicPdfPath = path.join(publicDir, 'Affiliation_Request_Letter_Health_Food.pdf');

  const pdfOutput = doc.output('arraybuffer');
  fs.writeFileSync(docsPdfPath, Buffer.from(pdfOutput));
  fs.writeFileSync(publicPdfPath, Buffer.from(pdfOutput));

  console.log(`Successfully generated Nutrition Affiliation Request Letter PDFs:`);
  console.log(`- ${docsPdfPath} (${fs.statSync(docsPdfPath).size} bytes)`);
  console.log(`- ${publicPdfPath} (${fs.statSync(publicPdfPath).size} bytes)`);
}

generateNutritionLetterPDF();
