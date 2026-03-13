import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import StarRating from 'react-native-star-rating-widget';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../src/services/firebase';
import { addReview } from '../../src/services/venues';
import { useAuthStore } from '../../src/store/auth';
import { useQueryClient } from '@tanstack/react-query';

export default function AddReviewScreen() {
  const { venueId } = useLocalSearchParams<{ venueId: string }>();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  async function pickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.7,
    });
    if (!result.canceled) {
      setImages((prev) => [...prev, ...result.assets.map((a) => a.uri)]);
    }
  }

  async function uploadImages(): Promise<string[]> {
    return Promise.all(
      images.map(async (uri) => {
        const filename = `reviews/${Date.now()}_${Math.random().toString(36).slice(2)}.jpg`;
        const response = await fetch(uri);
        const blob = await response.blob();
        const storageRef = ref(storage, filename);
        await uploadBytes(storageRef, blob);
        return getDownloadURL(storageRef);
      })
    );
  }

  async function handleSubmit() {
    if (!user || !venueId) return;
    if (rating === 0) {
      Alert.alert('Rating Required', 'Please select a star rating.');
      return;
    }
    if (!comment.trim()) {
      Alert.alert('Comment Required', 'Please write a comment.');
      return;
    }

    setSubmitting(true);
    try {
      const imageUrls = await uploadImages();
      await addReview({
        venueId,
        userId: user.id,
        userName: user.displayName,
        rating,
        comment: comment.trim(),
        imageUrls,
      });
      queryClient.invalidateQueries({ queryKey: ['reviews', venueId] });
      queryClient.invalidateQueries({ queryKey: ['venue', venueId] });
      router.back();
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.label}>Rating</Text>
      <StarRating rating={rating} onChange={setRating} starSize={36} style={styles.stars} />

      <Text style={styles.label}>Your Review</Text>
      <TextInput
        style={styles.textArea}
        placeholder="What was good (or not so good)?"
        value={comment}
        onChangeText={setComment}
        multiline
        numberOfLines={5}
        textAlignVertical="top"
      />

      <Text style={styles.label}>Photos (optional)</Text>
      <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
        <Text style={styles.photoButtonText}>Add Photos</Text>
      </TouchableOpacity>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageRow}>
        {images.map((uri, i) => (
          <Image key={i} source={{ uri }} style={styles.thumbnail} />
        ))}
      </ScrollView>

      <TouchableOpacity
        style={[styles.submitButton, submitting && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={submitting}
      >
        {submitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitText}>Submit Review</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 20 },
  label: { fontSize: 16, fontWeight: '600', color: '#1a1a1a', marginBottom: 8, marginTop: 16 },
  stars: { marginBottom: 8 },
  textArea: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    minHeight: 120,
  },
  photoButton: {
    borderWidth: 1.5,
    borderColor: '#FF6B35',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    borderStyle: 'dashed',
  },
  photoButtonText: { color: '#FF6B35', fontWeight: '600' },
  imageRow: { marginTop: 12 },
  thumbnail: { width: 80, height: 80, borderRadius: 8, marginRight: 8 },
  submitButton: {
    backgroundColor: '#FF6B35',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginTop: 32,
  },
  buttonDisabled: { opacity: 0.6 },
  submitText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
