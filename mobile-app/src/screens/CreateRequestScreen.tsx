import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../lib/supabase';
import { useRouter } from 'expo-router';

const PRICE_OPTIONS = [500, 1000, 1500, 2000]; // $5, $10, $15, $20
const RADIUS_OPTIONS = [1, 2, 3];

export default function CreateRequestScreen() {
  const router = useRouter();
  const [what, setWhat] = useState('');
  const [deadline, setDeadline] = useState('');
  const [radius, setRadius] = useState(2);
  const [price, setPrice] = useState(1000);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!what || !deadline) {
      Alert.alert('Missing Info', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const deadlineDate = new Date(deadline);

      const { data: userData } = await supabase
        .from('users')
        .select('location')
        .eq('id', user.id)
        .single();

      const location = userData?.location || { latitude: 33.4484, longitude: -112.0740 };

      const { error } = await supabase
        .from('tasks')
        .insert({
          requester_id: user.id,
          title: what.split('\n')[0].substring(0, 50),
          description: what,
          category: 'general',
          location,
          base_price_cents: price,
          deadline: deadlineDate.toISOString(),
          state: 'PENDING_MATCH',
        });

      if (error) throw error;

      Alert.alert('Request Submitted!', 'You\'ll be notified when a neighbor accepts.', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message);
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
        <Text style={styles.title}>Request help</Text>
        <View style={styles.spacer} />
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>What do you need?</Text>
        <TextInput
          style={styles.descriptionInput}
          placeholder="Describe what you need help with..."
          value={what}
          onChangeText={setWhat}
          multiline
          numberOfLines={4}
        />

        <Text style={styles.sectionTitle}>Deadline</Text>
        <TextInput
          style={styles.input}
          placeholder="Today at 5:00 PM"
          value={deadline}
          onChangeText={setDeadline}
        />

        <Text style={styles.sectionTitle}>Search radius</Text>
        <View style={styles.optionsRow}>
          {RADIUS_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option}
              style={[styles.radiusButton, radius === option && styles.radiusButtonActive]}
              onPress={() => setRadius(option)}
            >
              <Text style={[styles.radiusButtonText, radius === option && styles.radiusButtonTextActive]}>
                {option} mi
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Offer</Text>
        <View style={styles.optionsRow}>
          {PRICE_OPTIONS.map((cents) => (
            <TouchableOpacity
              key={cents}
              style={[styles.priceButton, price === cents && styles.priceButtonActive]}
              onPress={() => setPrice(cents)}
            >
              <Text style={[styles.priceButtonText, price === cents && styles.priceButtonTextActive]}>
                ${cents / 100}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.tipBox}>
          <Text style={styles.tipText}>
            💡 You'll get faster results when a neighbor is already heading out
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
          <Text style={styles.submitButtonText}>{loading ? 'Submitting...' : 'Submit request'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  backButton: { fontSize: 16, color: '#666' },
  title: { flex: 1, fontSize: 18, fontWeight: '600', textAlign: 'center' },
  spacer: { width: 50 },
  content: { flex: 1, padding: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#1a1a1a', marginBottom: 12 },
  descriptionInput: { backgroundColor: '#fafafa', borderRadius: 12, padding: 16, fontSize: 16, minHeight: 120, textAlignVertical: 'top', marginBottom: 24 },
  input: { backgroundColor: '#fafafa', borderRadius: 12, padding: 16, fontSize: 16, marginBottom: 24 },
  optionsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  radiusButton: { flex: 1, backgroundColor: '#fafafa', borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginHorizontal: 4, borderWidth: 2, borderColor: 'transparent' },
  radiusButtonActive: { backgroundColor: '#ecfdf5', borderColor: '#10b981' },
  radiusButtonText: { fontSize: 16, color: '#666' },
  radiusButtonTextActive: { color: '#10b981', fontWeight: '600' },
  priceButton: { flex: 1, backgroundColor: '#fafafa', borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginHorizontal: 4, borderWidth: 2, borderColor: 'transparent' },
  priceButtonActive: { backgroundColor: '#eff6ff', borderColor: '#3b82f6' },
  priceButtonText: { fontSize: 16, color: '#666' },
  priceButtonTextActive: { color: '#3b82f6', fontWeight: '600' },
  tipBox: { backgroundColor: '#eff6ff', borderRadius: 12, padding: 16 },
  tipText: { fontSize: 14, color: '#1e40af', lineHeight: 20 },
  footer: { padding: 20, borderTopWidth: 1, borderTopColor: '#f0f0f0' },
  submitButton: { backgroundColor: '#3b82f6', paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  submitButtonText: { color: '#ffffff', fontSize: 18, fontWeight: '600' },
});