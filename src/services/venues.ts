import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  GeoPoint,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Venue, Review, Coordinates } from '../types';

const VENUES_COLLECTION = 'venues';
const REVIEWS_COLLECTION = 'reviews';

export async function getNearbyVenues(
  coords: Coordinates,
  radiusKm: number = 5
): Promise<Venue[]> {
  // Simple bounding-box query; replace with GeoFirestore for precise radius filtering
  const delta = radiusKm / 111;
  const q = query(
    collection(db, VENUES_COLLECTION),
    where('latitude', '>=', coords.latitude - delta),
    where('latitude', '<=', coords.latitude + delta),
    orderBy('latitude'),
    limit(50)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Venue));
}

export async function getVenueById(id: string): Promise<Venue | null> {
  const snap = await getDoc(doc(db, VENUES_COLLECTION, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Venue;
}

export async function getVenueReviews(venueId: string): Promise<Review[]> {
  const q = query(
    collection(db, REVIEWS_COLLECTION),
    where('venueId', '==', venueId),
    orderBy('createdAt', 'desc'),
    limit(20)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Review));
}

export async function addReview(
  review: Omit<Review, 'id' | 'createdAt' | 'helpful'>
): Promise<string> {
  const ref = await addDoc(collection(db, REVIEWS_COLLECTION), {
    ...review,
    helpful: 0,
    createdAt: serverTimestamp(),
  });

  // Update venue average rating
  const venueRef = doc(db, VENUES_COLLECTION, review.venueId);
  const venueSnap = await getDoc(venueRef);
  if (venueSnap.exists()) {
    const venue = venueSnap.data() as Venue;
    const newCount = venue.reviewCount + 1;
    const newAvg =
      (venue.averageRating * venue.reviewCount + review.rating) / newCount;
    await updateDoc(venueRef, {
      reviewCount: newCount,
      averageRating: Math.round(newAvg * 10) / 10,
      updatedAt: serverTimestamp(),
    });
  }

  return ref.id;
}

export async function addVenue(
  venue: Omit<Venue, 'id' | 'averageRating' | 'reviewCount' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  const ref = await addDoc(collection(db, VENUES_COLLECTION), {
    ...venue,
    averageRating: 0,
    reviewCount: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}
