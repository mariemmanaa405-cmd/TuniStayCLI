import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, TextInput, Dimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Slider from '@react-native-community/slider';

const { width, height } = Dimensions.get('window');

const CITIES = [
  'Ariana', 'Béja', 'Ben Arous', 'Bizerte', 'Gabès', 'Gafsa', 'Jendouba',
  'Kairouan', 'Kasserine', 'Kébili', 'Kef', 'Mahdia', 'Manouba', 'Médenine',
  'Monastir', 'Nabeul', 'Sfax', 'Sidi Bouzid', 'Siliana', 'Sousse', 'Tataouine',
  'Tozeur', 'Tunis', 'Zaghouan'
];
const RATINGS = ['3', '4', '5'];
const SERVICES = [
  'Piscine', 'Spa', 'WiFi gratuit', 'Parking', 'Restaurant', 'Salle de sport',
  'Club enfants', 'Animation', 'Climatisation', 'Terrasse', 'Vue mer',
  'All-inclusive', 'Hammam', 'Golf', 'Cuisine locale', 'Yoga',
  'Service en chambre', 'Cave à vin', 'Musique live'
];

const CATEGORIES_NAV = [
  { id: 'city', label: 'Villes', icon: 'location' },
  { id: 'price', label: 'Budget', icon: 'cash' },
  { id: 'rating', label: 'Notes', icon: 'star' },
  { id: 'services', label: 'Services', icon: 'construct' },
  { id: 'categories', label: 'Catégories', icon: 'pricetag' }
];

const ENTITY_CATEGORIES = [
  'Luxe', 'Bord de mer', 'Romantique', 'Famille', 'Economique',
  'Boutique', 'Historique', 'Ecologique', 'Design', 'Gastronomie',
  'Authentique', 'Traditionnel', 'Culturel', 'Sport', 'Chic'
];

