import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TextInput, TouchableOpacity, Alert, Modal } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { StorageService } from '../services/StorageService';
import { Review, User, Trip } from '../types';
import { AuthContext } from '../../App';

export default function DetailScreen({ route, navigation }: any) {
  const { item, type } = route.params;
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newRating, setNewRating] = useState('5');
  const [newComment, setNewComment] = useState('');
  const { isAuthenticated, currentUser } = useContext(AuthContext);
  const [isFavorite, setIsFavorite] = useState(false);
  const [tripModalVisible, setTripModalVisible] = useState(false);
  const [trips, setTrips] = useState<Trip[]>([]);

  useEffect(() => {
    loadReviews();
    checkFavorite();
  }, [item.id, isAuthenticated]);

  const loadReviews = async () => setReviews(await StorageService.getReviewsForEntity(item.id));
  const checkFavorite = async () => setIsFavorite(await StorageService.isFavorite(item.id));

  const handleToggleFav = async () => {
    if (!isAuthenticated) return navigation.navigate('AuthFlow');
    const status = await StorageService.toggleFavorite({ entityId: item.id, entityType: type });
    setIsFavorite(status);
  };

  const handleOpenTrips = async () => {
    if (!isAuthenticated) return navigation.navigate('AuthFlow');
    setTrips(await StorageService.getTrips());
    setTripModalVisible(true);
  };

  const handleAddToTrip = async (tripId: string) => {
    await StorageService.addTripStep({ tripId, entityId: item.id, entityType: type, entityName: item.name, date: new Date().toISOString() });
    setTripModalVisible(false);
    Alert.alert('Parfait !', 'Ajouté à l\'itinéraire.');
  };

  const submitReview = async () => {
    if (!isAuthenticated) return navigation.navigate('AuthFlow');
    const ratingNum = Number(newRating);
    if (!newComment.trim() || isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) return Alert.alert('Erreur', 'Note invalide (1-5).');
    await StorageService.addReview({ entityId: item.id, rating: ratingNum, comment: newComment, authorName: currentUser?.name || 'Visiteur' });
    setNewComment(''); setNewRating('5'); loadReviews();
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: item.photos?.[0] || 'https://via.placeholder.com/400x300' }} style={styles.image} />

      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>{item.name}</Text>
          <TouchableOpacity onPress={handleToggleFav}>
            <Ionicons name={isFavorite ? 'heart' : 'heart-outline'} size={32} color="#1A5276" />
          </TouchableOpacity>
        </View>
        <Text style={styles.baseRating}><Ionicons name="star" size={16} color="#F1C40F" /> {item.rating}</Text>
        {item.location && <Text style={styles.subtitle}><Ionicons name="location" size={14} color="#2980B9" /> {item.location}</Text>}

        <TouchableOpacity style={styles.tripButton} onPress={handleOpenTrips}>
          <Ionicons name="airplane" size={18} color="#F0F4F7" style={{ marginRight: 8 }} />
          <Text style={styles.tripButtonText}>Ajouter à mon Planificateur</Text>
        </TouchableOpacity>

        <View style={styles.infoBox}>
          {type === 'hotel' && <Text style={styles.detailText}>Prix: {item.price} TND / nuit</Text>}
          {type === 'restaurant' && <Text style={styles.detailText}>Cuisine: {item.cuisine} | {item.price}</Text>}
          {type === 'event' && <Text style={styles.detailText}><Ionicons name="calendar" size={14} /> {item.date}</Text>}
        </View>

        {item.categories && item.categories.length > 0 && (
          <View style={styles.tagsContainer}>
            {item.categories.map((cat: string, index: number) => (
              <View key={index} style={styles.tagBadge}><Text style={styles.tagText}>{cat}</Text></View>
            ))}
          </View>
        )}

        {item.services && item.services.length > 0 && (
          <View style={{ marginBottom: 20 }}>
            <Text style={styles.smallTitle}>Services :</Text>
            {item.services.map((s: string, i: number) => <Text key={i} style={styles.servicesList}>• {s}</Text>)}
          </View>
        )}

        <Text style={styles.description}>{item.description}</Text>

        <View style={styles.reviewSection}>
          <Text style={styles.sectionTitle}>Avis & Recommandations</Text>
          {reviews.length === 0 ? (
            <Text style={styles.noReviews}>Soyez le premier à donner votre avis !</Text>
          ) : (
            reviews.map(r => (
              <View key={r.id} style={styles.reviewCard}>
                <View style={styles.headerRow}>
                  <Text style={styles.reviewAuthor}>{r.authorName || 'Visiteur'}</Text>
                  <Text style={styles.reviewRating}><Ionicons name="star" size={12} color="#F1C40F" /> {r.rating}/5</Text>
                </View>
                <Text style={styles.reviewComment}>{r.comment}</Text>
              </View>
            ))
          )}

          <Text style={[styles.sectionTitle, { marginTop: 30 }]}>Laissez un avis</Text>
          <TextInput style={styles.input} placeholder="Note (1-5)" keyboardType="numeric" value={newRating} onChangeText={setNewRating} maxLength={1} placeholderTextColor="#94a3b8" />
          <TextInput style={[styles.input, { height: 100, textAlignVertical: 'top' }]} placeholder="Partagez votre expérience..." multiline value={newComment} onChangeText={setNewComment} placeholderTextColor="#94a3b8" />
          <TouchableOpacity style={styles.button} onPress={submitReview}>
            <Text style={styles.buttonText}>Publier {isAuthenticated ? `(${currentUser?.name})` : '(Connexion requise)'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal visible={tripModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.sectionTitle}>Sélectionner un Voyage</Text>
            {trips.length === 0 ? (
              <Text style={{ color: '#94a3b8', marginBottom: 20 }}>Aucun voyage créé. Allez dans l'onglet Voyages.</Text>
            ) : (
              trips.map(t => (
                <TouchableOpacity key={t.id} style={styles.tripListItem} onPress={() => handleAddToTrip(t.id)}>
                  <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#1A5276' }}>{t.name}</Text>
                </TouchableOpacity>
              ))
            )}
            <TouchableOpacity style={[styles.button, { backgroundColor: '#94a3b8' }]} onPress={() => setTripModalVisible(false)}>
              <Text style={styles.buttonText}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F4F7' },
  image: { width: '100%', height: 350, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  content: { padding: 25, marginTop: -20, backgroundColor: '#F0F4F7', borderTopLeftRadius: 30, borderTopRightRadius: 30 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  title: { fontSize: 26, fontWeight: 'bold', color: '#1A5276', flex: 1, marginRight: 10 },
  baseRating: { fontSize: 20, fontWeight: 'bold', color: '#F1C40F', marginTop: 6, marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#2C3E50', marginBottom: 20, opacity: 0.8 },
  tripButton: { backgroundColor: '#2980B9', padding: 18, borderRadius: 15, alignItems: 'center', marginBottom: 20, flexDirection: 'row', justifyContent: 'center', elevation: 4 },
  tripButtonText: { fontWeight: 'bold', color: '#F0F4F7', fontSize: 16 },
  infoBox: { backgroundColor: 'white', padding: 20, borderRadius: 15, marginBottom: 20, elevation: 2 },
  detailText: { fontSize: 18, fontWeight: 'bold', color: '#2980B9' },
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20 },
  tagBadge: { backgroundColor: '#1A5276', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 25, marginRight: 10, marginBottom: 10 },
  tagText: { color: '#F0F4F7', fontWeight: 'bold', fontSize: 12 },
  smallTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A5276', marginBottom: 10 },
  servicesList: { fontSize: 16, color: '#2C3E50', marginLeft: 10, marginBottom: 5 },
  description: { fontSize: 17, lineHeight: 28, color: '#2C3E50', marginBottom: 35, opacity: 0.9 },
  reviewSection: { borderTopWidth: 1, borderColor: '#e2e8f0', paddingTop: 25 },
  sectionTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: '#1A5276' },
  noReviews: { color: '#94a3b8', fontStyle: 'italic', marginBottom: 15 },
  reviewCard: { backgroundColor: 'white', padding: 18, borderRadius: 15, marginBottom: 15, elevation: 2 },
  reviewAuthor: { fontSize: 16, fontWeight: 'bold', color: '#2980B9' },
  reviewRating: { fontWeight: 'bold', color: '#F1C40F' },
  reviewComment: { color: '#2C3E50', marginTop: 8, fontSize: 15, lineHeight: 22 },
  input: { backgroundColor: 'white', borderRadius: 12, padding: 15, marginBottom: 15, fontSize: 16, borderWidth: 1, borderColor: '#e2e8f0' },
  button: { backgroundColor: '#1A5276', padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#F0F4F7', fontWeight: 'bold', fontSize: 16 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#F0F4F7', padding: 30, borderRadius: 25 },
  tripListItem: { padding: 18, borderBottomWidth: 1, borderBottomColor: '#e2e8f0', backgroundColor: 'white', borderRadius: 12, marginBottom: 12, elevation: 2 }
});
