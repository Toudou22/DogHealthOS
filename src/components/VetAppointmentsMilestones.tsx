import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  Calendar, Clock, CheckCircle2, AlertCircle, Plus, Trash2, Edit3,
  Download, Printer, Shield, Activity, Sparkles, Syringe, Stethoscope,
  Heart, FileText, ChevronRight, Check, X, Bell, MapPin, User,
  CalendarCheck, ExternalLink, RefreshCw, Dog
} from 'lucide-react';
import { Breed } from '../types';
import {
  VetAppointment,
  saveVetAppointment,
  getVetAppointments,
  updateVetAppointmentStatus,
  deleteVetAppointment,
  logUserAction
} from '../utils/firebaseHelper';

export interface VetAppointmentsMilestonesProps {
  breed: Breed;
  currentAge: number;
  petName?: string;
  currentWeight?: number;
  weightUnit?: 'lbs' | 'kg';
  bcsScore?: number;
}

type HealthStage = 'Puppy' | 'Young Adult' | 'Mature Adult' | 'Senior' | 'Geriatric';

interface MilestoneTemplate {
  id: string;
  stage: HealthStage;
  minAge: number;
  maxAge: number;
  type: VetAppointment['type'];
  title: string;
  frequency: string;
  urgency: 'high' | 'medium' | 'routine';
  description: string;
  checklist: string[];
  clinicalReference: string;
}

