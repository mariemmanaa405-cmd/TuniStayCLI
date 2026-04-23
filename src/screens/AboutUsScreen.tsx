import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function AboutUsScreen({ navigation }: any) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Hero Section */}
      <View style={styles.hero}>
        <Image
          source={{ uri: 'https://images.pexels.com/photos/5431522/pexels-photo-5431522.jpeg?auto=compress&cs=tinysrgb&w=800' }}
          style={styles.heroImage}
        />
        <View style={styles.heroOverlay}>
          <Text style={styles.heroTitle}>Notre Mission</Text>
          <Text style={styles.heroSubtitle}>Connecter le monde à la beauté authentique de la Tunisie.</Text>
        </View>
      </View>

      {/* Intro */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Qui sommes-nous ?</Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>Discover Tunisia</Text> est bien plus qu'une simple application. C'est un compagnon de voyage conçu par des passionnés pour vous aider à explorer les trésors cachés de notre pays. Nous croyons que chaque voyageur mérite une expérience authentique, fluide et sans compromis.
        </Text>
      </View>

      {/* Features */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ce que fait l'application</Text>

        <View style={styles.featureItem}>
          <View style={styles.iconCircle}>
            <Ionicons name="location" size={24} color="#F0F4F7" />
          </View>
          <View style={styles.featureTextCol}>
            <Text style={styles.featureTitle}>Exploration Locale</Text>
            <Text style={styles.featureDesc}>Accédez aux meilleurs hôtels, restaurants et événements à travers les 24 gouvernorats tunisiens.</Text>
          </View>
        </View>

        <View style={styles.featureItem}>
          <View style={styles.iconCircle}>
            <Ionicons name="airplane" size={24} color="#F0F4F7" />
          </View>
          <View style={styles.featureTextCol}>
            <Text style={styles.featureTitle}>Planificateur Intelligent</Text>
            <Text style={styles.featureDesc}>Créez vos itinéraires jour par jour, ajoutez des étapes et partagez votre voyage avec vos proches.</Text>
          </View>
        </View>

        <View style={styles.featureItem}>
          <View style={styles.iconCircle}>
            <Ionicons name="cloud-offline" size={24} color="#F0F4F7" />
          </View>
          <View style={styles.featureTextCol}>
            <Text style={styles.featureTitle}>100% Hors-ligne</Text>
            <Text style={styles.featureDesc}>Toutes vos données sont stockées localement sur votre téléphone. Pas besoin d'internet pour explorer.</Text>
          </View>
        </View>

        <View style={styles.featureItem}>
          <View style={styles.iconCircle}>
            <Ionicons name="heart" size={24} color="#F0F4F7" />
          </View>
          <View style={styles.featureTextCol}>
            <Text style={styles.featureTitle}>Mes Favoris</Text>
            <Text style={styles.featureDesc}>Épinglez vos lieux préférés et retrouvez-les facilement depuis votre espace personnel.</Text>
          </View>
        </View>
      </View>

      {/* CTA */}
      <View style={styles.footer}>
        <Text style={styles.footerPrompt}>Prêt à découvrir la Tunisie autrement ?</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('SignIn')}>
          <Text style={styles.buttonText}>C'est parti !</Text>
          <Ionicons name="arrow-forward" size={20} color="#F0F4F7" style={{ marginLeft: 10 }} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F4F7' },
  scrollContent: { paddingBottom: 50 },
  hero: { height: 300, width: '100%', position: 'relative' },
  heroImage: { width: '100%', height: '100%' },
  heroOverlay: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: 'rgba(26, 82, 118, 0.82)',
    padding: 25, borderTopLeftRadius: 30, borderTopRightRadius: 30
  },
  heroTitle: { fontSize: 32, fontWeight: 'bold', color: '#F0F4F7', marginBottom: 5 },
  heroSubtitle: { fontSize: 16, color: '#F0F4F7', opacity: 0.9 },
  section: { padding: 25 },
  sectionTitle: { fontSize: 22, fontWeight: 'bold', color: '#1A5276', marginBottom: 15 },
  paragraph: { fontSize: 16, lineHeight: 26, color: '#2C3E50' },
  bold: { fontWeight: 'bold', color: '#2980B9' },
  featureItem: { flexDirection: 'row', marginBottom: 22, alignItems: 'flex-start' },
  iconCircle: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#2980B9', justifyContent: 'center', alignItems: 'center', elevation: 3 },
  featureTextCol: { flex: 1, marginLeft: 16 },
  featureTitle: { fontSize: 17, fontWeight: 'bold', color: '#1A5276', marginBottom: 5 },
  featureDesc: { fontSize: 14, color: '#2C3E50', lineHeight: 20, opacity: 0.85 },
  footer: { padding: 25, alignItems: 'center', marginTop: 10 },
  footerPrompt: { fontSize: 16, color: '#2C3E50', marginBottom: 20, fontWeight: '600' },
  button: {
    backgroundColor: '#1A5276', flexDirection: 'row',
    paddingVertical: 18, paddingHorizontal: 40, borderRadius: 15,
    alignItems: 'center', elevation: 5
  },
  buttonText: { color: '#F0F4F7', fontSize: 18, fontWeight: 'bold' }
});
