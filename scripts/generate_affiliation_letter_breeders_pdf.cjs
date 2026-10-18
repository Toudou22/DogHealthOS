const fs = require('fs');
const path = require('path');
const { jsPDF } = require('jspdf');

function generateBreederLetterPDF() {
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
    doc.text('Canine Health OS (v1.0) — Formal Outreach Letter: Dog Breeders & Kennels', margin, 30);
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.5);
    doc.line(margin, 35, pageWidth - margin, 35);

    doc.line(margin, pageHeight - 35, pageWidth - margin, pageHeight - 35);
    doc.setFontSize(8);
    doc.setTextColor(138, 134, 128);
    doc.text('Ethical Breeder Partnership Proposal & Breeder Pro Suite', margin, pageHeight - 22);
    doc.text(`Page ${pageNum}`, pageWidth - margin, pageHeight - 22, { align: 'right' });
  }

  function addLetterHeader() {
    doc.setFillColor(16, 185, 129); // Emerald
    doc.roundedRect(margin, y, 275, 22, 4, 4, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text('FORMAL OUTREACH LETTER: DOG BREEDERS', margin + 12, y + 15);

    y += 42;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(26, 26, 26);
    doc.text('Canine Health & Longevity OS', margin, y);

    y += 20;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(255, 107, 74);
    doc.text('Strategic Breeder Partnership: Elevate Your Litter Care & Buyer Guarantees', margin, y);

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
    doc.text('[Breeder Name / Kennel Name]', metaMid + 25, metaY);

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
    doc.text('DogHealthOS Breeder Pro Suite & Puppy Audio Passports', metaLeft + 52, metaY);

    y += 90;
  }

  addLetterHeader();

  // Salutation
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(26, 26, 26);
  doc.text('Dear [Breeder Name / Kennel Team],', margin, y);
  y += 20;

  // Opening Paragraph
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(50, 50, 50);
  const text1 = "As an ethical dog breeder dedicated to improving breed health, genetic longevity, and placing thriving puppies with responsible families, you know that a puppy's health journey extends far beyond the whelping box. I am writing to invite [Kennel Name] to join the DogHealthOS Breeder Pro Program—an elite digital health suite designed specifically to give professional breeders unmatched litter tracking tools, genetic transparency, and lifelong puppy buyer support.";
  const lines1 = doc.splitTextToSize(text1, contentWidth);
  doc.text(lines1, margin, y);
  y += lines1.length * 14 + 15;

  // Section: Unmatched Features
  checkPageBreak(120);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(16, 185, 129);
  doc.text('UNMATCHED FEATURES TAILORED FOR PROFESSIONAL BREEDERS', margin, y);
  y += 18;

  const features = [
    {
      title: '1. Breeder Pro Suite & WALTHAM Growth Velocity Curves',
      desc: 'Track entire litters (Dam, Sire, Whelping Date, Individual Collar Colors) with daily weight trajectory curves to detect fading puppies early and ensure optimal growth velocity.'
    },
    {
      title: '2. Digital "Puppy Audio Passport" for New Buyers',
      desc: 'When your puppies go to their forever homes at 8-10 weeks, give buyers a co-branded Puppy Audio Passport with spoken health reports voiced by Dr. Emma Foster, DVM.'
    },
    {
      title: '3. Embed Sire & Dam Health Clearances (OFA / PennHIP / DNA)',
      desc: 'Elevate buyer trust by embedding Sire and Dam health clearances (OFA Hip/Elbow scores, Cardiac, Eyes, DNA panels) directly into exported Breeder Health Dossiers.'
    },
    {
      title: '4. Lifetime Buyer Connection & Return Prevention',
      desc: 'Prevent puppy returns caused by owner anxiety with continuous feeding portion calculations, BCS tools, and milestone reminders tied directly to your kennel guidelines.'
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

  // Section: Exclusive Breeder Program Benefits
  checkPageBreak(120);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(16, 185, 129);
  doc.text('EXCLUSIVE BREEDER PROGRAM BENEFITS', margin, y);
  y += 18;

  const benefits = [
    '• 100% Free Access to Breeder Pro Suite: Manage unlimited litters, dams, and sires without fees.',
    '• Co-Branded Buyer Onboarding: Custom welcome screens featuring your kennel logo and health guarantees.',
    '• Recurring Affiliate Revenue: Earn 20% commission on optional premium care upgrades chosen by your buyers.'
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
  const closingText = "I would love to set up a brief 10-minute video walkthrough to demonstrate the Breeder Pro Suite and show you a sample Puppy Audio Passport customized for [Kennel Name]. Please let me know a convenient time to chat.";
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
  doc.text('Confidential Breeder Outreach — Canine Health & Longevity OS', margin, pageHeight - 22);
  doc.text('Page 1 of ' + doc.internal.getNumberOfPages(), pageWidth - margin, pageHeight - 22, { align: 'right' });

  const docsDir = path.join(__dirname, '..', 'docs');
  const publicDir = path.join(__dirname, '..', 'public');

  if (!fs.existsSync(docsDir)) fs.mkdirSync(docsDir, { recursive: true });
  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

  const pdfBuffer = Buffer.from(doc.output('arraybuffer'));

  fs.writeFileSync(path.join(docsDir, 'Affiliation_Request_Letter_Breeders.pdf'), pdfBuffer);
  fs.writeFileSync(path.join(publicDir, 'Affiliation_Request_Letter_Breeders.pdf'), pdfBuffer);

  console.log('Successfully generated Affiliation_Request_Letter_Breeders.pdf');
}

generateBreederLetterPDF();
