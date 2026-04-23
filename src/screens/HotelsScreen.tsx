import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Hotel } from '../types';
import hotelsData from '../data/hotels.json';
import FilterModal from './FilterModal';

export default function HotelsScreen({ navigation }: any) {
  const [hotels, setHotels] = useState<Hotel[]>(hotelsData);
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
    let filtered = hotelsData as Hotel[];
    if (filters.city.trim()) filtered = filtered.filter(h => h.city.toLowerCase() === filters.city.toLowerCase().trim());
    if (filters.priceRange && filters.priceRange.includes('-')) {
      const [min, max] = filters.priceRange.split('-').map(Number);
      filtered = filtered.filter(h => h.price >= min && h.price <= max);
    }
    if (filters.minRating) filtered = filtered.filter(h => h.rating !== undefined && h.rating >= Number(filters.minRating));
    if (filters.tag && filters.tag.trim()) {
      const tags = filters.tag.toLowerCase().trim().split(' ').filter(Boolean);
      filtered = filtered.filter(h => {
        return tags.some(tag => 
          h.categories?.some((c: string) => c.toLowerCase().includes(tag)) || 
          h.services?.some((s: string) => s.toLowerCase().includes(tag))
        );
      });
    }
    setHotels(filtered);
  }, [filters]);

  const renderHotel = ({ item }: { item: Hotel }) => (
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Detail', { item, type: 'hotel' })}>
      <Image source={{ uri: item.photos?.[0] || 'https://via.placeholder.com/150' }} style={styles.image} />
      <View style={styles.cardInfo}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.location}>{item.location || item.city}</Text>
        {item.services && <Text style={styles.servicesText} numberOfLines={1}>{item.services.join(' • ')}</Text>}
        <View style={styles.row}>
          <Text style={styles.price}>{item.price} TND</Text>
          <Text style={styles.rating}><Ionicons name="star" size={14} color="#F1C40F" /> {item.rating}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FilterModal visible={modalVisible} onClose={() => setModalVisible(false)} filters={filters} setFilters={setFilters} />
      <FlatList
        data={hotels}
        keyExtractor={item => item.id}
        renderItem={renderHotel}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>Aucun hôtel trouvé pour ces critères.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F4F7' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  list: { padding: 15 },
  card: { backgroundColor: 'white', borderRadius: 20, overflow: 'hidden', marginBottom: 25, elevation: 6, shadowColor: '#1A5276', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8 },
  image: { width: '100%', height: 220 },
  cardInfo: { padding: 18 },
  name: { fontSize: 20, fontWeight: 'bold', marginBottom: 5, color: '#1A5276' },
  location: { color: '#2C3E50', marginBottom: 8, fontSize: 14, opacity: 0.8 },
  servicesText: { color: '#2980B9', fontSize: 12, marginBottom: 12, fontWeight: '600' },
  price: { fontSize: 20, fontWeight: 'bold', color: '#2C3E50' },
  rating: { fontSize: 18, fontWeight: 'bold', color: '#F1C40F' },
  empty: { textAlign: 'center', marginTop: 40, color: '#2C3E50', fontSize: 16 }
});
