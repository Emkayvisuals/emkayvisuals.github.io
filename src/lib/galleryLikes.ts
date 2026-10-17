import {
  doc,
  collection,
  runTransaction,
  onSnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from './firebase';

const VISITOR_ID_STORAGE_KEY = 'emkay_gallery_anonymous_visitor_id';

let memoryVisitorId: string | null = null;

/**
 * Retrieves or creates a persistent random anonymous ID for the current visitor.
 * Saved in localStorage across sessions, not tied to any user authentication.
 */
export function getAnonymousVisitorId(): string {
  if (typeof window === 'undefined') {
    return 'server_visitor';
  }

  try {
    const existing = localStorage.getItem(VISITOR_ID_STORAGE_KEY);
    if (existing && existing.trim().length > 0) {
      return existing.trim();
    }

    const randomSeg = () => Math.random().toString(36).substring(2, 9);
    const newId = `vis_${Date.now().toString(36)}_${randomSeg()}_${randomSeg()}`;
    localStorage.setItem(VISITOR_ID_STORAGE_KEY, newId);
    return newId;
  } catch (err) {
    console.warn('LocalStorage unavailable for visitor ID, using memory fallback:', err);
    if (!memoryVisitorId) {
      memoryVisitorId = `vis_mem_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 9)}`;
    }
    return memoryVisitorId;
  }
}

/**
 * Safely sanitizes a gallery item ID for Firestore document path.
 */
export function getSafeGalleryItemId(id: string): string {
  if (!id) return 'item_default';
  return id.replace(/[\/\.\s#$\[\]]/g, '_');
}

export interface GalleryItemLikeState {
  count: number;
  isLiked: boolean;
}

/**
 * Real-time subscription to an item's aggregate like count and current visitor's like status.
 */
export function subscribeGalleryItemLikes(
  itemId: string,
  visitorId: string,
  onUpdate: (state: GalleryItemLikeState) => void
): Unsubscribe {
  const safeItemId = getSafeGalleryItemId(itemId);
  const countDocRef = doc(db, 'galleryLikes', safeItemId);
  const recordDocRef = doc(db, 'galleryLikes', safeItemId, 'records', visitorId);

  let currentCount = 0;
  let currentIsLiked = false;

  const unsubCount = onSnapshot(
    countDocRef,
    (snap) => {
      if (snap.exists()) {
        const val = snap.data()?.count;
        currentCount = typeof val === 'number' && !isNaN(val) ? Math.max(0, val) : 0;
      } else {
        currentCount = 0;
      }
      onUpdate({ count: currentCount, isLiked: currentIsLiked });
    },
    (err) => {
      console.warn(`Notice subscribing to like count for ${itemId}:`, err);
    }
  );

  const unsubRecord = onSnapshot(
    recordDocRef,
    (snap) => {
      currentIsLiked = snap.exists();
      onUpdate({ count: currentCount, isLiked: currentIsLiked });
    },
    (err) => {
      console.warn(`Notice subscribing to like record for ${itemId}:`, err);
    }
  );

  return () => {
    unsubCount();
    unsubRecord();
  };
}

/**
 * Toggles a like for the given gallery item on behalf of an anonymous visitor ID.
 * Runs in a strict Firestore transaction: increments/decrements count by exactly 1
 * in sync with the creation/deletion of the visitor's like record.
 */
export async function toggleGalleryLike(
  itemId: string,
  visitorId: string
): Promise<GalleryItemLikeState> {
  const safeItemId = getSafeGalleryItemId(itemId);
  const countDocRef = doc(db, 'galleryLikes', safeItemId);
  const recordDocRef = doc(db, 'galleryLikes', safeItemId, 'records', visitorId);

  return await runTransaction(db, async (transaction) => {
    const recordSnap = await transaction.get(recordDocRef);
    const countSnap = await transaction.get(countDocRef);

    const alreadyLiked = recordSnap.exists();
    const existingCount = countSnap.exists()
      ? Number(countSnap.data()?.count) || 0
      : 0;

    if (alreadyLiked) {
      // Unlike
      transaction.delete(recordDocRef);
      const newCount = Math.max(0, existingCount - 1);
      if (countSnap.exists()) {
        transaction.update(countDocRef, {
          count: newCount,
          updatedAt: new Date().toISOString(),
        });
      }
      return { count: newCount, isLiked: false };
    } else {
      // Like
      transaction.set(recordDocRef, {
        visitorId,
        itemId,
        createdAt: new Date().toISOString(),
      });
      const newCount = existingCount + 1;
      if (countSnap.exists()) {
        transaction.update(countDocRef, {
          count: newCount,
          updatedAt: new Date().toISOString(),
        });
      } else {
        transaction.set(countDocRef, {
          count: 1,
          itemId,
          updatedAt: new Date().toISOString(),
        });
      }
      return { count: newCount, isLiked: true };
    }
  });
}

/**
 * Subscribes to all gallery like counts (used in Admin dashboard to view popularity).
 */
export function subscribeAllGalleryLikes(
  onUpdate: (counts: Record<string, number>) => void
): Unsubscribe {
  const colRef = collection(db, 'galleryLikes');
  return onSnapshot(
    colRef,
    (snapshot) => {
      const counts: Record<string, number> = {};
      snapshot.forEach((d) => {
        const val = d.data()?.count;
        counts[d.id] = typeof val === 'number' && !isNaN(val) ? Math.max(0, val) : 0;
      });
      onUpdate(counts);
    },
    (err) => {
      console.warn('Notice listening to all gallery like counts:', err);
    }
  );
}
