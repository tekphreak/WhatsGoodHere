export interface Venue {
  id: string;
  name: string;
  address: string;
  category: VenueCategory;
  latitude: number;
  longitude: number;
  averageRating: number;
  reviewCount: number;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type VenueCategory =
  | 'restaurant'
  | 'bar'
  | 'cafe'
  | 'park'
  | 'shop'
  | 'gym'
  | 'entertainment'
  | 'other';

export interface Review {
  id: string;
  venueId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  imageUrls: string[];
  createdAt: Date;
  helpful: number;
}

export interface User {
  id: string;
  displayName: string;
  email: string;
  photoUrl?: string;
  reviewCount: number;
  joinedAt: Date;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}
