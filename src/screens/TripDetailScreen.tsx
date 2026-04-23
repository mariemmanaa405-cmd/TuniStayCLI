import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Share } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { StorageService } from '../services/StorageService';
import { TripStep } from '../types';

export default function TripDetailScreen({ route, navigation }: any) {
  const { trip } = route.params;
  const [steps, setSteps] = useState<TripStep[]>([]);

  useFocusEffect(useCallback(() => { loadSteps(); }, []));

  const loadSteps = async () => setSteps(await StorageService.getTripSteps(trip.id));

  const handleShare = async () => {
    let text = `Voici mon itinéraire : ${trip.name}\nDates : ${trip.startDate} au ${trip.endDate}\n\n`;
    steps.forEach((step, index) => {
      text += `Etape ${index + 1} : ${step.entityName} (${step.entityType})\n`;
    });
    const hasHotel = steps.some(s => s.entityType === 'hotel');
    const hasResto = steps.some(s => s.entityType === 'restaurant');
    if (hasHotel && !hasResto) text += `\nConseil : Pensez a ajouter un restaurant !`;
    try { await Share.share({ message: text }); } catch (e) {}
  };

  const renderStep = ({ item, index }: { item: TripStep, index: number }) => (
    <View style={styles.stepContainer}>
      <View style={styles.timelineLine} />
      <View style={styles.timelineDot} />
      <View style={styles.stepCard}>
        <Text style={styles.stepTitle}>{item.entityName}</Text>
        <Text style={styles.stepInfo}>{item.entityType.toUpperCase()}</Text>
        <Text style={styles.stepNote}>Ajouté le {new Date(item.date).toLocaleDateString()}</Text>
      </View>
    </View>
  );

  const showSuggestion = steps.some(s => s.entityType === 'hotel') && !steps.some(s => s.entityType === 'restaurant');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{trip.name}</Text>
        <Text style={styles.dates}><Ionicons name="calendar-outline" size={14} color="#2980B9" /> {trip.startDate} ➔ {trip.endDate}</Text>
        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Ionicons name="share-outline" size={18} color="#F0F4F7" style={{ marginRight: 5 }} />
          <Text style={styles.shareText}>Exporter l'itinéraire</Text>
        </TouchableOpacity>
      </View>

      {showSuggestion && (
        <View style={styles.suggestionBox}>
          <Text style={styles.suggestionText}><Ionicons name="bulb" size={16} color="#2980B9" /> Vous avez un hôtel mais aucun restaurant. Pensez-y !</Text>
          <TouchableOpacity style={styles.btnSmall} onPress={() => navigation.navigate('Restaurants')}>
            <Text style={{ color: 'white', fontWeight: 'bold' }}>Trouver un restaurant</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={steps}
        keyExtractor={item => item.id}
        renderItem={renderStep}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>Aucune étape ajoutée. Visitez des Hôtels ou Événements et cliquez sur "Ajouter au planificateur".</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F4F7' },
  header: { padding: 20, backgroundColor: 'white', borderBottomWidth: 1, borderColor: '#e2e8f0' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1A5276' },
  dates: { fontSize: 16, color: '#2C3E50', marginTop: 5 },
  shareButton: { backgroundColor: '#2980B9', padding: 12, borderRadius: 10, alignItems: 'center', marginTop: 15, flexDirection: 'row', justifyContent: 'center' },
  shareText: { fontWeight: 'bold', color: '#F0F4F7' },
  suggestionBox: { backgroundColor: 'white', padding: 15, margin: 15, borderRadius: 12, elevation: 2, borderLeftWidth: 4, borderLeftColor: '#2980B9' },
  suggestionText: { color: '#2C3E50', marginBottom: 10, fontWeight: '600' },
  btnSmall: { backgroundColor: '#1A5276', padding: 10, borderRadius: 8, alignItems: 'center', alignSelf: 'flex-start' },
  list: { padding: 20 },
  stepContainer: { flexDirection: 'row', marginBottom: 20, position: 'relative' },
  timelineLine: { position: 'absolute', left: 8, top: 20, bottom: -20, width: 2, backgroundColor: '#2980B9' },
  timelineDot: { width: 18, height: 18, borderRadius: 9, backgroundColor: '#1A5276', marginTop: 5, zIndex: 1 },
  stepCard: { flex: 1, backgroundColor: 'white', padding: 15, borderRadius: 12, elevation: 2, marginLeft: 15 },
  stepTitle: { fontSize: 16, fontWeight: 'bold', color: '#1A5276' },
  stepInfo: { color: '#2980B9', fontSize: 12, fontWeight: 'bold', marginTop: 5 },
  stepNote: { color: '#94a3b8', fontSize: 12, marginTop: 5, fontStyle: 'italic' },
  empty: { textAlign: 'center', color: '#2C3E50', marginTop: 40, fontSize: 16 }
});
