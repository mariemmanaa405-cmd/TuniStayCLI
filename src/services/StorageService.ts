import AsyncStorage from '@react-native-async-storage/async-storage';
import { Review, User, Trip, TripStep, FavoriteItem } from '../types';

const REVIEWS_KEY = '@tunisia_reviews';
const USER_KEY = '@tunisia_user';
const TRIPS_KEY = '@tunisia_trips';
const TRIP_STEPS_KEY = '@tunisia_trip_steps';
const FAVORITES_KEY = '@tunisia_favorites';

export const StorageService = {
  // --- USER AUTH ---
  getUser: async (): Promise<User | null> => {
    try {
      const jsonValue = await AsyncStorage.getItem(USER_KEY);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) { return null; }
  },

  saveUser: async (user: User): Promise<void> => {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  logoutUser: async (): Promise<void> => {
    await AsyncStorage.removeItem(USER_KEY);
  },

  // --- REVIEWS ---
  getReviews: async (): Promise<Review[]> => {
    try {
      const jsonValue = await AsyncStorage.getItem(REVIEWS_KEY);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) { return []; }
  },

  addReview: async (review: Omit<Review, 'id' | 'date'>): Promise<void> => {
    const existing = await StorageService.getReviews();
    const newReviews = [...existing, { ...review, id: Math.random().toString(), date: new Date().toISOString() }];
    await AsyncStorage.setItem(REVIEWS_KEY, JSON.stringify(newReviews));
  },

  getReviewsForEntity: async (entityId: string): Promise<Review[]> => {
    const reviews = await StorageService.getReviews();
    return reviews.filter(r => r.entityId === entityId);
  },

  // --- FAVORITES ---
  getFavorites: async (): Promise<FavoriteItem[]> => {
    try {
      const val = await AsyncStorage.getItem(FAVORITES_KEY);
      return val != null ? JSON.parse(val) : [];
    } catch (e) { return []; }
  },

  toggleFavorite: async (item: FavoriteItem): Promise<boolean> => {
    const favs = await StorageService.getFavorites();
    const index = favs.findIndex(f => f.entityId === item.entityId);
    if (index >= 0) {
      favs.splice(index, 1);
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
      return false; // Removed
    } else {
      favs.push(item);
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
      return true; // Added
    }
  },

  isFavorite: async (entityId: string): Promise<boolean> => {
    const favs = await StorageService.getFavorites();
    return favs.some(f => f.entityId === entityId);
  },

  // --- TRIPS ---
  getTrips: async (): Promise<Trip[]> => {
    try {
      const val = await AsyncStorage.getItem(TRIPS_KEY);
      return val != null ? JSON.parse(val) : [];
    } catch (e) { return []; }
  },

  addTrip: async (trip: Omit<Trip, 'id'>): Promise<void> => {
    const trips = await StorageService.getTrips();
    const newTrips = [...trips, { ...trip, id: Math.random().toString() }];
    await AsyncStorage.setItem(TRIPS_KEY, JSON.stringify(newTrips));
  },

  getTripSteps: async (tripId: string): Promise<TripStep[]> => {
    try {
      const val = await AsyncStorage.getItem(TRIP_STEPS_KEY);
      const allSteps: TripStep[] = val != null ? JSON.parse(val) : [];
      return allSteps.filter(s => s.tripId === tripId).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    } catch (e) { return []; }
  },

  addTripStep: async (step: Omit<TripStep, 'id'>): Promise<void> => {
    try {
      const val = await AsyncStorage.getItem(TRIP_STEPS_KEY);
      const allSteps: TripStep[] = val != null ? JSON.parse(val) : [];
      allSteps.push({ ...step, id: Math.random().toString() });
      await AsyncStorage.setItem(TRIP_STEPS_KEY, JSON.stringify(allSteps));
    } catch (e) {}
  }
};

