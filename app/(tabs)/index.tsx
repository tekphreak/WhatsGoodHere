import React, { useState } from 'react';
import { View, FlatList, StyleSheet, Text, ActivityIndicator } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { VenueCard } from '../../src/components/VenueCard';
import { useLocation } from '../../src/hooks/useLocation';
import { getNearbyVenues } from '../../src/services/venues';
import type { Venue } from '../../src/types';

export default function NearbyScreen() {
  const { coords } = useLocation();
  const [view, setView] = useState<'map' | 'list'>('map');

  const { data: venues, isLoading } = useQuery({
    queryKey: ['venues', coords],
    queryFn: () => getNearbyVenues(coords),
  });

  function handleVenuePress(venue: Venue) {
    router.push(`/venue/${venue.id}`);
  }

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#FF6B35" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={view === 'map' ? styles.map : styles.mapSmall}
        region={{
          latitude: coords.latitude,
          longitude: coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation
      >
        {venues?.map((venue) => (
          <Marker
            key={venue.id}
            coordinate={{ latitude: venue.latitude, longitude: venue.longitude }}
            title={venue.name}
            onCalloutPress={() => handleVenuePress(venue)}
            pinColor="#FF6B35"
          />
        ))}
      </MapView>

      <FlatList
        data={venues}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <VenueCard venue={item} onPress={handleVenuePress} />
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No venues found nearby</Text>
        }
        style={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  map: { height: 260 },
  mapSmall: { height: 0 },
  list: { flex: 1 },
  empty: {
    textAlign: 'center',
    color: '#999',
    marginTop: 40,
    fontSize: 15,
  },
});