// Clinically grounded preventative veterinary milestones (AAHA / WSAVA / AVMA standards)
const CLINICAL_MILESTONES: MilestoneTemplate[] = [
  // Puppy Milestones (0 - 1 year)
  {
    id: 'pup_core_dhpp',
    stage: 'Puppy',
    minAge: 0,
    maxAge: 1,
    type: 'vaccine',
    title: 'Core Puppy Immunization Series (DHPP Booster)',
    frequency: 'Weeks 8, 12, 16',
    urgency: 'high',
    description: 'Mandatory core protection against Canine Distempervirus, Adenovirus, Parvovirus, and Parainfluenza.',
    checklist: ['Verify maternal antibody window', 'Record core lot number', 'Bring fresh stool sample for fecal float', 'Administer broad-spectrum dewormer'],
    clinicalReference: 'AAHA Canine Vaccination Guidelines (2022 Revision)'
  },
  {
    id: 'pup_rabies_microchip',
    stage: 'Puppy',
    minAge: 0,
    maxAge: 1,
    type: 'vaccine',
    title: '1-Year Rabies Vaccine & ISO Microchip Implantation',
    frequency: 'At 14 - 16 Weeks',
    urgency: 'high',
    description: 'Legally mandated rabies prophylaxis and universal 15-digit ISO 11784/11785 biometric microchip registration.',
    checklist: ['Obtain official county Rabies Certificate', 'Register 15-digit microchip online immediately', 'Check resting rectal temperature'],
    clinicalReference: 'Compendium of Animal Rabies Prevention and Control (NASPHV)'
  },
  {
    id: 'pup_lepto_lyme',
    stage: 'Puppy',
    minAge: 0,
    maxAge: 1,
    type: 'vaccine',
    title: 'Leptospirosis 4-Serovar & Bordetella Immunization',
    frequency: '2-Dose Series (2-4 wks apart)',
    urgency: 'medium',
    description: 'Essential environmental bacterial protection for dogs exposed to puddles, standing water, wildlife, dog parks, or boarding facilities.',
    checklist: ['Check for local wildlife / raccoon exposure', 'Schedule second booster in exactly 21-28 days'],
    clinicalReference: 'WSAVA Vaccination Guidelines for Dogs and Cats'
  },
  {
    id: 'pup_desexing',
    stage: 'Puppy',
    minAge: 0,
    maxAge: 1.5,
    type: 'wellness',
    title: 'Developmental Spay/Neuter & Growth Plate Consultation',
    frequency: 'Between 6 - 14 Months (Breed-Specific)',
    urgency: 'medium',
    description: 'Veterinary evaluation of physical maturity and orthopedic growth plate closure before gonadectomy to protect joint longevity.',
    checklist: ['Discuss breed orthopedic risk (Hip Dysplasia / CCL tear)', 'Review pre-anesthetic blood panel', 'Schedule dental deciduous tooth check'],
    clinicalReference: 'Hart et al. (UC Davis 35-Breed Desexing Timing Cohort Study)'
  },

  // Young Adult Milestones (1 - 4 years)
  {
    id: 'ya_annual_wellness',
    stage: 'Young Adult',
    minAge: 1,
    maxAge: 4,
    type: 'wellness',
    title: 'Annual Comprehensive Physical & Biometric Wellness Exam',
    frequency: 'Every 12 Months',
    urgency: 'high',
    description: 'Systematic head-to-tail auscultation, lymph node palpation, BCS evaluation, ophthalmic inspection, and joint mobility checks.',
    checklist: ['Bring updated diet and treat history', 'Record resting weight and BCS score', 'Check oral cavity for early stage 1 plaque'],
    clinicalReference: 'AAHA Canine Life Stage Guidelines'
  },
  {
    id: 'ya_heartworm_4dx',
    stage: 'Young Adult',
    minAge: 1,
    maxAge: 4,
    type: 'bloodwork',
    title: 'Annual 4Dx Vector-Borne Screening (Heartworm, Lyme, Ehrlichia, Anaplasma)',
    frequency: 'Annual Blood Test',
    urgency: 'high',
    description: 'Essential blood test detecting Dirofilaria immitis microfilaria and tick-borne pathogens before clinical symptoms appear.',
    checklist: ['Confirm 12-month preventative compliance', 'Test before issuing annual preventative prescription refill'],
    clinicalReference: 'American Heartworm Society (AHS) Guidelines'
  },
  {
    id: 'ya_dental_eval',
    stage: 'Young Adult',
    minAge: 1,
    maxAge: 5,
    type: 'dental',
    title: 'Oral Health Examination & Prophylactic Scaling Assessment',
    frequency: 'Every 12 Months',
    urgency: 'medium',
    description: 'Over 80% of dogs show periodontal pathology by age 3. Early ultrasonic scaling protects the myocardium and renal filter.',
    checklist: ['Inspect premolars and molars for calculus', 'Check for gingival pocketing and inflammation', 'Review daily enzymatic home brushing routine'],
    clinicalReference: 'AVMA Oral Health & Systemic Organ Health in Canines'
  },
  {
    id: 'ya_core_3yr_boosters',
    stage: 'Young Adult',
    minAge: 1,
    maxAge: 4,
    type: 'vaccine',
    title: '3-Year Core Booster Protocol (DHPP & 3-Year Rabies)',
    frequency: 'Every 36 Months',
    urgency: 'high',
    description: 'Long-duration immunity boosters verifying sustained antibody titers against fatal canine infectious diseases.',
    checklist: ['Update rabies county registration license', 'Optionally run vaccine antibody titer (VacciCheck)'],
    clinicalReference: 'AAHA / AVMA 3-Year Core Revaccination Recommendations'
  },

  // Mature Adult Milestones (4 - 7 years)
  {
    id: 'ma_biannual_check',
    stage: 'Mature Adult',
    minAge: 4,
    maxAge: 7,
    type: 'wellness',
    title: 'Bi-Annual Adult Physical & Weight Velocity Audit',
    frequency: 'Every 6 - 12 Months',
    urgency: 'high',
    description: 'Mid-life metabolism check. Tracking subtle weight velocity changes (±5%) is the #1 early indicator of metabolic or renal dysfunction.',
    checklist: ['Calibrate food quantity to current activity', 'Evaluate patellar firmness and spinal flexion', 'Review fecal flotation for giardia / whipworms'],
    clinicalReference: 'Purina 14-Year Lifespan Study on Lean Body Condition'
  },
  {
    id: 'ma_blood_baseline',
    stage: 'Mature Adult',
    minAge: 4,
    maxAge: 7,
    type: 'bloodwork',
    title: 'Adult Chemistry Screen & Complete Blood Count (CBC Baseline)',
    frequency: 'Every 12 - 24 Months',
    urgency: 'medium',
    description: 'Baseline organ profile measuring ALT/ALKP liver enzymes, BUN/Creatinine kidney markers, blood glucose, and electrolyte balance.',
    checklist: ['Fast dog for 8-10 hours prior to blood draw (water permitted)', 'Measure baseline blood pressure'],
    clinicalReference: 'WSAVA Preventative Clinical Pathology Guidelines'
  },
  {
    id: 'ma_joint_palpation',
    stage: 'Mature Adult',
    minAge: 4,
    maxAge: 7,
    type: 'wellness',
    title: 'Orthopedic Palpation & Early Osteoarthritis Screening',
    frequency: 'Every 12 Months',
    urgency: 'medium',
    description: 'Detection of sub-clinical joint crepitus, hip extension pain, or stifle laxity before visible limping or stiffness develops.',
    checklist: ['Report any hesitation on stairs or getting into car', 'Discuss omega-3 fatty acid EPA/DHA joint supplementation (100mg/kg)'],
    clinicalReference: 'Canine Arthritis Management (CAM) Clinical Standards'
  },

  // Senior Milestones (7 - 10 years)
  {
    id: 'sr_biannual_wellness',
    stage: 'Senior',
    minAge: 7,
    maxAge: 10,
    type: 'senior',
    title: 'Bi-Annual Senior Wellness & Longevity Health Audit',
    frequency: 'Every 6 Months',
    urgency: 'high',
    description: 'Because dogs age 4-7 human years for every calendar year, bi-annual senior exams are equivalent to an elderly human visiting the doctor every 2-3 years.',
    checklist: ['Check for subtle lumps, cutaneous masses, or lipomas', 'Auscultate heart for new murmurs or arrhythmias', 'Evaluate lens clarity for cataracts vs. nuclear sclerosis'],
    clinicalReference: 'AAHA Senior Care Guidelines for Dogs'
  },
  {
    id: 'sr_comprehensive_lab',
    stage: 'Senior',
    minAge: 7,
    maxAge: 10,
    type: 'bloodwork',
    title: 'Senior Comprehensive Super-Panel: CBC + Chem 27 + Total T4 Thyroid + SDMA',
    frequency: 'Every 6 - 12 Months',
    urgency: 'high',
    description: 'Advanced surveillance for early hypothyroid disease, renal nephron decline via SDMA (detected at 25% loss vs 75% for creatinine), and hepatic trends.',
    checklist: ['Fast 8-12 hours prior to draw', 'Include Complete Urinalysis (Specific Gravity & UPC Ratio)', 'Check for excessive water intake or urination frequency'],
    clinicalReference: 'International Renal Interest Society (IRIS) Staging Guidelines'
  },
  {
    id: 'sr_blood_pressure',
    stage: 'Senior',
    minAge: 7,
    maxAge: 10,
    type: 'senior',
    title: 'Systolic Blood Pressure Doppler Screening',
    frequency: 'Every 6 - 12 Months',
    urgency: 'medium',
    description: 'Hypertension is the "silent killer" in senior dogs, causing retinal detachment, renal sclerosis, and hypertensive encephalopathy.',
    checklist: ['Keep dog calm and resting 10 mins before measurement', 'Target normal systolic reading: 110 - 140 mmHg'],
    clinicalReference: 'ACVIM Consensus Statement: Systemic Hypertension in Dogs'
  },
  {
    id: 'sr_mobility_pain',
    stage: 'Senior',
    minAge: 7,
    maxAge: 10,
    type: 'senior',
    title: 'Canine Brief Pain Inventory (CBPI) & Multimodal Arthritis Care',
    frequency: 'Every 6 Months',
    urgency: 'high',
    description: 'Proactive pain management using multimodal therapy (NSAIDs, Librela bedinvetmab monoclonal antibody, chondroprotectants, ramps).',
    checklist: ['Review morning stiffness duration', 'Check for slipping on hardwood floors', 'Inspect nail length and paw pad grip'],
    clinicalReference: 'University of Pennsylvania CBPI Validation Studies'
  },

  // Geriatric Milestones (10+ years)
  {
    id: 'gr_quarterly_care',
    stage: 'Geriatric',
    minAge: 10,
    maxAge: 25,
    type: 'senior',
    title: 'Quarterly Palliative Care & Quality of Life Review',
    frequency: 'Every 3 - 4 Months',
    urgency: 'high',
    description: 'Compassionate focus on dignity, comfort, pain relief, hydration, restful sleep, and appetite preservation.',
    checklist: ['Review HHHHHMM Quality of Life scale scores', 'Assess hydration via skin turgor and oral mucosa', 'Adjust orthopedic bedding and home accessibility'],
    clinicalReference: 'Villalobos HHHHHMM Quality of Life Scale'
  },
  {
    id: 'gr_cognitive_dishaa',
    stage: 'Geriatric',
    minAge: 10,
    maxAge: 25,
    type: 'senior',
    title: 'Canine Cognitive Dysfunction (DISHAA) Assessment',
    frequency: 'Every 6 Months',
    urgency: 'high',
    description: 'Surveillance for canine dementia / Alzheimer’s-like changes: Disorientation, Interactions, Sleep-wake cycles, House-soiling, Activity, Anxiety.',
    checklist: ['Report night-time pacing or vocalizing', 'Observe staring at walls or getting stuck behind doors', 'Discuss neuro-protective diets (MCT oils & antioxidants)'],
    clinicalReference: 'Landsberg et al. Canine Cognitive Dysfunction Syndrome'
  },
  {
    id: 'gr_cardiac_staging',
    stage: 'Geriatric',
    minAge: 10,
    maxAge: 25,
    type: 'specialist',
    title: 'Cardiopulmonary Auscultation & Thoracic Radiograph Survey',
    frequency: 'Every 6 Months',
    urgency: 'high',
    description: 'Staging of Myxomatous Mitral Valve Disease (MMVD) or Dilated Cardiomyopathy before congestive heart failure symptoms occur.',
    checklist: ['Count resting sleeping respiratory rate (normal < 30 breaths/min)', 'Listen for soft cough after drinking or resting'],
    clinicalReference: 'ACVIM Guidelines for the Diagnosis and Treatment of Canine MMVD'
  }
];

