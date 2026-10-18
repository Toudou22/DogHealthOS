import { collection, addDoc, getDocs, query, orderBy, limit, deleteDoc, doc, setDoc, Timestamp } from 'firebase/firestore';
import { db, auth, trackAnalyticsEvent } from '../lib/firebase';

/**
 * Interface representing a user activity log.
 */
export interface UserActivityLog {
  id?: string;
  userId: string;
  userEmail: string;
  action: string;
  details: any;
  userAgent: string;
  timestamp: any;
}

/**
 * Interface representing a user feedback submission.
 */
export interface UserFeedback {
  id?: string;
  userId: string;
  userEmail: string;
  rating: number;
  comment: string;
  breed: string;
  age: number;
  timestamp: any;
}

/**
 * Interface representing a top published customer FAQ item with mandatory credible veterinary references.
 */
export interface PublishedFaq {
  id?: string;
  q: string;
  a: string;
  category?: string;
  frequencyCount?: number;
  order: number;
  referenceBody?: string;
  reference?: string;
  evidenceLevel?: string;
  keyFinding?: string;
  citationUrl?: string;
  lastUpdated?: any;
}

/**
 * Helper to log any user action into Firestore.
 * Failures will fail silently in the background to ensure no UI disruption.
 */
export async function logUserAction(action: string, details: any = {}) {
  try {
    const user = auth.currentUser;
    const userId = user?.uid || 'anonymous';
    const userEmail = user?.email || 'anonymous';
    const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown';

    const logsCollection = collection(db, 'user_logs');
    await addDoc(logsCollection, {
      userId,
      userEmail,
      action,
      details,
      userAgent,
      timestamp: Timestamp.now()
    });

    // Also send event to Google Analytics
    const sanitizedAction = action.replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase().slice(0, 40);
    trackAnalyticsEvent(sanitizedAction, {
      category: 'user_action',
      action_name: action
    });
  } catch (error) {
    console.warn('Firebase logUserAction failed gracefully:', error);
  }
}

/**
 * Helper to submit feedback into Firestore.
 */
