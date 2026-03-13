import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../src/services/firebase';
import { useAuthStore } from '../src/store/auth';
import type { User } from '../src/types';

const queryClient = new QueryClient();

export default function RootLayout() {
  const { setUser, setLoading } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          id: firebaseUser.uid,
          displayName: firebaseUser.displayName ?? 'Anonymous',
          email: firebaseUser.email ?? '',
          photoUrl: firebaseUser.photoURL ?? undefined,
          reviewCount: 0,
          joinedAt: new Date(firebaseUser.metadata.creationTime ?? Date.now()),
        } as User);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <PaperProvider>
          <StatusBar style="auto" />
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen
              name="venue/[id]"
              options={{ title: 'Venue', headerBackTitle: 'Back' }}
            />
            <Stack.Screen
              name="venue/add-review"
              options={{ title: 'Add Review', presentation: 'modal' }}
            />
          </Stack>
        </PaperProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