export default function VetAppointmentsMilestones({
  breed,
  currentAge,
  petName = 'Bella',
  currentWeight,
  weightUnit = 'lbs',
  bcsScore = 5
}: VetAppointmentsMilestonesProps) {
  // Determine health stage based on age and breed size category
  const determineHealthStage = (age: number, size: string): HealthStage => {
    const isGiant = size === 'giant';
    const isLarge = size === 'large';
    
    if (age < (isGiant ? 1.5 : 1)) return 'Puppy';
    if (age < (isGiant ? 3 : 4)) return 'Young Adult';
    if (age < (isGiant ? 6 : isLarge ? 7 : 8)) return 'Mature Adult';
    if (age < (isGiant ? 8 : isLarge ? 10 : 11)) return 'Senior';
    return 'Geriatric';
  };

  const currentStage = determineHealthStage(currentAge, breed.size);

  // Filter view state
  const [activeTab, setActiveTab] = useState<'timeline' | 'upcoming' | 'completed' | 'add'>('timeline');
  const [selectedStageFilter, setSelectedStageFilter] = useState<HealthStage>(currentStage);
  const [appointments, setAppointments] = useState<VetAppointment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; type: 'success' | 'info' } | null>(null);

  // New Appointment Form State
  const [newTitle, setNewTitle] = useState<string>('');
  const [newType, setNewType] = useState<VetAppointment['type']>('wellness');
  const [newDate, setNewDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14); // Default to 2 weeks ahead
    return d.toISOString().split('T')[0];
  });
  const [newTime, setNewTime] = useState<string>('10:00');
  const [newClinic, setNewClinic] = useState<string>('VCA Animal Hospital');
  const [newVet, setNewVet] = useState<string>('Dr. James Barnes, DVM');
  const [newNotes, setNewNotes] = useState<string>('');
  const [selectedChecklist, setSelectedChecklist] = useState<string[]>([
    'Bring fresh morning stool sample',
    'Bring current vaccination card / records'
  ]);

  // Load appointments from Firebase & Local Cache on mount
  useEffect(() => {
    loadAppointments();
  }, [petName, breed.name]);

  const loadAppointments = async () => {
    setIsLoading(true);
    try {
      const list = await getVetAppointments(petName, breed.name);
      setAppointments(list);
    } catch (err) {
      console.warn('Failed to load vet appointments:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const showNotification = (text: string, type: 'success' | 'info' = 'success') => {
    setFeedbackMsg({ text, type });
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  // Quick-Schedule a recommended clinical milestone
  const handleQuickScheduleMilestone = (milestone: MilestoneTemplate) => {
    setNewTitle(milestone.title);
    setNewType(milestone.type);
    setNewNotes(`${milestone.description}\nClinical Reference: ${milestone.clinicalReference}`);
    setSelectedChecklist([...milestone.checklist]);
    
    // Set date to 2-3 weeks from now
    const d = new Date();
    d.setDate(d.getDate() + 14);
    setNewDate(d.toISOString().split('T')[0]);
    
    setActiveTab('add');
    showNotification(`Populated scheduler with: ${milestone.title}`, 'info');
  };

  // Submit new appointment
  const handleCreateAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setIsSaving(true);
    try {
      const itemToSave: Omit<VetAppointment, 'id' | 'timestamp'> = {
        petName,
        breed: breed.name,
        dogAge: currentAge,
        healthStage: currentStage,
        title: newTitle.trim(),
        type: newType,
        date: newDate,
        time: newTime,
        clinicName: newClinic.trim(),
        vetName: newVet.trim(),
        notes: newNotes.trim(),
        checklist: selectedChecklist,
        status: 'upcoming',
        isRecommended: false
      };

      const result = await saveVetAppointment(itemToSave);
      await loadAppointments();
      setActiveTab('upcoming');
      showNotification(`✅ Appointment booked for ${petName} on ${newDate}!`, 'success');
      
      // Reset some fields
      setNewTitle('');
      setNewNotes('');
    } catch (err: any) {
      console.error('Failed to save appointment:', err);
      showNotification('Notice: Saved to local records', 'info');
    } finally {
      setIsSaving(false);
    }
  };

  // Toggle status (Completed / Upcoming)
  const handleToggleComplete = async (appt: VetAppointment) => {
    const nextStatus = appt.status === 'completed' ? 'upcoming' : 'completed';
    const completedAt = nextStatus === 'completed' ? new Date().toISOString() : undefined;
    
    if (appt.id) {
      await updateVetAppointmentStatus(appt.id, nextStatus, completedAt);
      await loadAppointments();
      showNotification(
        nextStatus === 'completed' 
          ? `🎉 Milestone marked as completed for ${petName}!` 
          : 'Appointment moved back to upcoming', 
        'success'
      );
    }
  };

  // Delete an appointment
  const handleDeleteAppointment = async (id?: string) => {
    if (!id) return;
    if (confirm('Are you sure you want to remove this appointment record?')) {
      await deleteVetAppointment(id);
      await loadAppointments();
      showNotification('Appointment removed', 'info');
    }
  };

  // Export to Calendar (.ICS file generation)
  const handleExportToCalendar = (appt: VetAppointment) => {
    try {
      const startDateTime = `${appt.date.replace(/-/g, '')}T${(appt.time || '10:00').replace(':', '')}00`;
      // End 1 hour later
      const hour = parseInt((appt.time || '10:00').split(':')[0]) + 1;
      const endDateTime = `${appt.date.replace(/-/g, '')}T${hour < 10 ? '0' : ''}${hour}${(appt.time || '10:00').split(':')[1]}00`;

      const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//DogHealthOS//Veterinary Milestones//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'BEGIN:VEVENT',
        `SUMMARY:🩺 ${appt.title} - ${appt.petName} (${appt.breed})`,
        `DESCRIPTION:${(appt.notes || 'Veterinary care milestone').replace(/\n/g, '\\n')}\\nChecklist: ${(appt.checklist || []).join(', ')}`,
        `LOCATION:${appt.clinicName || 'Veterinary Clinic'}`,
        `DTSTART:${startDateTime}`,
        `DTEND:${endDateTime}`,
        'STATUS:CONFIRMED',
        'BEGIN:VALARM',
        'TRIGGER:-PT24H',
        'ACTION:DISPLAY',
        `DESCRIPTION:Reminder: ${appt.title} for ${appt.petName} tomorrow`,
        'END:VALARM',
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\r\n');

      const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Vet_${appt.petName}_${appt.title.replace(/[^a-zA-Z0-9]/g, '_')}.ics`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      logUserAction('Export Appointment to Calendar', { title: appt.title, date: appt.date });
      showNotification('📅 Calendar invite (.ICS) downloaded! Open to add to your calendar.', 'success');
    } catch (err) {
      console.error('ICS Export error:', err);
    }
  };

  // Print Pre-Visit Clinical Sheet safely without window.open
  const handlePrintVisitSheet = (appt: VetAppointment) => {
    try {
      const iframe = document.createElement('iframe');
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = '0';
      document.body.appendChild(iframe);

      const doc = iframe.contentWindow?.document;
      if (!doc) return;

      doc.open();
      doc.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Veterinary Visit Preparation Sheet - ${appt.petName}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 30px; color: #111; line-height: 1.5; }
            .header { border-bottom: 3px solid #2D8C6F; padding-bottom: 12px; margin-bottom: 20px; display: flex; justify-content: space-between; }
            h1 { margin: 0; font-size: 20px; text-transform: uppercase; color: #111; }
            .badge { display: inline-block; background: #e6f4ea; color: #137333; padding: 4px 10px; border-radius: 4px; font-weight: bold; font-size: 11px; }
            .meta-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px; font-size: 12px; }
            .meta-item strong { display: block; font-size: 10px; text-transform: uppercase; color: #666; }
            .section { margin-bottom: 20px; }
            .section-title { font-size: 13px; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #ddd; padding-bottom: 4px; margin-bottom: 10px; color: #2D8C6F; }
            ul { margin: 0; padding-left: 20px; font-size: 12px; }
            li { margin-bottom: 6px; }
            .footer { font-size: 10px; color: #777; border-top: 1px solid #eee; padding-top: 15px; margin-top: 30px; text-align: center; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h1>DogHealthOS • Clinical Visit Intake Sheet</h1>
              <div style="font-size: 12px; color: #555; margin-top: 4px;">Prepared for Attending Veterinarian: ${appt.vetName || 'Clinician'} • ${appt.clinicName || 'Veterinary Hospital'}</div>
            </div>
            <span class="badge">Appointment: ${appt.date} at ${appt.time || '10:00 AM'}</span>
          </div>

          <div class="meta-grid">
            <div class="meta-item"><strong>Patient Name</strong> ${appt.petName}</div>
            <div class="meta-item"><strong>Breed Cohort</strong> ${appt.breed}</div>
            <div class="meta-item"><strong>Current Age / Stage</strong> ${appt.dogAge} yrs (${appt.healthStage})</div>
            <div class="meta-item"><strong>Body Condition</strong> ${bcsScore}/9 (Target: 4-5)</div>
          </div>

          <div class="section">
            <div class="section-title">Primary Clinical Procedure / Milestone</div>
            <div style="font-size: 14px; font-weight: bold; color: #111;">${appt.title}</div>
            <div style="font-size: 12px; color: #444; margin-top: 4px;">Classification: ${appt.type.toUpperCase()} • Stage Recommendation</div>
          </div>

          ${appt.notes ? `
            <div class="section">
              <div class="section-title">Pre-Visit Notes & Owner Observations</div>
              <p style="font-size: 12px; white-space: pre-wrap;">${appt.notes}</p>
            </div>
          ` : ''}

          ${appt.checklist && appt.checklist.length > 0 ? `
            <div class="section">
              <div class="section-title">Pre-Appointment Verification Checklist</div>
              <ul>
                ${appt.checklist.map(c => `<li>[ ] ${c}</li>`).join('')}
              </ul>
            </div>
          ` : ''}

          <div class="section">
            <div class="section-title">Doctor Auscultation & Clinical Findings Notes</div>
            <div style="border: 1px dashed #aaa; height: 110px; border-radius: 6px; padding: 10px; font-size: 11px; color: #999;">
              Physician physical auscultation notes, heart murmur score (1-6), dental calculus staging, lymph nodes, and prescription refills...
            </div>
          </div>

          <div class="footer">
            Standards Reference: AAHA Canine Life Stage Guidelines • AVMA Animal Health Standards • NRC 2006 Nutritional Thresholds.
          </div>
        </body>
        </html>
      `);
      doc.close();
      iframe.contentWindow?.focus();
      setTimeout(() => {
        try {
          iframe.contentWindow?.print();
        } catch (_) {}
        setTimeout(() => {
          try { iframe.remove(); } catch (_) {}
        }, 2000);
      }, 300);
    } catch (printErr) {
      console.warn("Notice during visit sheet print:", printErr);
    }
  };

  // Helper for computing relative day countdown
  const getDaysUntil = (dateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(dateStr);
    target.setHours(0, 0, 0, 0);
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return { label: 'TODAY', color: 'bg-rose-500 text-white' };
    if (diffDays === 1) return { label: 'TOMORROW', color: 'bg-amber-500 text-black' };
    if (diffDays > 1 && diffDays <= 7) return { label: `IN ${diffDays} DAYS`, color: 'bg-emerald-500 text-white' };
    if (diffDays > 7 && diffDays <= 30) return { label: `IN ${Math.round(diffDays / 7)} WEEKS`, color: 'bg-sky-500/20 text-sky-700 dark:text-sky-300' };
    if (diffDays > 30) return { label: `${dateStr}`, color: 'bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300' };
    return { label: `OVERDUE BY ${Math.abs(diffDays)} DAYS`, color: 'bg-rose-600 text-white animate-pulse' };
  };

  // Recommended milestones for selected stage
  const recommendedForStage = CLINICAL_MILESTONES.filter(m => m.stage === selectedStageFilter);
  const upcomingAppointments = appointments.filter(a => a.status === 'upcoming');
  const completedAppointments = appointments.filter(a => a.status === 'completed');

  // Stages for timeline bar
  const STAGES: HealthStage[] = ['Puppy', 'Young Adult', 'Mature Adult', 'Senior', 'Geriatric'];

  return (
    <div className="md:col-span-3 border-[2.5px] border-[#1A1A1A] dark:border-[#F0ECE6] shadow-[4px_4px_0_#1A1A1A] dark:shadow-[4px_4px_0_#F0ECE6] rounded-xl overflow-hidden bg-white/70 dark:bg-[#1E1B18]/80 backdrop-blur-md p-5 sm:p-6 space-y-6">
      
      {/* 1. Header Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#1A1A1A]/10 dark:border-white/10 pb-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-[#2D8C6F] text-white flex items-center justify-center font-bold shadow-[1.5px_1.5px_0_#1A1A1A]">
              <Stethoscope className="w-4 h-4" />
            </span>
            <h3 className="text-base sm:text-lg font-black uppercase tracking-tight text-[#1A1A1A] dark:text-[#F0ECE6]">
              Vet Appointments & Milestones Scheduler
            </h3>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30 text-[0.62rem] font-mono font-black uppercase">
              AAHA / WSAVA Protocols
            </span>
          </div>
          <p className="text-xs text-[#8A8680] dark:text-[#9A9590]">
            Age-calibrated preventative veterinary guidance and appointment logging tailored to <strong className="text-[#1A1A1A] dark:text-[#F0ECE6]">{petName}</strong> ({currentAge} yrs • <span className="font-semibold text-emerald-600 dark:text-emerald-400">{currentStage}</span>).
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab('timeline')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold cursor-pointer transition-all flex items-center gap-1.5 ${
              activeTab === 'timeline'
                ? 'bg-[#2D8C6F] text-white shadow-sm'
                : 'text-stone-600 dark:text-stone-400 hover:text-black dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Stage Milestones</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('upcoming')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold cursor-pointer transition-all flex items-center gap-1.5 ${
              activeTab === 'upcoming'
                ? 'bg-[#1A1A1A] dark:bg-[#F0ECE6] text-white dark:text-black shadow-sm'
                : 'text-stone-600 dark:text-stone-400 hover:text-black dark:hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Upcoming ({upcomingAppointments.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('completed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold cursor-pointer transition-all flex items-center gap-1.5 ${
              activeTab === 'completed'
                ? 'bg-[#1A1A1A] dark:bg-[#F0ECE6] text-white dark:text-black shadow-sm'
                : 'text-stone-600 dark:text-stone-400 hover:text-black dark:hover:text-white'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Completed ({completedAppointments.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('add')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-black cursor-pointer transition-all flex items-center gap-1.5 ${
              activeTab === 'add'
                ? 'bg-[#FF6B4A] text-white shadow-sm'
                : 'bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-700 dark:text-emerald-300'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Schedule New</span>
          </button>
        </div>
      </div>

      {/* Floating Feedback Notification */}
      {feedbackMsg && (
        <div className={`p-3 rounded-lg border text-xs font-bold flex items-center justify-between animate-[fadeIn_0.2s_ease-out] ${
          feedbackMsg.type === 'success' 
            ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-900 dark:text-emerald-200' 
            : 'bg-sky-500/15 border-sky-500/30 text-sky-900 dark:text-sky-200'
        }`}>
          <span>{feedbackMsg.text}</span>
          <button onClick={() => setFeedbackMsg(null)} className="cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 2. Interactive Life-Stage Progression Banner */}
      <div className="bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 rounded-xl p-3.5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <span className="font-mono font-black uppercase tracking-wider text-stone-500">
            Clinical Life-Stage Trajectory & Longevity Roadmap
          </span>
          <span className="text-[0.68rem] font-bold text-stone-600 dark:text-stone-400">
            {petName} is currently <strong className="text-emerald-600 dark:text-emerald-400 font-black">{currentAge} yrs old</strong> ({currentStage})
          </span>
        </div>

        {/* Life Stages Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
          {STAGES.map((stg) => {
            const isCurrent = currentStage === stg;
            const isSelected = selectedStageFilter === stg;
            return (
              <button
                key={stg}
                type="button"
                onClick={() => {
                  setSelectedStageFilter(stg);
                  if (activeTab !== 'timeline') setActiveTab('timeline');
                }}
                className={`p-2 rounded-lg border-2 text-center cursor-pointer transition-all relative ${
                  isSelected
                    ? 'border-[#2D8C6F] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100 font-black shadow-sm'
                    : 'border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-800/50 text-stone-600 dark:text-stone-400'
                }`}
              >
                {isCurrent && (
                  <span className="absolute -top-2 right-2 px-1.5 py-0.2 rounded-full bg-[#FF6B4A] text-white text-[0.55rem] font-black uppercase tracking-widest shadow-sm">
                    Current
                  </span>
                )}
                <span className="text-[0.72rem] block font-bold truncate">{stg}</span>
                <span className="text-[0.58rem] font-mono text-stone-500 dark:text-stone-400 block mt-0.5">
                  {stg === 'Puppy' ? '0 - 1y' : stg === 'Young Adult' ? '1 - 4y' : stg === 'Mature Adult' ? '4 - 7y' : stg === 'Senior' ? '7 - 10y' : '10y+'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. TAB CONTENT */}

      {/* TAB A: Life-Stage Milestones & Recommendations */}
      {activeTab === 'timeline' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-black uppercase text-[#1A1A1A] dark:text-[#F0ECE6]">
                Recommended Clinical Milestones: {selectedStageFilter} Stage
              </span>
              <span className="px-2 py-0.5 rounded-full bg-stone-200 dark:bg-stone-800 text-[0.62rem] font-mono font-bold">
                {recommendedForStage.length} Recommended Interventions
              </span>
            </div>
            {selectedStageFilter !== currentStage && (
              <button
                type="button"
                onClick={() => setSelectedStageFilter(currentStage)}
                className="text-xs text-emerald-600 dark:text-emerald-400 font-bold hover:underline cursor-pointer"
              >
                Reset to Current Stage ({currentStage})
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {recommendedForStage.map((milestone) => {
              // Check if already logged in upcoming or completed
              const isAlreadyLogged = appointments.some(a => a.title.toLowerCase().includes(milestone.title.toLowerCase().slice(0, 20)));

              return (
                <div
                  key={milestone.id}
                  className="p-4 rounded-xl border-2 border-stone-200 dark:border-stone-800 bg-white dark:bg-[#1D1A17] hover:border-emerald-500/50 transition-all flex flex-col justify-between space-y-3 shadow-sm group"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold ${
                          milestone.type === 'vaccine' ? 'bg-purple-100 text-purple-700' :
                          milestone.type === 'bloodwork' ? 'bg-rose-100 text-rose-700' :
                          milestone.type === 'dental' ? 'bg-cyan-100 text-cyan-700' :
                          milestone.type === 'senior' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {milestone.type === 'vaccine' ? <Syringe className="w-3.5 h-3.5" /> :
                           milestone.type === 'bloodwork' ? <Activity className="w-3.5 h-3.5" /> :
                           milestone.type === 'dental' ? <Sparkles className="w-3.5 h-3.5" /> :
                           milestone.type === 'senior' ? <Heart className="w-3.5 h-3.5" /> : <Stethoscope className="w-3.5 h-3.5" />}
                        </span>
                        <span className="text-[0.62rem] font-mono font-black uppercase text-stone-500">
                          {milestone.frequency}
                        </span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[0.55rem] font-mono font-bold uppercase tracking-wider ${
                        milestone.urgency === 'high' 
                          ? 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-500/20' 
                          : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20'
                      }`}>
                        {milestone.urgency === 'high' ? 'Priority Standard' : 'Preventative'}
                      </span>
                    </div>

                    <h4 className="font-extrabold text-xs text-[#1A1A1A] dark:text-[#F0ECE6] leading-snug">
                      {milestone.title}
                    </h4>

                    <p className="text-[0.7rem] text-stone-600 dark:text-stone-300 leading-relaxed">
                      {milestone.description}
                    </p>

                    {/* Pre-visit checklist summary */}
                    <div className="pt-1 border-t border-stone-100 dark:border-stone-800/80">
                      <span className="text-[0.6rem] font-mono font-bold uppercase text-stone-400 block mb-1">
                        Pre-Visit Protocol Checklist:
                      </span>
                      <ul className="text-[0.65rem] space-y-0.5 text-stone-500 dark:text-stone-400">
                        {milestone.checklist.slice(0, 2).map((c, i) => (
                          <li key={i} className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                            <span className="truncate">{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-stone-100 dark:border-stone-800">
                    <span className="text-[0.58rem] font-mono text-stone-400 truncate max-w-[180px]">
                      Ref: {milestone.clinicalReference}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleQuickScheduleMilestone(milestone)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold cursor-pointer transition-all flex items-center gap-1 shadow-sm active:scale-95 ${
                        isAlreadyLogged
                          ? 'bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-300'
                          : 'bg-[#2D8C6F] hover:bg-[#25735c] text-white'
                      }`}
                    >
                      <Plus className="w-3 h-3" />
                      <span>{isAlreadyLogged ? 'Log Again' : 'Quick Schedule'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB B: Upcoming Appointments List */}
      {activeTab === 'upcoming' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-black uppercase text-[#1A1A1A] dark:text-[#F0ECE6]">
              Upcoming Scheduled Visits & Active Milestones ({upcomingAppointments.length})
            </h4>
            <button
              type="button"
              onClick={() => setActiveTab('add')}
              className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Appointment</span>
            </button>
          </div>

          {upcomingAppointments.length === 0 ? (
            <div className="p-8 text-center bg-stone-50 dark:bg-stone-900/40 rounded-xl border-2 border-dashed border-stone-200 dark:border-stone-800 space-y-3">
              <CalendarCheck className="w-10 h-10 text-stone-400 mx-auto" />
              <h5 className="font-bold text-sm text-stone-700 dark:text-stone-300">No Upcoming Appointments Logged</h5>
              <p className="text-xs text-stone-500 max-w-md mx-auto leading-relaxed">
                Stay proactive with {petName}'s preventative care. Check the <strong>Stage Milestones</strong> tab above to view recommended vaccinations and exams for {petName}'s age cohort ({currentAge} yrs).
              </p>
              <button
                type="button"
                onClick={() => setActiveTab('timeline')}
                className="px-4 py-2 rounded-lg bg-[#2D8C6F] hover:bg-[#25735c] text-white font-mono text-xs font-bold cursor-pointer transition-all inline-flex items-center gap-1.5 shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Explore {currentStage} Recommendations</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingAppointments.map((appt) => {
                const countdown = getDaysUntil(appt.date);
                return (
                  <div
                    key={appt.id}
                    className="p-4 rounded-xl border-2 border-[#1A1A1A] dark:border-stone-700 bg-white dark:bg-[#1D1A17] shadow-[3px_3px_0_#1A1A1A] dark:shadow-[3px_3px_0_#F0ECE6] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all"
                  >
                    {/* Left Details */}
                    <div className="space-y-2 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[0.62rem] font-mono font-black uppercase ${countdown.color}`}>
                          {countdown.label}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-[0.62rem] font-mono font-bold text-stone-600 dark:text-stone-400 uppercase">
                          {appt.type}
                        </span>
                        <span className="text-xs font-mono font-bold text-stone-500">
                          📅 {appt.date} • ⏰ {appt.time || '10:00 AM'}
                        </span>
                      </div>

                      <h4 className="font-extrabold text-sm text-[#1A1A1A] dark:text-[#F0ECE6] leading-tight">
                        {appt.title}
                      </h4>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-600 dark:text-stone-400 font-mono">
                        {appt.clinicName && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-[#2D8C6F]" />
                            <span>{appt.clinicName}</span>
                          </span>
                        )}
                        {appt.vetName && (
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3 text-amber-600" />
                            <span>{appt.vetName}</span>
                          </span>
                        )}
                      </div>

                      {appt.notes && (
                        <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-2 leading-relaxed">
                          {appt.notes}
                        </p>
                      )}

                      {appt.checklist && appt.checklist.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {appt.checklist.map((c, i) => (
                            <span key={i} className="px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-[0.62rem] font-sans text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700 flex items-center gap-1">
                              <span>✓</span> {c}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Right Action Buttons */}
                    <div className="flex flex-wrap md:flex-col items-end gap-2 shrink-0 w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-stone-100 dark:border-stone-800">
                      <button
                        type="button"
                        onClick={() => handleToggleComplete(appt)}
                        className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                        title="Mark procedure or exam as completed"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Mark Completed</span>
                      </button>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleExportToCalendar(appt)}
                          className="px-2.5 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 hover:bg-stone-100 text-stone-700 dark:text-stone-300 font-mono text-[0.65rem] font-bold flex items-center gap-1 cursor-pointer"
                          title="Download .ICS calendar invite (Google/Apple Calendar)"
                        >
                          <Calendar className="w-3 h-3 text-sky-600" />
                          <span>.ICS Sync</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handlePrintVisitSheet(appt)}
                          className="px-2.5 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 hover:bg-stone-100 text-stone-700 dark:text-stone-300 font-mono text-[0.65rem] font-bold flex items-center gap-1 cursor-pointer"
                          title="Print intake care summary for vet clinic"
                        >
                          <Printer className="w-3 h-3 text-amber-600" />
                          <span>Intake Sheet</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteAppointment(appt.id)}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer"
                          title="Delete appointment"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB C: Completed Milestones Archive */}
      {activeTab === 'completed' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-black uppercase text-[#1A1A1A] dark:text-[#F0ECE6]">
              Completed Clinical Milestones & Vaccination Log ({completedAppointments.length})
            </h4>
            <span className="text-xs text-stone-500 font-mono">
              Official Veterinary History
            </span>
          </div>

          {completedAppointments.length === 0 ? (
            <div className="p-8 text-center bg-stone-50 dark:bg-stone-900/40 rounded-xl border-2 border-dashed border-stone-200 dark:border-stone-800 space-y-2">
              <CheckCircle2 className="w-10 h-10 text-stone-400 mx-auto" />
              <h5 className="font-bold text-sm text-stone-700 dark:text-stone-300">No Completed Records Yet</h5>
              <p className="text-xs text-stone-500 max-w-md mx-auto">
                When {petName} finishes a check-up or vaccination, mark it as completed to build their permanent verifiable clinical health record.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {completedAppointments.map((appt) => (
                <div
                  key={appt.id}
                  className="p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-emerald-50/30 dark:bg-emerald-950/10 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                      <Check className="w-4 h-4 font-black" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-xs text-stone-800 dark:text-stone-200 font-bold">{appt.title}</strong>
                        <span className="text-[0.6rem] font-mono px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 uppercase">
                          {appt.type}
                        </span>
                      </div>
                      <div className="text-[0.65rem] font-mono text-stone-500 mt-0.5">
                        Completed: {appt.date} {appt.clinicName ? `• ${appt.clinicName}` : ''} {appt.vetName ? `(${appt.vetName})` : ''}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleComplete(appt)}
                      className="text-[0.65rem] text-stone-500 hover:text-stone-800 dark:hover:text-stone-300 underline font-mono cursor-pointer"
                    >
                      Reopen
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteAppointment(appt.id)}
                      className="p-1 rounded text-stone-400 hover:text-rose-500 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB D: Schedule New Appointment Form */}
      {activeTab === 'add' && (
        <form onSubmit={handleCreateAppointment} className="p-4 sm:p-5 bg-stone-50 dark:bg-stone-900/60 rounded-xl border-2 border-[#1A1A1A] dark:border-stone-700 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#2D8C6F]" />
              <h4 className="text-sm font-black uppercase text-[#1A1A1A] dark:text-[#F0ECE6]">
                Schedule New Check-up or Vaccination for {petName}
              </h4>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('timeline')}
              className="text-stone-500 hover:text-black dark:hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Procedure / Milestone Title */}
            <div className="sm:col-span-2">
              <label className="block text-[0.65rem] font-mono font-bold uppercase text-stone-600 dark:text-stone-400 mb-1">
                Procedure / Appointment Title *
              </label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Annual Comprehensive Wellness Exam & 4Dx Heartworm Screen"
                className="w-full p-2.5 text-xs font-bold bg-white dark:bg-stone-800 border-2 border-[#1A1A1A] dark:border-stone-700 rounded-lg"
              />
            </div>

            {/* Appointment Category */}
            <div>
              <label className="block text-[0.65rem] font-mono font-bold uppercase text-stone-600 dark:text-stone-400 mb-1">
                Appointment Category
              </label>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value as any)}
                className="w-full p-2.5 text-xs font-bold bg-white dark:bg-stone-800 border-2 border-[#1A1A1A] dark:border-stone-700 rounded-lg cursor-pointer"
              >
                <option value="wellness">🩺 Routine Physical Wellness Exam</option>
                <option value="vaccine">💉 Core / Lifestyle Vaccination</option>
                <option value="dental">🦷 Dental Scaling & Oral Prophylaxis</option>
                <option value="bloodwork">🔬 Blood Chemistry & Lab Screen</option>
                <option value="senior">👴 Senior / Geriatric Comprehensive Audit</option>
                <option value="specialist">🧬 Specialty Consultation (Cardio, Ortho, Oncology)</option>
                <option value="triage">🚨 Emergency / Acute Follow-up</option>
                <option value="milestone">🏆 Milestone / Microchip Check</option>
              </select>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[0.65rem] font-mono font-bold uppercase text-stone-600 dark:text-stone-400 mb-1">
                  Scheduled Date *
                </label>
                <input
                  type="date"
                  required
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full p-2 text-xs font-mono font-bold bg-white dark:bg-stone-800 border-2 border-[#1A1A1A] dark:border-stone-700 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-[0.65rem] font-mono font-bold uppercase text-stone-600 dark:text-stone-400 mb-1">
                  Time
                </label>
                <input
                  type="time"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full p-2 text-xs font-mono font-bold bg-white dark:bg-stone-800 border-2 border-[#1A1A1A] dark:border-stone-700 rounded-lg"
                />
              </div>
            </div>

            {/* Clinic Name */}
            <div>
              <label className="block text-[0.65rem] font-mono font-bold uppercase text-stone-600 dark:text-stone-400 mb-1">
                Veterinary Clinic / Animal Hospital
              </label>
              <input
                type="text"
                value={newClinic}
                onChange={(e) => setNewClinic(e.target.value)}
                placeholder="e.g. VCA Animal Hospital / Community Vet"
                className="w-full p-2.5 text-xs font-bold bg-white dark:bg-stone-800 border-2 border-[#1A1A1A] dark:border-stone-700 rounded-lg"
              />
            </div>

            {/* Attending Vet */}
            <div>
              <label className="block text-[0.65rem] font-mono font-bold uppercase text-stone-600 dark:text-stone-400 mb-1">
                Attending Veterinarian
              </label>
              <input
                type="text"
                value={newVet}
                onChange={(e) => setNewVet(e.target.value)}
                placeholder="e.g. Dr. Barnes, DVM"
                className="w-full p-2.5 text-xs font-bold bg-white dark:bg-stone-800 border-2 border-[#1A1A1A] dark:border-stone-700 rounded-lg"
              />
            </div>

            {/* Clinical Notes & Questions */}
            <div className="sm:col-span-2">
              <label className="block text-[0.65rem] font-mono font-bold uppercase text-stone-600 dark:text-stone-400 mb-1">
                Pre-Visit Checklist Notes & Questions for Doctor
              </label>
              <textarea
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                rows={3}
                placeholder="e.g. Fast 8 hours for bloodwork. Ask doctor about morning joint stiffness and switch to senior omega-3 supplements..."
                className="w-full p-2.5 text-xs font-mono bg-white dark:bg-stone-800 border-2 border-[#1A1A1A] dark:border-stone-700 rounded-lg"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-200 dark:border-stone-800">
            <button
              type="button"
              onClick={() => setActiveTab('timeline')}
              className="px-4 py-2 rounded-lg text-xs font-mono font-bold text-stone-600 dark:text-stone-400 hover:text-black dark:hover:text-white cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2.5 rounded-lg bg-[#2D8C6F] hover:bg-[#25735c] text-white font-mono text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-[2px_2px_0_#1A1A1A] disabled:opacity-50 active:scale-95 transition-all"
            >
              {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CalendarCheck className="w-4 h-4" />}
              <span>Save Appointment & Add to Schedule</span>
            </button>
          </div>
        </form>
      )}

    </div>
  );
}
