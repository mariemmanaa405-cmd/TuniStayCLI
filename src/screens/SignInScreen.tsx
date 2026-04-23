import React, { useContext, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../../App';

export default function SignInScreen({ navigation }: any) {
  const [name, setName] = useState('');
  const { signIn } = useContext(AuthContext);

  const handleSignIn = async () => {
    if (!name.trim()) return;
    await signIn({ name, email: '' });
    // No navigation needed: App.tsx switches to MainTabs automatically when currentUser is set
  };

  const handleGuestSignIn = async () => {
    await signIn({ name: 'Voyageur Tunisien', email: 'guest@discovertunisia.tn' });
    // No navigation needed: auto-switch
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Ionicons name="person-circle" size={100} color="#2980B9" style={{ alignSelf: 'center', marginBottom: 20 }} />
        <Text style={styles.title}>Rejoignez l'aventure</Text>
        <Text style={styles.subtitle}>Accédez instantanément ou créez un profil local personnalisé.</Text>

        <TouchableOpacity style={styles.expressButton} onPress={handleGuestSignIn}>
          <Ionicons name="flash" size={20} color="#F0F4F7" style={{ position: 'absolute', left: 20 }} />
          <Text style={styles.expressButtonText}>Connexion Express</Text>
        </TouchableOpacity>

        <View style={styles.divider}>
          <View style={styles.line} />
          <Text style={styles.dividerText}>OU</Text>
          <View style={styles.line} />
        </View>

        <TextInput
          style={styles.input}
          placeholder="Votre Nom ou Pseudo"
          placeholderTextColor="#94a3b8"
          value={name}
          onChangeText={setName}
        />

        <TouchableOpacity style={styles.button} onPress={handleSignIn}>
          <Text style={styles.buttonText}>Valider le profil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F4F7', justifyContent: 'center' },
  content: { padding: 30 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1A5276', textAlign: 'center', marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#2C3E50', textAlign: 'center', marginBottom: 30, lineHeight: 22, opacity: 0.8 },
  expressButton: {
    backgroundColor: '#2980B9', padding: 18, borderRadius: 12,
    alignItems: 'center', marginBottom: 25, elevation: 4, flexDirection: 'row', justifyContent: 'center'
  },
  expressButtonText: { color: '#F0F4F7', fontWeight: 'bold', fontSize: 18 },
  divider: { flexDirection: 'row', alignItems: 'center', marginBottom: 25 },
  line: { flex: 1, height: 1, backgroundColor: '#cbd5e1' },
  dividerText: { marginHorizontal: 10, color: '#94a3b8', fontWeight: 'bold' },
  input: {
    backgroundColor: 'white', borderRadius: 12, padding: 18,
    marginBottom: 15, fontSize: 16, borderWidth: 1, borderColor: '#cbd5e1', color: '#2C3E50'
  },
  button: { backgroundColor: '#1A5276', padding: 18, borderRadius: 12, alignItems: 'center', elevation: 4 },
  buttonText: { color: '#F0F4F7', fontWeight: 'bold', fontSize: 18 }
});
