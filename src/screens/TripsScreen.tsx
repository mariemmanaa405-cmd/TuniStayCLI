import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, Modal, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { StorageService } from '../services/StorageService';
import { Trip } from '../types';

export default function TripsScreen({ navigation }: any) {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [tripName, setTripName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useFocusEffect(useCallback(() => {
    loadTrips();
  }, []));

  const loadTrips = async () => setTrips(await StorageService.getTrips());

  const handleCreateTrip = async () => {
    if (!tripName.trim() || !startDate.trim() || !endDate.trim()) return Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
    await StorageService.addTrip({ name: tripName, startDate, endDate });
    setModalVisible(false);
    setTripName(''); setStartDate(''); setEndDate('');
    loadTrips();
  };

  const renderTrip = ({ item }: { item: Trip }) => (
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('TripDetail', { trip: item })}>
      <Text style={styles.cardTitle}>{item.name}</Text>
      <Text style={styles.cardDates}><Ionicons name="calendar-outline" size={14} color="#2980B9" /> {item.startDate} ➔ {item.endDate}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Planificateur</Text>
      <FlatList data={trips} keyExtractor={item => item.id} renderItem={renderTrip} contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="map-outline" size={60} color="#cbd5e1" style={{ marginBottom: 15 }} />
            <Text style={styles.empty}>Vous n'avez pas encore planifié de voyage.</Text>
            <Text style={styles.emptyHint}>Appuyez sur + pour en créer un !</Text>
          </View>
        }
      />

      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nouveau Voyage</Text>
            <Text style={styles.label}>Nom du voyage</Text>
            <TextInput style={styles.input} placeholder="Ex: Roadtrip Sud" placeholderTextColor="#94a3b8" value={tripName} onChangeText={setTripName} />
            <Text style={styles.label}>Date de début</Text>
            <TextInput style={styles.input} placeholder="Ex: 12/08/2026" placeholderTextColor="#94a3b8" value={startDate} onChangeText={setStartDate} />
            <Text style={styles.label}>Date de fin</Text>
            <TextInput style={styles.input} placeholder="Ex: 20/08/2026" placeholderTextColor="#94a3b8" value={endDate} onChangeText={setEndDate} />
            <TouchableOpacity style={styles.button} onPress={handleCreateTrip}>
              <Text style={styles.buttonText}>Sauvegarder</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, { backgroundColor: '#94a3b8', marginTop: 8 }]} onPress={() => setModalVisible(false)}>
              <Text style={styles.buttonText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F4F7' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', margin: 20, color: '#1A5276' },
  list: { paddingHorizontal: 15 },
  card: { backgroundColor: 'white', padding: 20, borderRadius: 15, elevation: 4, marginBottom: 15, shadowColor: '#1A5276', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A5276', marginBottom: 5 },
  cardDates: { color: '#2C3E50' },
  emptyContainer: { alignItems: 'center', marginTop: 60, padding: 20 },
  empty: { textAlign: 'center', color: '#2C3E50', fontSize: 16, fontWeight: '600' },
  emptyHint: { textAlign: 'center', color: '#94a3b8', marginTop: 8, fontSize: 14 },
  fab: { position: 'absolute', bottom: 30, right: 30, backgroundColor: '#2980B9', width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 6 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#F0F4F7', padding: 25, borderRadius: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#1A5276', marginBottom: 20, textAlign: 'center' },
  label: { fontWeight: 'bold', color: '#2C3E50', marginBottom: 5 },
  input: { backgroundColor: 'white', borderRadius: 10, padding: 14, marginBottom: 15, fontSize: 16, borderWidth: 1, borderColor: '#e2e8f0' },
  button: { backgroundColor: '#1A5276', padding: 15, borderRadius: 12, alignItems: 'center', marginTop: 5 },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});
