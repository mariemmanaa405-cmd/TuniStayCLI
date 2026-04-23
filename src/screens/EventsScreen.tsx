import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Event } from '../types';
import eventsData from '../data/events.json';
import FilterModal from './FilterModal';

export default function EventsScreen({ navigation }: any) {
  const [events, setEvents] = useState<Event[]>(eventsData);
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
    let filtered = eventsData as Event[];
    if (filters.city.trim()) filtered = filtered.filter(e => e.city?.toLowerCase() === filters.city.toLowerCase().trim());
    if (filters.tag && filters.tag.trim()) {
      const tags = filters.tag.toLowerCase().trim().split(' ').filter(Boolean);
      filtered = filtered.filter(e => {
        return tags.some(tag =>
          e.name.toLowerCase().includes(tag) || e.location?.toLowerCase().includes(tag) ||
          (e as any).categories?.some((c: string) => c.toLowerCase().includes(tag))
        );
      });
    }
    setEvents(filtered);
  }, [filters]);

  const renderItem = ({ item }: { item: Event }) => (
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Detail', { item, type: 'event' })}>
      <Image source={{ uri: item.photos?.[0] || 'https://via.placeholder.com/150' }} style={styles.image} />
      <View style={styles.cardInfo}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.location}>{item.location || item.city}</Text>
        <Text style={styles.date}><Ionicons name="calendar" size={14} color="#2980B9" /> {item.date}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FilterModal visible={modalVisible} onClose={() => setModalVisible(false)} filters={filters} setFilters={setFilters} />
      <FlatList data={events} keyExtractor={item => item.id} renderItem={renderItem} contentContainerStyle={styles.list} ListEmptyComponent={<Text style={styles.empty}>Aucun événement trouvé.</Text>} />
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
  location: { color: '#2C3E50', marginBottom: 8, fontSize: 14, opacity: 0.8 },
  date: { color: '#2980B9', fontWeight: 'bold', fontSize: 14 },
  empty: { textAlign: 'center', marginTop: 40, color: '#2C3E50', fontSize: 16 }
});
