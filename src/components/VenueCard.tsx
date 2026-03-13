import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import StarRating from 'react-native-star-rating-widget';
import type { Venue } from '../types';

interface Props {
  venue: Venue;
  onPress: (venue: Venue) => void;
}

export function VenueCard({ venue, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(venue)}>
      {venue.imageUrl && (
        <Image source={{ uri: venue.imageUrl }} style={styles.image} />
      )}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {venue.name}
        </Text>
        <Text style={styles.category}>{venue.category}</Text>
        <View style={styles.ratingRow}>
          <StarRating
            rating={venue.averageRating}
            onChange={() => {}}
            starSize={16}
            style={styles.stars}
          />
          <Text style={styles.reviewCount}>({venue.reviewCount})</Text>
        </View>
        <Text style={styles.address} numberOfLines={1}>
          {venue.address}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    overflow: 'hidden',
  },
  image: {
    width: 90,
    height: 90,
  },
  info: {
    flex: 1,
    padding: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  category: {
    fontSize: 12,
    color: '#FF6B35',
    textTransform: 'capitalize',
    marginTop: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  stars: {
    paddingVertical: 0,
  },
  reviewCount: {
    fontSize: 12,
    color: '#888',
    marginLeft: 4,
  },
  address: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
});
