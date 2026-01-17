import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Animated, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase, Broadcast, Task } from '../lib/supabase';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function BroadcastLiveScreen() {
  const router = useRouter();
  const [broadcast, setBroadcast] = useState<Broadcast | null>(null);
  const [incomingRequests, setIncomingRequests] = useState<Task[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    loadActiveBroadcast();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (incomingRequests.length > 0) {
      Animated.sequence([
        Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.delay(200),
      ]).start();
    }
  }, [incomingRequests.length]);

  const loadActiveBroadcast = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: activeBroadcast } = await supabase
      .from('broadcasts')
      .select('*')
      .eq('helper_id', user.id)
      .eq('status', 'active')
      .single();

    if (activeBroadcast) {
      setBroadcast(activeBroadcast);
      
      // Subscribe to new requests
      supabase
        .channel('tasks')
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'tasks',
          filter: `broadcast_id=eq.${activeBroadcast.id}`,
        }, (payload) => {
          setIncomingRequests((prev) => [payload.new as Task, ...prev]);
        })
        .subscribe();
    }
  };

  const updateTime = () => {
    if (broadcast) {
      const remaining = Math.max(0, Math.floor(
        (new Date(broadcast.expires_at).getTime() - Date.now()) / 1000
      ));
      setTimeRemaining(remaining);
      
      if (remaining === 0) {
        handleExpire();
      }
    }
  };

  const handleExpire = async () => {
    if (broadcast) {
      await supabase
        .from('broadcasts')
        .update({ status: 'expired' })
        .eq('id', broadcast.id);
      router.back();
    }
  };

  const handleAccept = async (task: Task) => {
    try {
      // Create Stripe payment intent and capture (simplified)
      const { error: taskError } = await supabase
        .from('tasks')
        .update({
          state: 'ACCEPTED',
          helper_id: broadcast?.helper_id,
        })
        .eq('id', task.id);

      if (taskError) throw taskError;

      Alert.alert('Request Accepted!', 'Payment locked. Mark complete when done.');
      setIncomingRequests((prev) => prev.filter((t) => t.id !== task.id));
      router.push(`/TaskDetail?id=${task.id}`);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const handleDecline = async (task: Task) => {
    setIncomingRequests((prev) => prev.filter((t) => t.id !== task.id));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getErrandEmoji = (type: string) => {
    const emojis: { [key: string]: string } = {
      grocery: '🛒',
      pharmacy: '💊',
      general: '📦',
    };
    return emojis[type] || '🚶';
  };

  if (!broadcast) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.endButton}>End Broadcast</Text>
        </TouchableOpacity>
        <View style={styles.statusBadge}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>Live</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.timerContainer}>
          <Text style={styles.timer}>{formatTime(timeRemaining)}</Text>
          <Text style={styles.timerLabel}>until broadcast expires</Text>
        </View>

        <View style={styles.broadcastInfo}>
          <Text style={styles.broadcastEmoji}>
            {getErrandEmoji(broadcast.errand_type)}
          </Text>
          <Text style={styles.broadcastType}>
            {broadcast.errand_type.charAt(0).toUpperCase() + broadcast.errand_type.slice(1)} run
          </Text>
          <Text style={styles.broadcastNote}>
            {broadcast.note || 'Heading out now'}
          </Text>
        </View>

        <View style={styles.requestsSection}>
          <Text style={styles.requestsTitle}>
            Incoming requests ({incomingRequests.length})
          </Text>

          {incomingRequests.length === 0 ? (
            <View style={styles.noRequests}>
              <Text style={styles.noRequestsEmoji}>🔔</Text>
              <Text style={styles.noRequestsText}>
                Waiting for requests...
              </Text>
              <Text style={styles.noRequestsSubtext}>
                Neighbors will see your broadcast and can add items
              </Text>
            </View>
          ) : (
            incomingRequests.map((task, index) => (
              <Animated.View
                key={task.id}
                style={[
                  styles.requestCard,
                  { opacity: index === 0 ? fadeAnim : 1, transform: [{ translateY: index === 0 ? fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }) : 0 }] },
                ]}
              >
                <View style={styles.requestHeader}>
                  <View style={styles.requestPrice}>
                    <Text style={styles.priceAmount}>
                      ${(task.base_price_cents / 100).toFixed(2)}
                    </Text>
                  </View>
                  <Text style={styles.requestTitle}>{task.title}</Text>
                </View>

                <Text style={styles.requestDescription}>
                  {task.description}
                </Text>

                <View style={styles.requestActions}>
                  <TouchableOpacity
                    style={styles.declineButton}
                    onPress={() => handleDecline(task)}
                  >
                    <Text style={styles.declineButtonText}>Decline</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.acceptButton}
                    onPress={() => handleAccept(task)}
                  >
                    <Text style={styles.acceptButtonText}>Accept</Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            ))
          )}
        </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  endButton: {
    fontSize: 16,
    color: '#ef4444',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10b981',
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10b981',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  timerContainer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  timer: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  timerLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  broadcastInfo: {
    alignItems: 'center',
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  broadcastEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  broadcastType: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  broadcastNote: {
    fontSize: 14,
    color: '#666',
  },
  requestsSection: {
    flex: 1,
    marginTop: 24,
  },
  requestsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  noRequests: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  noRequestsEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  noRequestsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  noRequestsSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  requestCard: {
    backgroundColor: '#fafafa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  requestHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  requestPrice: {
    backgroundColor: '#10b981',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 12,
  },
  priceAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  requestTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  requestDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  requestActions: {
    flexDirection: 'row',
    gap: 12,
  },
  declineButton: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  declineButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  acceptButton: {
    flex: 1,
    backgroundColor: '#10b981',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  acceptButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});