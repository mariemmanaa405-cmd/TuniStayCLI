import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Restaurant } from '../types';
import restaurantsData from '../data/restaurants.json';
import FilterModal from './FilterModal';

export default function RestaurantsScreen({ navigation }: any) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>(restaurantsData);
  const [modalVisible, setModalVisible] = useState(false);
  const [filters, setFilters] = useState({ city: '', priceRange: '', minRating: '', tag: '' });

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity style={{ marginLeft: 15 }} onPress={() => setModalVisible(true)}>
          <Ionicons name="menu" size={28} color="#F0F4F7" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    let filtered = restaurantsData as Restaurant[];
    if (filters.city.trim()) filtered = filtered.filter(r => r.city.toLowerCase() === filters.city.toLowerCase().trim());
    // Restaurants use text-based prices ($$, $$$), skip numeric slider for them
    if (filters.minRating) filtered = filtered.filter(r => r.rating !== undefined && r.rating >= Number(filters.minRating));
    if (filters.tag && filters.tag.trim()) {
      const tags = filters.tag.toLowerCase().trim().split(' ').filter(Boolean);
      filtered = filtered.filter(r => {
        return tags.some(tag => 
          r.categories?.some((c: string) => c.toLowerCase().includes(tag)) || 
          r.services?.some((s: string) => s.toLowerCase().includes(tag))
        );
      });
    }
    setRestaurants(filtered);
  }, [filters]);

  const renderItem = ({ item }: { item: Restaurant }) => (
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Detail', { item, type: 'restaurant' })}>
      <Image source={{ uri: item.photos?.[0] || 'https://via.placeholder.com/150' }} style={styles.image} />
      <View style={styles.cardInfo}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.location}>{item.location || item.city} • {item.cuisine}</Text>
        <View style={styles.row}>
          <Text style={styles.price}>{item.price}</Text>
          <Text style={styles.rating}><Ionicons name="star" size={14} color="#F1C40F" /> {item.rating}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FilterModal visible={modalVisible} onClose={() => setModalVisible(false)} filters={filters} setFilters={setFilters} />
      <FlatList data={restaurants} keyExtractor={item => item.id} renderItem={renderItem} contentContainerStyle={styles.list} ListEmptyComponent={<Text style={styles.empty}>Aucun restaurant trouvé.</Text>} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F4F7' },
  list: { padding: 15 },
  card: { backgroundColor: 'white', borderRadius: 20, overflow: 'hidden', marginBottom: 25, elevation: 6, shadowColor: '#1A5276', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8 },
  image: { width: '100%', height: 220 },
  cardInfo: { padding: 18 },
  name: { fontSize: 20, fontWeight: 'bold', marginBottom: 5, color: '#1A5276' },
  location: { color: '#2C3E50', marginBottom: 10, fontSize: 14, opacity: 0.8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  price: { fontSize: 20, fontWeight: 'bold', color: '#2C3E50' },
  rating: { fontSize: 18, fontWeight: 'bold', color: '#F1C40F' },
  empty: { textAlign: 'center', marginTop: 40, color: '#2C3E50', fontSize: 16 }
});
