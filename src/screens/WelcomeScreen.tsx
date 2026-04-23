import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function WelcomeScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://images.pexels.com/photos/4388164/pexels-photo-4388164.jpeg?auto=compress&cs=tinysrgb&w=800' }}
        style={styles.image}
      />
      <View style={styles.content}>
        <Text style={styles.title}>Discover Tunisia</Text>
        <Text style={styles.subtitle}>Explorez les meilleurs hôtels, restaurants et événements en toute liberté.</Text>

        <View style={styles.features}>
          <View style={styles.featureRow}>
            <Ionicons name="cloud-offline" size={20} color="#2980B9" style={styles.icon} />
            <Text style={styles.featureText}>100% Hors-ligne et Mémorisé</Text>
          </View>
          <View style={styles.featureRow}>
            <Ionicons name="map" size={20} color="#2980B9" style={styles.icon} />
            <Text style={styles.featureText}>Planifiez votre voyage (Timeline)</Text>
          </View>
          <View style={styles.featureRow}>
            <Ionicons name="heart" size={20} color="#2980B9" style={styles.icon} />
            <Text style={styles.featureText}>Gardez vos lieux Favoris</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('SignIn')}>
          <Text style={styles.buttonText}>Créer mon profil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F4F7' },
  image: { width: '100%', height: '55%' },
  content: {
    flex: 1, borderTopLeftRadius: 30, borderTopRightRadius: 30,
    backgroundColor: '#F0F4F7', marginTop: -30, padding: 30, alignItems: 'center'
  },
  title: { fontSize: 32, fontWeight: 'bold', color: '#1A5276', marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#2C3E50', textAlign: 'center', marginBottom: 20, lineHeight: 22 },
  features: { marginBottom: 30, width: '100%' },
  featureRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  icon: { marginRight: 15 },
  featureText: { fontSize: 16, color: '#2C3E50', fontWeight: '500' },
  button: {
    backgroundColor: '#1A5276', paddingVertical: 16, paddingHorizontal: 40,
    borderRadius: 25, width: '100%', alignItems: 'center', elevation: 4
  },
  buttonText: { color: '#F0F4F7', fontSize: 18, fontWeight: 'bold' }
});
