import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase, User } from '../lib/supabase';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState({ points: 0, tasksCompleted: 0, reliability: 0 });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) return;

    const { data: userData } = await supabase
      .from('users')
      .select('*')
      .eq('id', authUser.id)
      .single();

    if (userData) setUser(userData);

    // Load stats
    const { data: tasksData } = await supabase
      .from('tasks')
      .select('state, helper_rating')
      .eq('helper_id', authUser.id)
      .eq('state', 'PAID');

    const completed = tasksData?.length || 0;
    const totalRating = tasksData?.reduce((sum, t) => sum + (t.helper_rating || 0), 0) || 0;
    const reliability = completed > 0 ? totalRating / completed : 0;

    const { data: pointsData } = await supabase
      .from('point_transactions')
      .select('amount')
      .eq('user_id', authUser.id);

    const totalPoints = pointsData?.reduce((sum, p) => sum + p.amount, 0) || 0;

    setStats({ points: totalPoints, tasksCompleted: completed, reliability });
  };

  const getLevel = (points: number) => {
    const levels = [
      { min: 0, title: 'New Neighbor' },
      { min: 100, title: 'Friendly Face' },
      { min: 300, title: 'Helpful Hand' },
      { min: 750, title: 'Block Captain' },
      { min: 1500, title: 'Street Legend' },
      { min: 3000, title: 'Community Hero' },
      { min: 5000, title: 'Neighborhood Champion' },
      { min: 10000, title: 'Local Legend' },
    ];
    return levels.reverse().find((l) => points >= l.min) || levels[0];
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/Welcome');
  };

  if (!user) return null;

  const level = getLevel(stats.points);
  const pointsToNext = (() => {
    const currentLevel = level;
    const nextLevel = [
      { min: 0, title: 'New Neighbor' },
      { min: 100, title: 'Friendly Face' },
      { min: 300, title: 'Helpful Hand' },
      { min: 750, title: 'Block Captain' },
      { min: 1500, title: 'Street Legend' },
      { min: 3000, title: 'Community Hero' },
      { min: 5000, title: 'Neighborhood Champion' },
      { min: 10000, title: 'Local Legend' },
    ].find((l) => l.min > currentLevel.min);
    return nextLevel ? nextLevel.min - currentLevel.min : 0;
  })();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Image
              source={{ uri: user.photo_url || 'https://via.placeholder.com/100' }}
              style={styles.avatarImage}
            />
            {user.is_ambassador && (
              <View style={styles.ambassadorBadge}>
                <Text style={styles.ambassadorText}>🏆</Text>
              </View>
            )}
          </View>
          <Text style={styles.name}>{user.full_name}</Text>
          <Text style={styles.location}>{user.neighborhood}</Text>
        </View>

        <View style={styles.levelCard}>
          <Text style={styles.levelTitle}>{level.title}</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${(stats.points / (level.min + pointsToNext)) * 100}%` }]} />
          </View>
          <Text style={styles.pointsText}>{stats.points} points • {pointsToNext} to next level</Text>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.tasksCompleted}</Text>
            <Text style={styles.statLabel}>Tasks Completed</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.reliability.toFixed(1)}</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.points}</Text>
            <Text style={styles.statLabel}>Total Points</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Badges</Text>
          <View style={styles.badgesContainer}>
            <View style={styles.badge}>
              <Text style={styles.badgeEmoji}>🛒</Text>
              <Text style={styles.badgeLabel}>Grocery Guru</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeEmoji}>⭐</Text>
              <Text style={styles.badgeLabel}>5-Star Superstar</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeEmoji}>🔥</Text>
              <Text style={styles.badgeLabel}>Hot Streak</Text>
            </View>
          </View>
        </View>

        <View style={styles.menuSection}>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>Payment Methods</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>Notifications</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>Help & Support</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  content: { padding: 20 },
  header: { alignItems: 'center', marginBottom: 24 },
  avatar: { position: 'relative', marginBottom: 16 },
  avatarImage: { width: 100, height: 100, borderRadius: 50 },
  ambassadorBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#fbbf24', borderRadius: 20, width: 32, height: 32, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: '#ffffff' },
  ambassadorText: { fontSize: 16 },
  name: { fontSize: 24, fontWeight: 'bold', marginBottom: 4 },
  location: { fontSize: 16, color: '#666' },
  levelCard: { backgroundColor: '#ecfdf5', borderRadius: 12, padding: 20, marginBottom: 24 },
  levelTitle: { fontSize: 20, fontWeight: 'bold', color: '#10b981', marginBottom: 12 },
  progressBar: { height: 8, backgroundColor: '#d1fae5', borderRadius: 4, overflow: 'hidden', marginBottom: 8 },
  progressFill: { height: '100%', backgroundColor: '#10b981' },
  pointsText: { fontSize: 14, color: '#059669' },
  statsGrid: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  statCard: { flex: 1, backgroundColor: '#fafafa', borderRadius: 12, padding: 16, alignItems: 'center' },
  statValue: { fontSize: 24, fontWeight: 'bold', color: '#1a1a1a' },
  statLabel: { fontSize: 12, color: '#666', marginTop: 4 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
  badgesContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  badge: { backgroundColor: '#fafafa', borderRadius: 12, padding: 16, alignItems: 'center', width: 80 },
  badgeEmoji: { fontSize: 32, marginBottom: 4 },
  badgeLabel: { fontSize: 12, color: '#666', textAlign: 'center' },
  menuSection: { borderTopWidth: 1, borderTopColor: '#f0f0f0' },
  menuItem: { paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  menuItemText: { fontSize: 16, color: '#1a1a1a' },
  signOutButton: { backgroundColor: '#f3f4f6', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginTop: 24, marginBottom: 32 },
  signOutButtonText: { fontSize: 16, fontWeight: '600', color: '#ef4444' },
});