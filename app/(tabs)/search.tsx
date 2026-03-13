import React, { useState } from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { router } from 'expo-router';
import { VenueCard } from '../../src/components/VenueCard';
import { getNearbyVenues } from '../../src/services/venues';
import type { Venue } from '../../src/types';

export default function SearchScreen() {
  const [results, setResults] = useState<Venue[]>([]);

  async function handlePlaceSelected(data: any, details: any) {
    if (!details?.geometry?.location) return;
    const { lat, lng } = details.geometry.location;
    const venues = await getNearbyVenues({ latitude: lat, longitude: lng }, 1);
    setResults(venues);
  }

  return (
    <View style={styles.container}>
      <GooglePlacesAutocomplete
        placeholder="Search a place or address…"
        onPress={handlePlaceSelected}
        fetchDetails
        query={{
          key: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
          language: 'en',
        }}
        styles={{ container: styles.autocomplete, textInput: styles.textInput }}
      />
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <VenueCard
            venue={item}
            onPress={(v) => router.push(`/venue/${v.id}`)}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.hint}>Search for a location to find nearby venues</Text>
        }
        style={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  autocomplete: { margin: 12 },
  textInput: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 12,
    fontSize: 15,
  },
  list: { flex: 1 },
  hint: {
    textAlign: 'center',
    color: '#aaa',
    marginTop: 60,
    fontSize: 14,
    paddingHorizontal: 32,
  },
});
