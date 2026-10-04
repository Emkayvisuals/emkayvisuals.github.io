import { collection, addDoc, doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from './firebase';

export async function trackVisit() {
  try {
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    const deviceType = isMobile ? 'Mobile' : 'Desktop';
    const lang = navigator.language || 'en';
    const today = new Date().toISOString().split('T')[0];

    const statsRef = doc(db, 'analytics', 'summary');
    const snap = await getDoc(statsRef);

    if (!snap.exists()) {
      await setDoc(statsRef, {
        totalVisits: 1,
        visitsPerDay: { [today]: 1 },
        deviceTypes: { [deviceType]: 1 },
        countries: { [lang]: 1 },
        sectionsViewed: { hero: 1 },
        clicks: { whatsapp: 0, instagram: 0, email: 0 },
      });
    } else {
      const data = snap.data();
      const visitsPerDay = data.visitsPerDay || {};
      visitsPerDay[today] = (visitsPerDay[today] || 0) + 1;

      const deviceTypes = data.deviceTypes || {};
      deviceTypes[deviceType] = (deviceTypes[deviceType] || 0) + 1;

      const countries = data.countries || {};
      countries[lang] = (countries[lang] || 0) + 1;

      await updateDoc(statsRef, {
        totalVisits: increment(1),
        visitsPerDay,
        deviceTypes,
        countries,
      });
    }
  } catch (err) {
    console.log("Analytics tracking note:", err);
  }
}

export async function trackClick(type: 'whatsapp' | 'instagram' | 'email') {
  try {
    const statsRef = doc(db, 'analytics', 'summary');
    const snap = await getDoc(statsRef);
    if (snap.exists()) {
      await updateDoc(statsRef, {
        [`clicks.${type}`]: increment(1),
      });
    } else {
      await setDoc(statsRef, {
        totalVisits: 1,
        visitsPerDay: { [new Date().toISOString().split('T')[0]]: 1 },
        deviceTypes: { Desktop: 1 },
        countries: { en: 1 },
        sectionsViewed: {},
        clicks: { whatsapp: type === 'whatsapp' ? 1 : 0, instagram: type === 'instagram' ? 1 : 0, email: type === 'email' ? 1 : 0 },
      });
    }
  } catch (err) {
    console.log("Click tracking note:", err);
  }
}

export async function trackSectionView(sectionName: string) {
  try {
    const statsRef = doc(db, 'analytics', 'summary');
    const snap = await getDoc(statsRef);
    if (snap.exists()) {
      const data = snap.data();
      const sectionsViewed = data.sectionsViewed || {};
      sectionsViewed[sectionName] = (sectionsViewed[sectionName] || 0) + 1;
      await updateDoc(statsRef, { sectionsViewed });
    }
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

