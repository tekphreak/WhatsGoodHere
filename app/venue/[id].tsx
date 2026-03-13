import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import StarRating from 'react-native-star-rating-widget';
import { Ionicons } from '@expo/vector-icons';
import { ReviewCard } from '../../src/components/ReviewCard';
import { getVenueById, getVenueReviews } from '../../src/services/venues';
import { useAuthStore } from '../../src/store/auth';

export default function VenueScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuthStore();

  const { data: venue, isLoading: venueLoading } = useQuery({
    queryKey: ['venue', id],
    queryFn: () => getVenueById(id!),
    enabled: !!id,
  });

  const { data: reviews, isLoading: reviewsLoading } = useQuery({
    queryKey: ['reviews', id],
    queryFn: () => getVenueReviews(id!),
    enabled: !!id,
  });

  function handleAddReview() {
    if (!user) {
      Alert.alert('Sign In Required', 'Please sign in to leave a review.');
      return;
    }
    router.push({ pathname: '/venue/add-review', params: { venueId: id } });
  }

  if (venueLoading || !venue) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#FF6B35" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={{
          latitude: venue.latitude,
          longitude: venue.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        scrollEnabled={false}
      >
        <Marker
          coordinate={{ latitude: venue.latitude, longitude: venue.longitude }}
          pinColor="#FF6B35"
        />
      </MapView>

      <View style={styles.info}>
        <Text style={styles.name}>{venue.name}</Text>
        <Text style={styles.category}>{venue.category}</Text>
        <View style={styles.ratingRow}>
          <StarRating rating={venue.averageRating} onChange={() => {}} starSize={22} />
          <Text style={styles.ratingText}>
            {venue.averageRating.toFixed(1)} ({venue.reviewCount} reviews)
          </Text>
        </View>
        <View style={styles.addressRow}>
          <Ionicons name="location-outline" size={16} color="#666" />
          <Text style={styles.address}>{venue.address}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.addReviewButton} onPress={handleAddReview}>
        <Ionicons name="add-circle-outline" size={20} color="#fff" />
        <Text style={styles.addReviewText}>Add Review</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Reviews</Text>

      {reviewsLoading ? (
        <ActivityIndicator color="#FF6B35" style={{ margin: 20 }} />
      ) : reviews?.length === 0 ? (
        <Text style={styles.empty}>No reviews yet. Be the first!</Text>
      ) : (
        reviews?.map((review) => <ReviewCard key={review.id} review={review} />)
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  map: { height: 200 },
  info: { backgroundColor: '#fff', padding: 20 },
  name: { fontSize: 22, fontWeight: '700', color: '#1a1a1a' },
  category: { fontSize: 13, color: '#FF6B35', textTransform: 'capitalize', marginTop: 4 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  ratingText: { marginLeft: 8, color: '#666', fontSize: 14 },
  addressRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  address: { color: '#666', marginLeft: 4, fontSize: 14, flex: 1 },
  addReviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6B35',
    margin: 16,
    borderRadius: 10,
    padding: 14,
  },
  addReviewText: { color: '#fff', fontWeight: '600', marginLeft: 8, fontSize: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1a1a1a', margin: 16, marginBottom: 4 },
  empty: { textAlign: 'center', color: '#aaa', marginVertical: 30, fontSize: 14 },
});
