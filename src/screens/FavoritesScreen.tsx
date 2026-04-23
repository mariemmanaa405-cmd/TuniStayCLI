import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { StorageService } from '../services/StorageService';
import hotelsData from '../data/hotels.json';
import restaurantsData from '../data/restaurants.json';
import eventsData from '../data/events.json';

export default function FavoritesScreen({ navigation }: any) {
  const [favorites, setFavorites] = useState<any[]>([]);

  useFocusEffect(useCallback(() => {
    loadFavorites();
  }, []));

  const loadFavorites = async () => {
    const favItems = await StorageService.getFavorites();
    const loadedFavs = favItems.map(fav => {
      let dataList: any[] = [];
      if (fav.entityType === 'hotel') dataList = hotelsData;
      else if (fav.entityType === 'restaurant') dataList = restaurantsData;
      else if (fav.entityType === 'event') dataList = eventsData;
      const itemData = dataList.find(d => d.id === fav.entityId);
      return { ...fav, data: itemData };
    }).filter(f => f.data);
    setFavorites(loadedFavs);
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Detail', { item: item.data, type: item.entityType })}>
      <Image source={{ uri: item.data.photos?.[0] || 'https://via.placeholder.com/150' }} style={styles.image} />
      <View style={styles.cardInfo}>
        <View style={styles.row}>
          <Text style={styles.name} numberOfLines={1}>{item.data.name}</Text>
          <Text style={styles.typeBadge}>{item.entityType.toUpperCase()}</Text>
        </View>
        <Text style={styles.location}><Ionicons name="location" size={12} color="#2980B9" /> {item.data.location || item.data.city}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Mes Favoris</Text>
      <FlatList
        data={favorites}
        keyExtractor={item => item.entityId}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="heart-outline" size={60} color="#cbd5e1" style={{ marginBottom: 15 }} />
            <Text style={styles.empty}>Vous n'avez pas encore d'éléments épinglés.</Text>
            <Text style={styles.emptyHint}>Explorez les hôtels et restaurants pour en ajouter !</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F4F7' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', margin: 20, color: '#1A5276' },
  list: { paddingHorizontal: 15, paddingBottom: 20 },
  card: { backgroundColor: 'white', borderRadius: 15, overflow: 'hidden', marginBottom: 15, elevation: 4, shadowColor: '#1A5276', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6 },
  image: { width: '100%', height: 160 },
  cardInfo: { padding: 15 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { fontSize: 18, fontWeight: 'bold', color: '#1A5276', flex: 1, marginRight: 10 },
  typeBadge: { backgroundColor: '#2980B9', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, fontSize: 10, fontWeight: 'bold', color: 'white', overflow: 'hidden' },
  location: { color: '#2C3E50', marginTop: 5, opacity: 0.8 },
  emptyContainer: { alignItems: 'center', marginTop: 60, padding: 20 },
  empty: { textAlign: 'center', color: '#2C3E50', fontSize: 16, fontWeight: '600' },
  emptyHint: { textAlign: 'center', color: '#94a3b8', marginTop: 8, fontSize: 14 }
});
