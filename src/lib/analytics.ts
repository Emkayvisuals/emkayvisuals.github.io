import { collection, addDoc, doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from './firebase';

export async function trackVisit() {
  try {
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    const deviceType = isMobile ? 'Mobile' : 'Desktop';
    const lang = (navigator.language || 'en').substring(0, 5);
    const today = new Date().toISOString().split('T')[0];

    const statsRef = doc(db, 'analytics', 'summary');
    await setDoc(
      statsRef,
      {
        totalVisits: increment(1),
        [`visitsPerDay.${today}`]: increment(1),
        [`deviceTypes.${deviceType}`]: increment(1),
        [`countries.${lang}`]: increment(1),
        [`sectionsViewed.hero`]: increment(1),
      },
      { merge: true }
    );
  } catch (err) {
    console.log("Analytics tracking note:", err);
  }
}

export async function trackClick(type: 'whatsapp' | 'instagram' | 'email') {
  try {
    const statsRef = doc(db, 'analytics', 'summary');
    await setDoc(
      statsRef,
      {
        [`clicks.${type}`]: increment(1),
      },
      { merge: true }
    );
  } catch (err) {
    console.log("Click tracking note:", err);
  }
}

export async function trackSectionView(sectionName: string) {
  try {
    const statsRef = doc(db, 'analytics', 'summary');
    await setDoc(
      statsRef,
      {
        [`sectionsViewed.${sectionName}`]: increment(1),
      },
      { merge: true }
    );
  } catch (err) {
    console.log("Section view note:", err);
  }
}

export async function saveProjectBrief(brief: {
  name: string;
  email: string;
  service: string;
  budget: string;
  deadline?: string;
  message: string;
  referenceLink?: string;
}): Promise<boolean> {
  const briefData = {
    name: brief.name,
    email: brief.email,
    service: brief.service,
    budget: brief.budget,
    deadline: brief.deadline || 'Flexible',
    message: brief.message,
    referenceLink: brief.referenceLink || '',
    date: new Date().toISOString(),
    status: 'New',
    notes: '',
  };

  try {
    await addDoc(collection(db, 'briefs'), briefData);
    return true;
  } catch (err) {
    console.error("Error saving brief to Firestore briefs collection:", err);
    return false;
  }
}