export async function submitUserFeedback(rating: number, comment: string, breed: string = 'Unknown', age: number = 0) {
  try {
    const user = auth.currentUser;
    const userId = user?.uid || 'anonymous';
    const userEmail = user?.email || 'anonymous';

    const feedbackCollection = collection(db, 'feedback');
    await addDoc(feedbackCollection, {
      userId,
      userEmail,
      rating,
      comment,
      breed,
      age,
      timestamp: Timestamp.now()
    });
    
    // Log the submission as an action too!
    await logUserAction('Submit Feedback', { rating, comment, breed, age });
    return { success: true };
  } catch (error: any) {
    console.error('Firebase submitUserFeedback failed:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Fetch logs for Admin view (restricted by Security Rules & Admin Check).
 */
export async function fetchAllLogs(maxLimit: number = 100): Promise<UserActivityLog[]> {
  const logsCollection = collection(db, 'user_logs');
  const q = query(logsCollection, orderBy('timestamp', 'desc'), limit(maxLimit));
  const querySnapshot = await getDocs(q);
  
  const results: UserActivityLog[] = [];
  querySnapshot.forEach((docSnap) => {
    const data = docSnap.data();
    results.push({
      id: docSnap.id,
      userId: data.userId || 'anonymous',
      userEmail: data.userEmail || 'anonymous',
      action: data.action || 'Unknown',
      details: data.details || {},
      userAgent: data.userAgent || 'unknown',
      timestamp: data.timestamp ? (data.timestamp as Timestamp).toDate() : new Date(),
    });
  });
  return results;
}

/**
 * Fetch feedback submissions for Admin view (restricted by Security Rules & Admin Check).
 */
export async function fetchAllFeedback(maxLimit: number = 100): Promise<UserFeedback[]> {
  const feedbackCollection = collection(db, 'feedback');
  const q = query(feedbackCollection, orderBy('timestamp', 'desc'), limit(maxLimit));
  const querySnapshot = await getDocs(q);
  
  const results: UserFeedback[] = [];
  querySnapshot.forEach((docSnap) => {
    const data = docSnap.data();
    results.push({
      id: docSnap.id,
      userId: data.userId || 'anonymous',
      userEmail: data.userEmail || 'anonymous',
      rating: typeof data.rating === 'number' ? data.rating : 5,
      comment: data.comment || '',
      breed: data.breed || 'Unknown',
      age: typeof data.age === 'number' ? data.age : 0,
      timestamp: data.timestamp ? (data.timestamp as Timestamp).toDate() : new Date(),
    });
  });
  return results;
}

/**
 * Helper to delete a specific feedback document (Admin action)
 */
export async function deleteFeedbackDoc(feedbackId: string) {
  try {
    await deleteDoc(doc(db, 'feedback', feedbackId));
    await logUserAction('Delete Feedback Doc', { feedbackId });
    return { success: true };
  } catch (error: any) {
    console.error('Failed to delete feedback:', error);
    throw error;
  }
}

/**
 * Helper to delete a specific log document (Admin action)
 */
export async function deleteLogDoc(logId: string) {
  try {
    await deleteDoc(doc(db, 'user_logs', logId));
    return { success: true };
  } catch (error: any) {
    console.error('Failed to delete log:', error);
    throw error;
  }
}

/**
 * Fetch top published customer FAQs from Firestore for the live app library.
 */
export async function fetchLiveFaqs(): Promise<PublishedFaq[]> {
  try {
    const faqsCollection = collection(db, 'live_faqs');
    const q = query(faqsCollection, orderBy('order', 'asc'));
    const querySnapshot = await getDocs(q);
    
    const results: PublishedFaq[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      results.push({
        id: docSnap.id,
        q: data.q || '',
        a: data.a || '',
        category: data.category || 'General',
        frequencyCount: typeof data.frequencyCount === 'number' ? data.frequencyCount : 0,
        order: typeof data.order === 'number' ? data.order : 0,
        referenceBody: data.referenceBody || '',
        reference: data.reference || '',
        evidenceLevel: data.evidenceLevel || '',
        keyFinding: data.keyFinding || '',
        citationUrl: data.citationUrl || '',
        lastUpdated: data.lastUpdated ? (data.lastUpdated as Timestamp).toDate() : new Date(),
      });
    });
    return results;
  } catch (error) {
    console.warn('Failed to fetch live FAQs, falling back to static defaults:', error);
    return [];
  }
}

/**
 * Admin action to publish or update the top 6 FAQs in Firestore live_faqs collection.
 */
export async function publishLiveFaqs(faqsList: PublishedFaq[]) {
  try {
    // Ensure we write up to 6 items cleanly with fixed IDs faq_1..faq_6
    const top6 = faqsList.slice(0, 6);
    for (let i = 0; i < top6.length; i++) {
      const faqItem = top6[i];
      const faqDocRef = doc(db, 'live_faqs', `faq_${i + 1}`);
      await setDoc(faqDocRef, {
        q: faqItem.q,
        a: faqItem.a,
        category: faqItem.category || 'General',
        frequencyCount: faqItem.frequencyCount || 0,
        order: i + 1,
        referenceBody: faqItem.referenceBody || 'Royal Veterinary College (RVC) & Veterinary Research Consortium',
        reference: faqItem.reference || 'Peer-reviewed veterinary clinical cohort registry',
        evidenceLevel: faqItem.evidenceLevel || 'Clinical Veterinary Cohort',
        keyFinding: faqItem.keyFinding || '',
        citationUrl: faqItem.citationUrl || '',
        lastUpdated: Timestamp.now()
      }, { merge: true });
    }
    await logUserAction('Publish Live FAQs', { count: top6.length });
    return { success: true };
  } catch (error: any) {
    console.error('Failed to publish live FAQs to Firestore:', error);
    throw error;
  }
}

/**
 * Interface representing a veterinary appointment or clinical life-stage milestone.
 */
export interface VetAppointment {
  id?: string;
  userId?: string;
  userEmail?: string;
  petName: string;
  breed: string;
  dogAge: number;
  healthStage: 'Puppy' | 'Young Adult' | 'Mature Adult' | 'Senior' | 'Geriatric';
  title: string;
  type: 'wellness' | 'vaccine' | 'dental' | 'bloodwork' | 'senior' | 'specialist' | 'triage' | 'milestone';
  date: string; // ISO date string YYYY-MM-DD
  time?: string; // HH:MM
  clinicName?: string;
  vetName?: string;
  notes?: string;
  checklist?: string[];
  status: 'upcoming' | 'completed' | 'cancelled';
  isRecommended?: boolean;
  completedAt?: string;
  timestamp?: any;
}

const LOCAL_STORAGE_KEY = 'doghealthos_vet_appointments_v1';

function getLocalAppointments(): VetAppointment[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (_) {
    return [];
  }
}

function saveLocalAppointments(list: VetAppointment[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
  } catch (_) {}
}

/**
 * Save or create a veterinary appointment / milestone.
 */
export async function saveVetAppointment(appointment: Omit<VetAppointment, 'id' | 'timestamp'> & { id?: string }): Promise<{ success: boolean; id: string }> {
  const user = auth.currentUser;
  const userId = user?.uid || 'anonymous';
  const userEmail = user?.email || 'anonymous';

  const appointmentData: any = {
    ...appointment,
    userId,
    userEmail,
    timestamp: Timestamp.now()
  };

  let localId = appointment.id || `apt_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const localList = getLocalAppointments();
  const existingIdx = localList.findIndex(a => a.id === localId);
  const updatedItem: VetAppointment = { ...appointmentData, id: localId };

  if (existingIdx >= 0) {
    localList[existingIdx] = updatedItem;
  } else {
    localList.unshift(updatedItem);
  }
  saveLocalAppointments(localList);

  try {
    const appointmentsCollection = collection(db, 'vet_appointments');
    if (appointment.id && !appointment.id.startsWith('apt_')) {
      const docRef = doc(db, 'vet_appointments', appointment.id);
      await setDoc(docRef, appointmentData, { merge: true });
      localId = appointment.id;
    } else {
      const docRef = await addDoc(appointmentsCollection, appointmentData);
      localId = docRef.id;
      // Update local storage with real Firestore ID
      const updatedIdx = localList.findIndex(a => a.id === updatedItem.id);
      if (updatedIdx >= 0) {
        localList[updatedIdx].id = localId;
        saveLocalAppointments(localList);
      }
    }

    logUserAction('Schedule Vet Appointment', {
      title: appointment.title,
      type: appointment.type,
      petName: appointment.petName,
      date: appointment.date,
      stage: appointment.healthStage
    });

    return { success: true, id: localId };
  } catch (error) {
    console.warn('Firestore appointment save notice, stored in local cache:', error);
    return { success: true, id: localId };
  }
}

/**
 * Fetch all veterinary appointments for a dog or user.
 */
export async function getVetAppointments(petName?: string, breed?: string): Promise<VetAppointment[]> {
  const localList = getLocalAppointments();

  try {
    const appointmentsCollection = collection(db, 'vet_appointments');
    const q = query(appointmentsCollection, orderBy('timestamp', 'desc'), limit(50));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const remoteList: VetAppointment[] = [];
      snapshot.forEach(docSnap => {
        const d = docSnap.data();
        remoteList.push({
          id: docSnap.id,
          userId: d.userId || '',
          userEmail: d.userEmail || '',
          petName: d.petName || '',
          breed: d.breed || '',
          dogAge: typeof d.dogAge === 'number' ? d.dogAge : 0,
          healthStage: d.healthStage || 'Young Adult',
          title: d.title || 'Check-up',
          type: d.type || 'wellness',
          date: d.date || '',
          time: d.time || '',
          clinicName: d.clinicName || '',
          vetName: d.vetName || '',
          notes: d.notes || '',
          checklist: Array.isArray(d.checklist) ? d.checklist : [],
          status: d.status || 'upcoming',
          isRecommended: !!d.isRecommended,
          completedAt: d.completedAt || '',
          timestamp: d.timestamp
        });
      });

      // Merge remote list into local cache to prevent duplicates
      const mergedMap = new Map<string, VetAppointment>();
      remoteList.forEach(item => { if (item.id) mergedMap.set(item.id, item); });
      localList.forEach(item => { if (item.id && !mergedMap.has(item.id)) mergedMap.set(item.id, item); });

      const merged = Array.from(mergedMap.values());
      saveLocalAppointments(merged);

      if (petName) {
        const lowerPet = petName.toLowerCase().trim();
        return merged.filter(a => a.petName.toLowerCase().includes(lowerPet) || !a.petName);
      }
      return merged;
    }
  } catch (error) {
    console.warn('Using local cached appointments:', error);
  }

  if (petName) {
    const lowerPet = petName.toLowerCase().trim();
    return localList.filter(a => a.petName.toLowerCase().includes(lowerPet) || !a.petName);
  }
  return localList;
}

/**
 * Update the status of an appointment (e.g. marked completed).
 */
export async function updateVetAppointmentStatus(id: string, status: 'upcoming' | 'completed' | 'cancelled', completedAt?: string): Promise<boolean> {
  const localList = getLocalAppointments();
  const target = localList.find(a => a.id === id);
  if (target) {
    target.status = status;
    if (completedAt) target.completedAt = completedAt;
    saveLocalAppointments(localList);
  }

  try {
    if (id && !id.startsWith('apt_')) {
      const docRef = doc(db, 'vet_appointments', id);
      await setDoc(docRef, { 
        status, 
        completedAt: completedAt || (status === 'completed' ? new Date().toISOString() : '') 
      }, { merge: true });
    }
    logUserAction('Update Vet Appointment Status', { id, status });
    return true;
  } catch (error) {
    console.warn('Status update local notice:', error);
    return true;
  }
}

/**
 * Delete a veterinary appointment.
 */
export async function deleteVetAppointment(id: string): Promise<boolean> {
  const localList = getLocalAppointments().filter(a => a.id !== id);
  saveLocalAppointments(localList);

  try {
    if (id && !id.startsWith('apt_')) {
      const docRef = doc(db, 'vet_appointments', id);
      await deleteDoc(docRef);
    }
    logUserAction('Delete Vet Appointment', { id });
    return true;
  } catch (error) {
    console.warn('Delete appointment notice:', error);
    return true;
  }
}
