const fs = require('fs');
const path = require('path');
const { jsPDF } = require('jspdf');

function generateInsuranceLetterPDF() {
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
    doc.text('Canine Health OS (v1.0) — Formal Affiliation Request Letter: Pet Insurance', margin, 30);
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
    // Title Badge
    doc.setFillColor(16, 185, 129); // Emerald
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
    doc.text('Executive Partnership Outreach: Pet Insurance Integration', margin, y);

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
    doc.text('[VP of Growth], [Insurance Company Name]', metaMid + 30, metaY);

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
    doc.text('Strategic Affiliate Partnership Proposal: High-Intent Lead Integration', metaLeft + 55, metaY);

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
    doc.roundedRect(margin + 12, y + 36, 180, 15, 3, 3, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(255, 255, 255);
    doc.text(buttonText, margin + 18, y + 46);

    y += 68;
  }

  // --- Construct PDF ---
  addLetterHeader();

  addParagraph("Dear [Partner Name / Business Development Team],");
  addParagraph(
    "I am writing to propose a high-converting affiliate partnership between [Pet Insurance Company Name] and " +
    "Canine Health & Longevity OS (DogHealthOS v1.0)—a personalized canine longevity, biological age calculator, and " +
    "preventive health platform built for health-conscious pet owners."
  );
  addParagraph(
    "Unlike traditional cold advertising channels (Google Search Ads, Facebook retargeting) where acquisition costs are " +
    "skyrocketing and quote form abandonment exceeds 85%, DogHealthOS connects your insurance policies with pet parents " +
    "at the exact moment they are actively planning their dog's health, evaluating genetic risks, and scheduling care."
  );

  addSubHeader("HOW WE WILL PROMOTE [INSURANCE COMPANY NAME] IN OUR APP");
  addParagraph("Your insurance products are natively embedded directly into our clinical workflows as essential protection:");

  addInAppMockupBox(
    "1. Breed Genetic Vulnerability Alert Card",
    "German Shepherds have a 21% lifetime incidence of hip dysplasia. Ensure [Pet Name] is 100% covered with [Insurance Company].",
    "[ Button: Get Instant Quote starting at $28/mo ]"
  );

  addInAppMockupBox(
    "2. Pet Medical Vault Security Header",
    "Pair your digital medical records with verified emergency & illness coverage from [Insurance Company Name].",
    "[ Button: Compare Coverage Options ]"
  );

  addInAppMockupBox(
    "3. Veterinary Milestone & Checkup Scheduler",
    "Ensure 100% of [Pet Name]'s diagnostic bloodwork and emergency visits are reimbursed with [Insurance Company Name].",
    "[ Button: View Pre-Approved Policies ]"
  );

  doc.addPage();
  y = margin + 20;
  addRunningHeaderFooter();

  addInAppMockupBox(
    "4. Exported Clinical PDF Dossier Attachment",
    "Dedicated 'Protection & Insurance Summary' page attached to exported veterinary PDFs with trackable QR code.",
    "[ QR Code: Scan for Mobile Quote ]"
  );

  addSubHeader("OUR FRICTIONLESS 1-CLICK QUOTE TECHNOLOGY");
  addParagraph(
    "DogHealthOS transmits pre-filled pet data directly to your quote landing page via deep-linked API parameters:\n" +
    "https://www.yourinsurance.com/quote?ref=doghealthos&breed=German+Shepherd&age=2.5&weight=68&zip=90210\n\n" +
    "When the user taps 'Get Instant Quote', they land on your website with 100% of fields pre-filled (Breed, Age, Weight, Zip). " +
    "Quote completion time drops from 3 minutes to under 15 seconds, increasing conversion rates by 3x–5x."
  );

  addSubHeader("PROPOSED AFFILIATE BUSINESS TERMS");
  addParagraph(
    "• Cost Per Acquisition (CPA): Fixed referral fee for every completed policy enrollment.\n" +
    "• Cost Per Lead (CPL): Fixed payout per completed pre-filled quote request.\n" +
    "• Revenue Share: Ongoing percentage of monthly policy premiums for the lifetime of the account."
  );

  addSubHeader("NEXT STEPS & DEMONSTRATION");
  addParagraph(
    "I would welcome the opportunity to schedule a brief 15-minute video call this week to demonstrate our live application " +
    "and review custom integration mockups featuring [Insurance Company Name].\n\n" +
    "Please let me know a day and time that works best for your schedule."
  );

  y += 15;
  addParagraph("Sincerely,", true);
  addParagraph("[Your Name / Founder Name]\nFounder & CEO | Canine Health & Longevity OS\nEmail: [your-email@example.com]");

  const docsDir = path.join(process.cwd(), 'docs');
  const publicDir = path.join(process.cwd(), 'public');

  if (!fs.existsSync(docsDir)) fs.mkdirSync(docsDir, { recursive: true });
  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

  const docsPdfPath = path.join(docsDir, 'Affiliation_Request_Letter_Insurance.pdf');
  const publicPdfPath = path.join(publicDir, 'Affiliation_Request_Letter_Insurance.pdf');

  const pdfOutput = doc.output('arraybuffer');
  fs.writeFileSync(docsPdfPath, Buffer.from(pdfOutput));
  fs.writeFileSync(publicPdfPath, Buffer.from(pdfOutput));

  console.log(`Successfully generated Insurance Affiliation Request Letter PDFs:`);
  console.log(`- ${docsPdfPath} (${fs.statSync(docsPdfPath).size} bytes)`);
  console.log(`- ${publicPdfPath} (${fs.statSync(publicPdfPath).size} bytes)`);
}

generateInsuranceLetterPDF();
