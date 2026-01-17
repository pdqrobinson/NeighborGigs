import React, { useEffect, useState } from 'react';
import { Slot, useRouter } from 'expo-router';
import { supabase } from './lib/supabase';

export default function App() {
  const router = useRouter();
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
    return <Slot />;
  }

  return <Slot />;
}