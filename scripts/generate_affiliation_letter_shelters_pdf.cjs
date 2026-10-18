const fs = require('fs');
const path = require('path');
const { jsPDF } = require('jspdf');

function generateShelterLetterPDF() {
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
    doc.text('Canine Health OS (v1.0) — Formal Outreach Letter: Dog Shelters & Rescues', margin, 30);
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.5);
    doc.line(margin, 35, pageWidth - margin, 35);

    doc.line(margin, pageHeight - 35, pageWidth - margin, pageHeight - 35);
    doc.setFontSize(8);
    doc.setTextColor(138, 134, 128);
    doc.text('Rescue & Adoption Support Program & Shelter Return Prevention', margin, pageHeight - 22);
    doc.text(`Page ${pageNum}`, pageWidth - margin, pageHeight - 22, { align: 'right' });
  }

  function addLetterHeader() {
    doc.setFillColor(16, 185, 129); // Emerald
    doc.roundedRect(margin, y, 280, 22, 4, 4, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text('FORMAL OUTREACH LETTER: DOG SHELTERS', margin + 12, y + 15);

    y += 42;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(26, 26, 26);
    doc.text('Canine Health & Longevity OS', margin, y);

    y += 20;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(255, 107, 74);
    doc.text('Strategic Rescue Partnership: Empowering Adopters & Reducing Shelter Returns', margin, y);

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
    doc.text('[Shelter Director / Adoption Manager]', metaMid + 25, metaY);

    metaY += 16;
    doc.setFont('helvetica', 'bold');
    doc.text('EMAIL:', metaLeft, metaY);
    doc.setFont('helvetica', 'normal');
    doc.text('partnerships@doghealthos.app', metaLeft + 45, metaY);

    doc.setFont('helvetica', 'bold');
    doc.text('DATE:', metaMid, metaY);
    doc.setFont('helvetica', 'normal');
    doc.text('October 2026', metaMid + 35, metaY);

    metaY += 16;
    doc.setFont('helvetica', 'bold');
    doc.text('SUBJECT:', metaLeft, metaY);
    doc.setFont('helvetica', 'normal');
    doc.text('DogHealthOS Rescue Edition & Post-Adoption Audio Passports', metaLeft + 52, metaY);

    y += 90;
  }

  addLetterHeader();

  // Salutation
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(26, 26, 26);
  doc.text('Dear [Director Name / Shelter Management Team],', margin, y);
  y += 20;

  // Opening Paragraph
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(50, 50, 50);
  const text1 = "Every day, your organization performs extraordinary work rescuing, rehabilitating, and finding loving homes for dogs in need. However, shelter leaders across the nation share a major common challenge: preventing post-adoption returns caused by adopter anxiety, medical confusion, or behavioral transition struggles. I am writing to invite [Shelter Name] to partner with Canine Health & Longevity OS (DogHealthOS) through our Rescue & Adoption Support Program—a zero-cost digital care package provided to every adopter at the point of adoption.";
  const lines1 = doc.splitTextToSize(text1, contentWidth);
  doc.text(lines1, margin, y);
  y += lines1.length * 14 + 15;

  // Section: Unmatched Features
  checkPageBreak(120);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(16, 185, 129);
  doc.text('UNMATCHED FEATURES TAILORED FOR SHELTERS & RESCUES', margin, y);
  y += 18;

  const features = [
    {
      title: '1. Co-Branded Digital "Adoption Audio Passport"',
      desc: 'Give new adopters a personalized Adoption Audio Passport with spoken guidelines voiced by Dr. Emma Foster, DVM, helping them manage the critical 3-3-3 adoption transition.'
    },
    {
      title: '2. Emergency Triage & Symptom Guardrails (Fewer Calls & Returns)',
      desc: 'Immediate red-flag indicators (Red/Orange/Yellow/Green levels) filter non-emergency adopter questions while guiding adopters on when to consult a vet vs. monitor at home.'
    },
    {
      title: '3. Dietary Stabilization & BCS Weight Recovery Tracking',
      desc: 'Precision NRC Caloric Calculator and WALTHAM Recovery Curves guide adopters in safely weight-gaining underweight rescues and transitioning diets without gastrointestinal distress.'
    },
    {
      title: '4. Lifetime Digital Health Vault & Vaccine Reminders',
      desc: 'Adopters can upload spay/neuter certs, vaccine logs, and microchip numbers into a permanent vault and export clinical summaries for their private veterinarian.'
    }
  ];

  features.forEach((f) => {
    checkPageBreak(60);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(26, 26, 26);
    doc.text(f.title, margin, y);
    y += 14;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(70, 70, 70);
    const flines = doc.splitTextToSize(f.desc, contentWidth - 10);
    doc.text(flines, margin + 10, y);
    y += flines.length * 13 + 12;
  });

  // Section: Exclusive Shelter Program Benefits
  checkPageBreak(120);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(16, 185, 129);
  doc.text('EXCLUSIVE SHELTER & RESCUE PROGRAM BENEFITS', margin, y);
  y += 18;

  const benefits = [
    '• 100% Free Unlimited Access: Zero cost to your shelter or adopters for essential health tools.',
    '• Custom Shelter QR Codes: Instant onboarding cards provided for insertion into adoption exit packets.',
    '• Donation Match Revenue Stream: For every adopter who purchases optional partner health perks, DogHealthOS donates a percentage directly back to your shelter.'
  ];

  benefits.forEach((b) => {
    checkPageBreak(25);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(40, 40, 40);
    const blines = doc.splitTextToSize(b, contentWidth);
    doc.text(blines, margin, y);
    y += blines.length * 13 + 6;
  });

  y += 15;

  // Closing & Sign-off
  checkPageBreak(100);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(50, 50, 50);
  const closingText = "We would be honored to provide [Shelter Name] with custom adoption packet assets, digital QR code cards, and a brief 10-minute demonstration of the Rescue Edition. Please let us know a convenient time to connect this week.";
  const clines = doc.splitTextToSize(closingText, contentWidth);
  doc.text(clines, margin, y);
  y += clines.length * 14 + 20;

  doc.setFont('helvetica', 'bold');
  doc.text('[Your Name / Founder Name]', margin, y);
  y += 14;
  doc.setFont('helvetica', 'normal');
  doc.text('Founder & CEO | Canine Health & Longevity OS', margin, y);

  // Footer for Page 1
  doc.line(margin, pageHeight - 35, pageWidth - margin, pageHeight - 35);
  doc.setFontSize(8);
  doc.setTextColor(138, 134, 128);
  doc.text('Confidential Shelter Outreach — Canine Health & Longevity OS', margin, pageHeight - 22);
  doc.text('Page 1 of ' + doc.internal.getNumberOfPages(), pageWidth - margin, pageHeight - 22, { align: 'right' });

  const docsDir = path.join(__dirname, '..', 'docs');
  const publicDir = path.join(__dirname, '..', 'public');

  if (!fs.existsSync(docsDir)) fs.mkdirSync(docsDir, { recursive: true });
  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

  const pdfBuffer = Buffer.from(doc.output('arraybuffer'));

  fs.writeFileSync(path.join(docsDir, 'Affiliation_Request_Letter_Shelters.pdf'), pdfBuffer);
  fs.writeFileSync(path.join(publicDir, 'Affiliation_Request_Letter_Shelters.pdf'), pdfBuffer);

  console.log('Successfully generated Affiliation_Request_Letter_Shelters.pdf');
}

generateShelterLetterPDF();
