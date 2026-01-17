import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase, Broadcast, User } from '../lib/supabase';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);
  const [radius, setRadius] = useState(2);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
    loadBroadcasts();
    
    // Set up real-time subscription
    const subscription = supabase
      .channel('broadcasts')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'broadcasts' }, () => {
        loadBroadcasts();
      })
      .subscribe();

    return () => subscription.unsubscribe();
  }, [radius]);

  const loadUserData = async () => {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (authUser) {
      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single();
      setUser(userData);
    }
  };

  const loadBroadcasts = async () => {
    setLoading(true);
    // In production, this would use PostGIS to filter by radius
    const { data } = await supabase
      .from('neighborhood_feed')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(20);

    setBroadcasts(data || []);
    setLoading(false);
  };

  const handleRefresh = () => {
    loadBroadcasts();
  };

  const formatDistance = (lat: number, lon: number) => {
    // Simplified distance calculation - use proper haversine formula in production
    return `${(Math.random() * 2 + 0.5).toFixed(1)} miles`;
  };

  const getErrandEmoji = (type: string) => {
    const emojis: { [key: string]: string } = {
      grocery: '🛒',
      pharmacy: '💊',
      general: '📦',
    };
    return emojis[type] || '🚶';
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good morning!</Text>
          <View style={styles.neighborhoodRow}>
            <Text style={styles.neighborhoodText}>Within {radius} miles of you</Text>
            <TouchableOpacity onPress={() => {}}>
              <Text style={styles.editRadius}>Edit</Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity onPress={() => router.push('/Profile')}>
          <Image
            source={{ uri: user?.photo_url || 'https://via.placeholder.com/40' }}
            style={styles.avatar}
          />
        </TouchableOpacity>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.primaryActionButton}
          onPress={() => router.push('/CreateBroadcast')}
        >
          <Text style={styles.primaryActionIcon}>🟢</Text>
          <Text style={styles.primaryActionText}>I'm already going out</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryActionButton}
          onPress={() => router.push('/CreateRequest')}
        >
          <Text style={styles.secondaryActionIcon}>🔵</Text>
          <Text style={styles.secondaryActionText}>I need something</Text>
        </TouchableOpacity>
      </View>

      {/* Feed */}
      <ScrollView
        style={styles.feed}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={handleRefresh} />
        }
      >
        <Text style={styles.feedTitle}>Active helpers nearby</Text>
        
        {broadcasts.length === 0 && !loading ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateEmoji}>🏘️</Text>
            <Text style={styles.emptyStateTitle}>No helpers nearby</Text>
            <Text style={styles.emptyStateText}>
              Be the first to broadcast when you're heading out!
            </Text>
          </View>
        ) : (
          broadcasts.map((broadcast) => (
            <TouchableOpacity
              key={broadcast.id}
              style={styles.broadcastCard}
              onPress={() => router.push(`/CreateRequest?broadcast=${broadcast.id}`)}
            >
              <View style={styles.broadcastHeader}>
                <View style={styles.broadcastUserInfo}>
                  <Image
                    source={{ uri: broadcast.helper_photo || 'https://via.placeholder.com/40' }}
                    style={styles.broadcastAvatar}
                  />
                  <View>
                    <Text style={styles.broadcastName}>{broadcast.helper_name}</Text>
                    <Text style={styles.broadcastMeta}>
                      ⭐ {broadcast.helper_rating?.toFixed(1) || '5.0'} • {formatDistance(0, 0)}
                    </Text>
                  </View>
                </View>
                <View style={styles.broadcastTypeBadge}>
                  <Text style={styles.broadcastTypeEmoji}>
                    {getErrandEmoji(broadcast.errand_type)}
                  </Text>
                </View>
              </View>

              <Text style={styles.broadcastNote}>
                {broadcast.note || 'Heading out now'}
              </Text>

              <View style={styles.broadcastFooter}>
                <Text style={styles.broadcastTime}>
                  Leaving in {Math.floor((new Date(broadcast.leaving_at).getTime() - Date.now()) / 60000)} min
                </Text>
                <Text style={styles.broadcastStatus}>🟢 Live</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  neighborhoodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  neighborhoodText: {
    fontSize: 14,
    color: '#666',
  },
  editRadius: {
    fontSize: 14,
    color: '#3b82f6',
    marginLeft: 8,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  actionButtons: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  primaryActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10b981',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  primaryActionIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  primaryActionText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  secondaryActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3b82f6',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  secondaryActionIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  secondaryActionText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  feed: {
    flex: 1,
    paddingHorizontal: 20,
  },
  feedTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyStateEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  broadcastCard: {
    backgroundColor: '#fafafa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  broadcastHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  broadcastUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  broadcastAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  broadcastName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  broadcastMeta: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  broadcastTypeBadge: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 8,
  },
  broadcastTypeEmoji: {
    fontSize: 20,
  },
  broadcastNote: {
    fontSize: 14,
    color: '#333',
    marginBottom: 12,
  },
  broadcastFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  broadcastTime: {
    fontSize: 12,
    color: '#666',
  },
  broadcastStatus: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: '600',
  },
});