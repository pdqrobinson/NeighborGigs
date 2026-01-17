import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase, Task, Message } from '../lib/supabase';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';

export default function TaskDetailScreen({ route }: any) {
  const router = useRouter();
  const { taskId } = route.params;
  const [task, setTask] = useState<Task | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [proofUri, setProofUri] = useState<string | null>(null);

  useEffect(() => {
    loadTask();
    loadMessages();

    const subscription = supabase
      .channel(`task-${taskId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'messages',
        filter: `task_id=eq.${taskId}`,
      }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      })
      .subscribe();

    return () => subscription.unsubscribe();
  }, [taskId]);

  const loadTask = async () => {
    const { data } = await supabase.from('tasks').select('*').eq('id', taskId).single();
    setTask(data);
  };

  const loadMessages = async () => {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('task_id', taskId)
      .order('created_at');
    setMessages(data || []);
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from('messages').insert({
      task_id: taskId,
      sender_id: user?.id,
      content: newMessage,
    });
    setNewMessage('');
  };

  const uploadProof = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setProofUri(result.assets[0].uri);
    }
  };

  const markComplete = async () => {
    if (!proofUri) {
      Alert.alert('Proof Required', 'Please upload a photo as proof of completion');
      return;
    }

    await supabase
      .from('tasks')
      .update({ state: 'COMPLETED', proof_image_url: proofUri })
      .eq('id', taskId);
    Alert.alert('Task Complete!', 'Waiting for requester confirmation.');
  };

  const confirmComplete = async () => {
    await supabase
      .from('tasks')
      .update({ state: 'CONFIRMED' })
      .eq('id', taskId);
    Alert.alert('Confirmed!', 'Payment released to helper.');
  };

  if (!task) return null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{task.state}</Text>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.taskInfo}>
          <Text style={styles.taskTitle}>{task.title}</Text>
          <Text style={styles.taskDescription}>{task.description}</Text>
          <View style={styles.taskMeta}>
            <Text style={styles.price}>${(task.base_price_cents / 100).toFixed(2)}</Text>
            <Text style={styles.deadline}>Due: {new Date(task.deadline).toLocaleDateString()}</Text>
          </View>
        </View>

        {task.state === 'IN_PROGRESS' && (
          <View style={styles.actions}>
            <TouchableOpacity style={styles.actionButton} onPress={uploadProof}>
              <Text style={styles.actionButtonText}>Upload Proof Photo</Text>
            </TouchableOpacity>
            {proofUri && (
              <TouchableOpacity style={styles.completeButton} onPress={markComplete}>
                <Text style={styles.completeButtonText}>Mark Complete</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {task.state === 'COMPLETED' && (
          <View style={styles.actions}>
            <Text style={styles.confirmText}>Helper marked complete. Review proof below:</Text>
            {task.proof_image_url && (
              <View style={styles.proofContainer}>
                <Text>📷 Proof uploaded</Text>
              </View>
            )}
            <TouchableOpacity style={styles.completeButton} onPress={confirmComplete}>
              <Text style={styles.completeButtonText}>Confirm & Release Payment</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.chatContainer}>
          <Text style={styles.chatTitle}>Messages</Text>
          {messages.map((msg) => (
            <View key={msg.id} style={styles.messageBubble}>
              <Text style={styles.messageText}>{msg.content}</Text>
              <Text style={styles.messageTime}>
                {new Date(msg.created_at).toLocaleTimeString()}
              </Text>
            </View>
          ))}

          <View style={styles.messageInputContainer}>
            <TextInput
              style={styles.messageInput}
              placeholder="Type a message..."
              value={newMessage}
              onChangeText={setNewMessage}
            />
            <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 },
  backButton: { fontSize: 16, color: '#666' },
  statusBadge: { backgroundColor: '#ecfdf5', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  statusText: { fontSize: 12, fontWeight: '600', color: '#10b981' },
  content: { flex: 1, padding: 20 },
  taskInfo: { marginBottom: 24 },
  taskTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  taskDescription: { fontSize: 16, color: '#666', lineHeight: 24, marginBottom: 16 },
  taskMeta: { flexDirection: 'row', justifyContent: 'space-between' },
  price: { fontSize: 24, fontWeight: 'bold', color: '#10b981' },
  deadline: { fontSize: 14, color: '#666' },
  actions: { marginBottom: 24 },
  actionButton: { backgroundColor: '#f3f4f6', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginBottom: 12 },
  actionButtonText: { fontSize: 16, fontWeight: '600', color: '#1a1a1a' },
  completeButton: { backgroundColor: '#10b981', paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  completeButtonText: { fontSize: 16, fontWeight: '600', color: '#ffffff' },
  confirmText: { fontSize: 14, color: '#666', marginBottom: 12, textAlign: 'center' },
  proofContainer: { backgroundColor: '#fafafa', padding: 16, borderRadius: 12, marginBottom: 12, alignItems: 'center' },
  chatContainer: { flex: 1 },
  chatTitle: { fontSize: 18, fontWeight: '600', marginBottom: 16 },
  messageBubble: { backgroundColor: '#f3f4f6', padding: 12, borderRadius: 12, marginBottom: 12 },
  messageText: { fontSize: 14, marginBottom: 4 },
  messageTime: { fontSize: 12, color: '#999' },
  messageInputContainer: { flexDirection: 'row', gap: 8, marginTop: 12 },
  messageInput: { flex: 1, backgroundColor: '#fafafa', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12 },
  sendButton: { backgroundColor: '#10b981', paddingHorizontal: 20, borderRadius: 12 },
  sendButtonText: { color: '#ffffff', fontWeight: '600' },
});