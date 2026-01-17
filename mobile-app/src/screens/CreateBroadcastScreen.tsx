import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../lib/supabase';
import { useRouter } from 'expo-router';

const ERRAND_TYPES = [
  { id: 'grocery', emoji: '🛒', label: 'Grocery' },
  { id: 'pharmacy', emoji: '💊', label: 'Pharmacy' },
  { id: 'general', emoji: '📦', label: 'General Errand' },
];

const TIME_OPTIONS = [
  { id: 15, label: '15 min' },
  { id: 30, label: '30 min' },
  { id: 60, label: '60 min' },
];

const RADIUS_OPTIONS = [1, 2, 3];

export default function CreateBroadcastScreen() {
  const router = useRouter();
  const [errandType, setErrandType] = useState('grocery');
  const [leavingIn, setLeavingIn] = useState(15);
  const [radius, setRadius] = useState(2);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreateBroadcast = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const leavingAt = new Date(Date.now() + leavingIn * 60000);
      const expiresAt = new Date(Date.now() + (leavingIn + 60) * 60000);

      // Get user's location (in production, get actual GPS)
      const { data: userData } = await supabase
        .from('users')
        .select('location')
        .eq('id', user.id)
        .single();

      const location = userData?.location || { latitude: 33.4484, longitude: -112.0740 }; // Default to Phoenix

      const { error } = await supabase
        .from('broadcasts')
        .insert({
          helper_id: user.id,
          errand_type: errandType,
          leaving_at: leavingAt.toISOString(),
          radius_miles: radius,
          note: note || null,
          location,
          expires_at: expiresAt.toISOString(),
        });

      if (error) throw error;

      router.push('/BroadcastLive');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create broadcast');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Broadcast your trip</Text>
        <View style={styles.spacer} />
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Where are you going?</Text>
        <View style={styles.optionsGrid}>
          {ERRAND_TYPES.map((type) => (
            <TouchableOpacity
              key={type.id}
              style={[
                styles.optionCard,
                errandType === type.id && styles.optionCardActive,
              ]}
              onPress={() => setErrandType(type.id)}
            >
              <Text style={styles.optionEmoji}>{type.emoji}</Text>
              <Text style={[
                styles.optionLabel,
                errandType === type.id && styles.optionLabelActive,
              ]}>
                {type.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Leaving in</Text>
        <View style={styles.optionsRow}>
          {TIME_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.timeButton,
                leavingIn === option.id && styles.timeButtonActive,
              ]}
              onPress={() => setLeavingIn(option.id)}
            >
              <Text style={[
                styles.timeButtonText,
                leavingIn === option.id && styles.timeButtonTextActive,
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Search radius</Text>
        <View style={styles.optionsRow}>
          {RADIUS_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.radiusButton,
                radius === option && styles.radiusButtonActive,
              ]}
              onPress={() => setRadius(option)}
            >
              <Text style={[
                styles.radiusButtonText,
                radius === option && styles.radiusButtonTextActive,
              ]}>
                {option} mi
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Note (optional)</Text>
        <TextInput
          style={styles.noteInput}
          placeholder="Can grab small items only"
          value={note}
          onChangeText={setNote}
          multiline
          numberOfLines={3}
        />

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            💡 You'll get notified when neighbors add items to your trip
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.broadcastButton}
          onPress={handleCreateBroadcast}
          disabled={loading}
        >
          <Text style={styles.broadcastButtonText}>
            {loading ? 'Creating...' : 'Broadcast my trip'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    fontSize: 16,
    color: '#666',
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  spacer: {
    width: 50,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  optionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  optionCard: {
    flex: 1,
    backgroundColor: '#fafafa',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionCardActive: {
    backgroundColor: '#ecfdf5',
    borderColor: '#10b981',
  },
  optionEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  optionLabel: {
    fontSize: 14,
    color: '#666',
  },
  optionLabelActive: {
    color: '#10b981',
    fontWeight: '600',
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  timeButton: {
    flex: 1,
    backgroundColor: '#fafafa',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  timeButtonActive: {
    backgroundColor: '#ecfdf5',
    borderColor: '#10b981',
  },
  timeButtonText: {
    fontSize: 16,
    color: '#666',
  },
  timeButtonTextActive: {
    color: '#10b981',
    fontWeight: '600',
  },
  radiusButton: {
    flex: 1,
    backgroundColor: '#fafafa',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  radiusButtonActive: {
    backgroundColor: '#ecfdf5',
    borderColor: '#10b981',
  },
  radiusButtonText: {
    fontSize: 16,
    color: '#666',
  },
  radiusButtonTextActive: {
    color: '#10b981',
    fontWeight: '600',
  },
  noteInput: {
    backgroundColor: '#fafafa',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  infoBox: {
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  infoText: {
    fontSize: 14,
    color: '#1e40af',
    lineHeight: 20,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  broadcastButton: {
    backgroundColor: '#10b981',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  broadcastButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
});