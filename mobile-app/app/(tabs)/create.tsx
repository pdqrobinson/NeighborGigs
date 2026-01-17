import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CreateTab() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>How can we help?</Text>
        
        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => router.push('/CreateBroadcast')}
        >
          <Text style={styles.optionEmoji}>🟢</Text>
          <Text style={styles.optionTitle}>I'm already going out</Text>
          <Text style={styles.optionDescription}>
            Broadcast your trip and earn money by helping neighbors
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.optionButton, styles.optionButtonBlue]}
          onPress={() => router.push('/CreateRequest')}
        >
          <Text style={styles.optionEmoji}>🔵</Text>
          <Text style={styles.optionTitle}>I need something</Text>
          <Text style={styles.optionDescription}>
            Request help from neighbors who are already out
          </Text>
        </TouchableOpacity>

        <View style={styles.tipBox}>
          <Text style={styles.tipText}>
            💡 Tip: You'll get faster results when neighbors are already heading out!
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  content: { flex: 1, padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 32, color: '#1a1a1a' },
  optionButton: { backgroundColor: '#ecfdf5', borderRadius: 20, padding: 24, marginBottom: 16, borderWidth: 2, borderColor: '#10b981' },
  optionButtonBlue: { backgroundColor: '#eff6ff', borderColor: '#3b82f6' },
  optionEmoji: { fontSize: 48, marginBottom: 16 },
  optionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 8, color: '#1a1a1a' },
  optionDescription: { fontSize: 14, color: '#666', lineHeight: 20 },
  tipBox: { backgroundColor: '#fef3c7', borderRadius: 12, padding: 16, marginTop: 24 },
  tipText: { fontSize: 14, color: '#92400e', lineHeight: 20 },
});