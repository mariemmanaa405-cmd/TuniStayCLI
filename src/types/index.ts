export interface BaseEntity {
  id: string;
  name: string;
  rating?: number;
  photos?: string[];
  description?: string;
  city?: string;
  location?: string;
  categories?: string[];
  services?: string[];
}

export interface Hotel extends BaseEntity {
  city: string;
  price: number;
  stars: number;
}

export interface Restaurant extends BaseEntity {
  city: string;
  cuisine: string;
  price: string;
}

export interface Event extends BaseEntity {
  date: string;
  location: string;
  city: string;
}

export interface Review {
  id: string;
  entityId: string;
  authorName?: string;
  rating: number;
  comment: string;
  date: string;
}

export interface User {
  name: string;
  email: string;
}

export interface TripStep {
  id: string;
  tripId: string;
  entityId: string;
  entityType: 'hotel' | 'restaurant' | 'event';
  entityName: string;
  date: string;
  note?: string;
}

export interface Trip {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
}

export interface FavoriteItem {
  entityId: string;
  entityType: 'hotel' | 'restaurant' | 'event';
}
