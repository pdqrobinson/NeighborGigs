import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { supabase } from '../src/lib/supabase';

export default function AppLayout() {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  if (!session) {
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" />
        <Stack.Screen name="Signup" options={{ presentation: 'modal' }} />
      </Stack>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="CreateBroadcast" options={{ presentation: 'modal' }} />
      <Stack.Screen name="CreateRequest" options={{ presentation: 'modal' }} />
      <Stack.Screen name="BroadcastLive" options={{ presentation: 'modal' }} />
      <Stack.Screen name="TaskDetail" options={{ presentation: 'modal' }} />
      <Stack.Screen name="Profile" options={{ presentation: 'modal' }} />
    </Stack>
  );
}