export default function FilterModal({ visible, onClose, filters, setFilters }: any) {
  const [activeCategory, setActiveCategory] = useState('city');
  const [localFilters, setLocalFilters] = useState({
    city: filters.city || '',
    minPrice: filters.minPrice || 0,
    maxPrice: filters.maxPrice || 500,
    minRating: filters.minRating || '',
    service: filters.service || '',
    category: filters.category || '',
    tag: filters.tag || '',
    priceRange: filters.priceRange || ''
  });

  const handleReset = () => setLocalFilters({
    city: '', minPrice: 0, maxPrice: 500, minRating: '',
    service: '', category: '', tag: '', priceRange: ''
  });

  const handleApply = () => {
    // Build a priceRange string for backward compat with list screens
    let priceRange = '';
    if (localFilters.minPrice > 0 || localFilters.maxPrice < 500) {
      priceRange = `${localFilters.minPrice}-${localFilters.maxPrice}`;
    }
    setFilters({
      ...localFilters,
      priceRange,
      tag: [localFilters.service, localFilters.category].filter(Boolean).join(' ')
    });
    onClose();
  };

  const renderOptions = () => {
    switch (activeCategory) {
      case 'city':
        return (
          <ScrollView>
            <TouchableOpacity style={[styles.optionItem, localFilters.city === '' && styles.optionItemActive]}
              onPress={() => setLocalFilters({ ...localFilters, city: '' })}>
              <Text style={[styles.optionText, localFilters.city === '' && styles.optionTextActive]}>Tous les Gouvernorats</Text>
              {localFilters.city === '' && <Ionicons name="checkmark-circle" size={20} color="#2980B9" />}
            </TouchableOpacity>
            {CITIES.map(city => (
              <TouchableOpacity key={city} style={[styles.optionItem, localFilters.city === city && styles.optionItemActive]}
                onPress={() => setLocalFilters({ ...localFilters, city })}>
                <Text style={[styles.optionText, localFilters.city === city && styles.optionTextActive]}>{city}</Text>
                {localFilters.city === city && <Ionicons name="checkmark-circle" size={20} color="#2980B9" />}
              </TouchableOpacity>
            ))}
          </ScrollView>
        );

      case 'price':
        return (
          <View style={{ padding: 15 }}>
            <Text style={styles.sliderLabel}>Prix Minimum : <Text style={styles.sliderValue}>{localFilters.minPrice} TND</Text></Text>
            <Slider
              style={{ width: '100%', height: 40 }}
              minimumValue={0}
              maximumValue={500}
              step={10}
              value={localFilters.minPrice}
              onValueChange={(val: number) => setLocalFilters({ ...localFilters, minPrice: val })}
              minimumTrackTintColor="#2980B9"
              maximumTrackTintColor="#e2e8f0"
              thumbTintColor="#1A5276"
            />

            <Text style={[styles.sliderLabel, { marginTop: 20 }]}>Prix Maximum : <Text style={styles.sliderValue}>{localFilters.maxPrice} TND</Text></Text>
            <Slider
              style={{ width: '100%', height: 40 }}
              minimumValue={0}
              maximumValue={500}
              step={10}
              value={localFilters.maxPrice}
              onValueChange={(val: number) => setLocalFilters({ ...localFilters, maxPrice: val })}
              minimumTrackTintColor="#2980B9"
              maximumTrackTintColor="#e2e8f0"
              thumbTintColor="#1A5276"
            />

            <View style={styles.pricePreview}>
              <Text style={styles.pricePreviewText}>{localFilters.minPrice} TND  —  {localFilters.maxPrice} TND</Text>
            </View>
          </View>
        );

      case 'rating':
        return (
          <View>
            <TouchableOpacity style={[styles.optionItem, localFilters.minRating === '' && styles.optionItemActive]}
              onPress={() => setLocalFilters({ ...localFilters, minRating: '' })}>
              <Text style={[styles.optionText, localFilters.minRating === '' && styles.optionTextActive]}>Toutes les Notes</Text>
            </TouchableOpacity>
            {RATINGS.map(r => (
              <TouchableOpacity key={r} style={[styles.optionItem, localFilters.minRating === r && styles.optionItemActive]}
                onPress={() => setLocalFilters({ ...localFilters, minRating: r })}>
                <Text style={[styles.optionText, localFilters.minRating === r && styles.optionTextActive]}>{r}+ Etoiles</Text>
                {localFilters.minRating === r && <Ionicons name="checkmark-circle" size={20} color="#2980B9" />}
              </TouchableOpacity>
            ))}
          </View>
        );

      case 'services':
        return (
          <ScrollView>
            <TouchableOpacity style={[styles.optionItem, localFilters.service === '' && styles.optionItemActive]}
              onPress={() => setLocalFilters({ ...localFilters, service: '' })}>
              <Text style={[styles.optionText, localFilters.service === '' && styles.optionTextActive]}>Tous les Services</Text>
              {localFilters.service === '' && <Ionicons name="checkmark-circle" size={20} color="#2980B9" />}
            </TouchableOpacity>
            {SERVICES.map(s => (
              <TouchableOpacity key={s} style={[styles.optionItem, localFilters.service === s && styles.optionItemActive]}
                onPress={() => setLocalFilters({ ...localFilters, service: s })}>
                <Text style={[styles.optionText, localFilters.service === s && styles.optionTextActive]}>{s}</Text>
                {localFilters.service === s && <Ionicons name="checkmark-circle" size={20} color="#2980B9" />}
              </TouchableOpacity>
            ))}
          </ScrollView>
        );

      case 'categories':
        return (
          <ScrollView>
            <TouchableOpacity style={[styles.optionItem, localFilters.category === '' && styles.optionItemActive]}
              onPress={() => setLocalFilters({ ...localFilters, category: '' })}>
              <Text style={[styles.optionText, localFilters.category === '' && styles.optionTextActive]}>Toutes les Catégories</Text>
              {localFilters.category === '' && <Ionicons name="checkmark-circle" size={20} color="#2980B9" />}
            </TouchableOpacity>
            {ENTITY_CATEGORIES.map(c => (
              <TouchableOpacity key={c} style={[styles.optionItem, localFilters.category === c && styles.optionItemActive]}
                onPress={() => setLocalFilters({ ...localFilters, category: c })}>
                <Text style={[styles.optionText, localFilters.category === c && styles.optionTextActive]}>{c}</Text>
                {localFilters.category === c && <Ionicons name="checkmark-circle" size={20} color="#2980B9" />}
              </TouchableOpacity>
            ))}
          </ScrollView>
        );

      default:
        return null;
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Filters & Sort</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={28} color="#1A5276" />
            </TouchableOpacity>
          </View>

          <View style={styles.body}>
            <View style={styles.leftCol}>
              {CATEGORIES_NAV.map(cat => (
                <TouchableOpacity key={cat.id}
                  style={[styles.catItem, activeCategory === cat.id && styles.catItemActive]}
                  onPress={() => setActiveCategory(cat.id)}>
                  <Ionicons name={cat.icon as any} size={18} color={activeCategory === cat.id ? '#2980B9' : '#94a3b8'} />
                  <Text style={[styles.catText, activeCategory === cat.id && styles.catTextActive]}>{cat.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.rightCol}>{renderOptions()}</View>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
              <Text style={styles.resetBtnText}>Reset All</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyBtn} onPress={handleApply}>
              <Text style={styles.applyBtnText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#F0F4F7', width: width * 0.92, height: height * 0.72, borderRadius: 25, overflow: 'hidden', elevation: 12 },
  header: { padding: 18, borderBottomWidth: 1, borderBottomColor: '#e2e8f0', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#1A5276' },
  body: { flex: 1, flexDirection: 'row' },
  leftCol: { width: '32%', backgroundColor: '#e8edf2', paddingVertical: 6 },
  rightCol: { width: '68%', backgroundColor: '#F0F4F7' },
  footer: { padding: 16, borderTopWidth: 1, borderTopColor: '#e2e8f0', flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'white' },
  catItem: { paddingVertical: 14, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', backgroundColor: '#e8edf2' },
  catItemActive: { backgroundColor: '#F0F4F7', borderLeftWidth: 4, borderLeftColor: '#2980B9' },
  catText: { marginLeft: 8, fontSize: 12, color: '#94a3b8', fontWeight: '600' },
  catTextActive: { color: '#1A5276', fontWeight: 'bold' },
  optionItem: { padding: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 0.5, borderBottomColor: '#e2e8f0' },
  optionItemActive: { backgroundColor: 'rgba(41, 128, 185, 0.08)' },
  optionText: { fontSize: 14, color: '#2C3E50' },
  optionTextActive: { color: '#1A5276', fontWeight: 'bold' },
  sliderLabel: { fontSize: 14, fontWeight: 'bold', color: '#1A5276', marginBottom: 5 },
  sliderValue: { color: '#2980B9', fontSize: 16 },
  pricePreview: { marginTop: 25, padding: 15, backgroundColor: 'white', borderRadius: 12, alignItems: 'center', elevation: 2 },
  pricePreviewText: { fontSize: 18, fontWeight: 'bold', color: '#1A5276' },
  resetBtn: { backgroundColor: '#cbd5e1', paddingVertical: 12, paddingHorizontal: 22, borderRadius: 10 },
  resetBtnText: { color: '#2C3E50', fontWeight: 'bold' },
  applyBtn: { backgroundColor: '#1A5276', paddingVertical: 12, paddingHorizontal: 38, borderRadius: 10, elevation: 3 },
  applyBtnText: { color: 'white', fontWeight: 'bold' }
});
