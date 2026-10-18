const fs = require('fs');
const path = require('path');
const { jsPDF } = require('jspdf');

function generateMonetizationPlanPDF() {
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
    doc.text('Canine Health & Longevity OS (v1.0) — Commercial Monetization & Revenue Strategy', margin, 30);
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.5);
    doc.line(margin, 35, pageWidth - margin, 35);

    // Running Footer
    doc.line(margin, pageHeight - 35, pageWidth - margin, pageHeight - 35);
    doc.setFontSize(8);
    doc.setTextColor(138, 134, 128);
    doc.text('Commercial Strategy & Pro-Forma Modeling — Confidential & Proprietary', margin, pageHeight - 22);
    doc.text(`Page ${pageNum}`, pageWidth - margin, pageHeight - 22, { align: 'right' });
  }

  function addTitlePage() {
    // Top banner badge
    doc.setFillColor(16, 185, 129); // Emerald Green #10B981
    doc.roundedRect(margin, y, 220, 22, 4, 4, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text('COMMERCIAL STRATEGY & REVENUE MODEL', margin + 12, y + 15);

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
    doc.text('Professional Commercial Monetization Plan & Unit Economics', margin, y);

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
    doc.text('EXECUTIVE COMMERCIAL SUMMARY & SAAS PHILOSOPHY', margin + 16, y + 24);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(70, 70, 70);
    const summaryText = 
      'This comprehensive monetization plan establishes the commercial architecture for Canine Health & ' +
      'Longevity OS v1.0. Rejecting aggressive, ad-cluttered business models, the platform leverages a high-trust ' +
      'freemium-to-subscription flywheel. Anchored by a 3-tier D2C subscription model ($4.99/mo Pro and $9.99/mo Pack), ' +
      'à la carte audio passes, and B2B veterinary clinic co-branding licenses ($49/mo), the business model achieves ' +
      'an exceptional 22.5:1 LTV-to-CAC ratio with 89% gross margins and a path to $4.2M+ ARR within 36 months.';
    
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
    doc.setTextColor(16, 185, 129);
    doc.text('TARGET FINANCIAL UNIT ECONOMICS', margin + 12, y + 20);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(50, 50, 50);
    doc.text('• Customer Acquisition Cost (CAC): $6.20 Blended', margin + 12, y + 40);
    doc.text('• Customer Lifetime Value (LTV): $139.50 (3-Yr Retention)', margin + 12, y + 58);
    doc.text('• LTV to CAC Ratio: 22.5 : 1 (Top-tier SaaS)', margin + 12, y + 76);
    doc.text('• Software Gross Margins: 89.5% Consistent', margin + 12, y + 94);
    doc.text('• Monthly Paid Churn Rate: 3.2% Low', margin + 12, y + 112);

    // Right Metadata Card
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(230, 230, 230);
    doc.roundedRect(margin + colWidth + 20, y, colWidth, 140, 6, 6, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(255, 107, 74);
    doc.text('REVENUE STREAMS & MONETIZATION', margin + colWidth + 32, y + 20);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(50, 50, 50);
    doc.text('• D2C Subscriptions: Free, Pro ($4.99/mo), Pack ($9.99/mo)', margin + colWidth + 32, y + 40);
    doc.text('• À La Carte Micro-Transactions: $1.99 Audio Pass', margin + colWidth + 32, y + 58);
    doc.text('• Archival Keepsake Passport Booklets: $19.99 Printed', margin + colWidth + 32, y + 76);
    doc.text('• B2B Veterinary Practice Licenses: $49/mo per Clinic', margin + colWidth + 32, y + 94);
    doc.text('• Pet Insurance Referral Bounties: $35-$65 per Policy', margin + colWidth + 32, y + 112);

    y += 165;

    // Table of Contents Preview
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(26, 26, 26);
    doc.text('TABLE OF CONTENTS & STRATEGY OUTLINE', margin, y);

    y += 15;
    const tocItems = [
      'Section 1: Market Sizing, Macro Longevity Drivers & Competitive Advantage',
      'Section 2: The 3-Tier D2C Subscription Architecture (Free, Pro & Pack)',
      'Section 3: Micro-Transactions & Archival Physical Keepsake Passports',
      'Section 4: B2B Veterinary Practice Licensing & Insurance Flywheels',
      'Section 5: 3-Year Pro-Forma Financial Projections & SaaS Unit Economics',
      'Section 6: Payment Infrastructure, Global Currencies & Dunning Recovery',
      'Section 7: Customer Retention, Annual Milestone Loops & Anti-Churn Policies',
      'Section 8: Ethical Data Privacy Boundaries & Non-Intrusive Affiliate Standards'
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

  function addSectionHeading(num, title) {
    checkPageBreak(50);
    y += 10;
    doc.setFillColor(16, 185, 129);
    doc.rect(margin, y, 4, 18, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12.5);
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
    doc.setFontSize(10);
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
    const borderCol = type === 'alert' ? [239, 68, 68] : [16, 185, 129];
    const titleCol = type === 'alert' ? [185, 28, 28] : [16, 185, 129];

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

  // BUILD COMPLETE DOCUMENT
  addTitlePage();

  // SECTION 1
  addSectionHeading(1, 'Market Opportunity, Macro Drivers & Competitive Advantage');
  addParagraph(
    'The domestic canine care sector represents one of the most recession-resilient consumer markets globally. ' +
    'North American pet parents spent over $136 Billion in 2024, with specialized healthcare, longevity, and digital services ' +
    'expanding at a 9.2% CAGR. Canine Health & Longevity OS captures this market by offering validated longevity algorithms ' +
    'instead of generic pet tips.'
  );
  addBullet('Epigenetic Aging Disruption', 'Replaces outdated linear rules with scientific epigenetic non-linear aging curves.');
  addBullet('Purina Caloric Life Span Model', 'Visualizes how maintaining an optimal body condition adds 1.8 to 2.5 years of life.');
  addBullet('Neural Audio Differentiation', 'Flagship Neural Studio HD voices provide emotional depth, clinical authority, and high engagement.');

  // SECTION 2
  addSectionHeading(2, 'The 3-Tier D2C Subscription Architecture');
  addSubheading('2.1 Tier 1: Free Forever ("Community Pet Parent")');
  addParagraph(
    'Provides broad access to breed lifespan tables, epigenetic age conversions, basic D3 growth curves, and 1 trial spoken audio passport. ' +
    'Acts as the primary organic acquisition engine through search indexing of over 200 breed terms.'
  );

  addSubheading('2.2 Tier 2: Healthspan Pro ($4.99/mo or $39.99/yr)');
  addParagraph(
    'The core consumer growth driver. Designed for dedicated dog parents seeking comprehensive longevity and preventative tools.'
  );
  addBullet('Unlimited Neural Audio Consultations', 'Full access to all 8 veterinary specialist personas with MP3 downloads.');
  addBullet('D3 Longevity Sensitivity Simulator', 'Interactive weight slider modeling real-time lifespan variations and penalty risks.');
  addBullet('Advanced Milestones Scheduler', 'Unlimited appointment logging, pre-visit checklists, calendar (.ics) sync, and printable care sheets.');
  addBullet('Vector PDF Consultation Reports', 'Unlimited downloads of comprehensive multi-page reports for vet visits and insurance claims.');
  addBullet('Pet Medical Vault Storage', 'Stores up to 3 individual dog profiles with full medical records.');

  addSubheading('2.3 Tier 3: Pack & Breeder Pro ($9.99/mo or $79.99/yr)');
  addParagraph(
    'Designed for multi-dog homes (3+ dogs), ethical AKC breeders, rescues, and trainers. Provides unlimited pet profiles, litter growth ' +
    'cohort tracking against WALTHAM pediatric curves, and co-branded take-home puppy adoption packets.'
  );

  // SECTION 3
  addSectionHeading(3, 'Micro-Transactions & Archival Physical Products');
  addParagraph(
    'Supplementary transactional offerings capture revenue from non-subscribers while maintaining 55% to 96% gross margins.'
  );
  addBullet('Single Audio Consultation Pass ($1.99)', 'Allows free users to purchase a single specialist consultation plan without ongoing subscription.');
  addBullet('Archival Keepsake Health Passport ($19.99)', 'Hardcover physical passport book with printed clinical milestones, growth records, and QR code to digital vault (55% profit margin).');
  addBullet('Breeder Litter Health Bundle ($14.99)', 'One-time packet generator producing up to 10 take-home health transfer packets for a puppy litter.');

  // SECTION 4
  addSectionHeading(4, 'B2B Practice Licensing & Insurance Flywheels');
  addSubheading('4.1 Veterinary Clinic Co-Branded Licensing ($49/mo)');
  addParagraph(
    'Veterinary clinics subscribe to provide branded DogHealthOS accounts to their clients. Automated pre-visit checklists ' +
    'and audio post-op discharge instructions reduce routine front-desk triage call volumes by up to 35%.'
  );

  addSubheading('4.2 Pet Insurance Bounties ($35 - $65 per Policy)');
  addParagraph(
    'Integrated Lifetime Cost Forecaster prompts contextually relevant pet insurance quotes (Trupanion, Healthy Paws, Lemonade). ' +
    'Each policy activation yields a $35 to $65 referral bounty, with policyholders qualifying for preventive premium discounts.'
  );

  addSubheading('4.3 Curated Clinical Nutrition Affiliates (8% - 15%)');
  addParagraph(
    'Contextual, non-intrusive matching of clinically proven prescription diets (Purina Pro Plan, Royal Canin, The Farmer\'s Dog) ' +
    'generating $4.50 to $9.00/month recurring commission per participating pet.'
  );

  // SECTION 5
  addSectionHeading(5, '3-Year Pro-Forma Financial Projections & Unit Economics');
  addParagraph(
    'The platform demonstrates exceptional software-as-a-service (SaaS) unit economics, driven by low customer acquisition costs ' +
    'and high emotional pet parent retention.'
  );
  addCalloutBox(
    'UNIT ECONOMICS & FINANCIAL HIGHLIGHTS',
    '• Blended CAC: $6.20 (Driven by organic breed search volume).\n' +
    '• Customer Lifetime Value (LTV): $139.50 based on average 3-year subscriber retention.\n' +
    '• LTV to CAC Ratio: 22.5 : 1 (Significantly exceeds industry benchmark of 3:1).\n' +
    '• Gross Margins: 89.5% consistent across software, audio compute, and database queries.\n' +
    '• Year 1 Revenue: $325,640 (EBITDA $122,140 / 37.5%).\n' +
    '• Year 2 Revenue: $1,371,450 (EBITDA $733,450 / 53.5%).\n' +
    '• Year 3 Revenue: $4,220,875 (EBITDA $2,635,875 / 62.4%).',
    'info'
  );

  // SECTION 6
  addSectionHeading(6, 'Payment Infrastructure, Global Currencies & Dunning');
  addParagraph(
    'Global commerce is managed through Stripe Billing, supporting Apple Pay, Google Pay, and localized currencies (USD, EUR, GBP, CAD, AUD).'
  );
  addBullet('Smart Retry Dunning', 'Machine learning retries reduce involuntary credit card churn by up to 45%.');
  addBullet('7-Day Medical Grace Period', 'Ensures pet parents never lose access to emergency clinical care plans during billing updates.');

  // SECTION 7
  addSectionHeading(7, 'Customer Retention & Anti-Churn Lifecycle Loops');
  addParagraph(
    'Predictable lifecycle milestones ensure ongoing subscriber engagement throughout the pet\'s multi-year life.'
  );
  addBullet('Biological Human Age Birthday Cards', 'Annual notifications celebrating the dog\'s birthday with updated Epigenetic Human Age.');
  addBullet('Quarterly Seasonal Health Shift Alerts', 'Automated advice on seasonal hazards (heatstroke, de-icing salts, tick surges).');
  addBullet('Frictionless One-Click Cancellation', 'Transparent self-service cancellation; historical records remain permanently readable.');

  // SECTION 8
  addSectionHeading(8, 'Ethical Data Privacy Boundaries & FTC Compliance');
  addParagraph(
    'DogHealthOS enforces strict ethical monetization standards to build lasting community trust.'
  );
  addCalloutBox(
    'ETHICAL MONETIZATION COMMITMENT',
    '1. Zero Data Brokerage: User personal details and pet health histories are never sold or rented to third-party data brokers.\n' +
    '2. Conspicuous Disclosures: All affiliate partnerships and insurance referrals carry clear, FTC-compliant disclosures.\n' +
    '3. Clear Clinical Boundaries: All copy and audio consultations clearly state that the platform provides wellness guidance that augments, rather than replaces, direct veterinary care.',
    'info'
  );

  // Output files
  const docsDir = path.join(process.cwd(), 'docs');
  const publicDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(docsDir)) fs.mkdirSync(docsDir, { recursive: true });
  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

  const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
  
  const docsPath = path.join(docsDir, 'DogHealthOS_Monetization_Plan_v1.0.pdf');
  const publicPath = path.join(publicDir, 'DogHealthOS_Monetization_Plan_v1.0.pdf');

  fs.writeFileSync(docsPath, pdfBuffer);
  fs.writeFileSync(publicPath, pdfBuffer);

  console.log(`[SUCCESS] PDF Monetization Plan generated successfully:`);
  console.log(`- Docs Path: ${docsPath} (${(pdfBuffer.length / 1024).toFixed(1)} KB)`);
  console.log(`- Public Path: ${publicPath}`);
}

generateMonetizationPlanPDF();
