import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import StarRating from 'react-native-star-rating-widget';
import type { Review } from '../types';

interface Props {
  review: Review;
}

export function ReviewCard({ review }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.userName}>{review.userName}</Text>
        <Text style={styles.date}>
          {new Date(review.createdAt).toLocaleDateString()}
        </Text>
      </View>
      <StarRating
        rating={review.rating}
        onChange={() => {}}
        starSize={16}
        style={styles.stars}
      />
      <Text style={styles.comment}>{review.comment}</Text>
      {review.imageUrls.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.images}>
          {review.imageUrls.map((uri, i) => (
            <Image key={i} source={{ uri }} style={styles.image} />
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  userName: {
    fontWeight: '600',
    color: '#1a1a1a',
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
  stars: {
    paddingVertical: 0,
    marginBottom: 8,
  },
  comment: {
    color: '#444',
    lineHeight: 20,
  },
  images: {
    marginTop: 10,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 8,
  },
});
