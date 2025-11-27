/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  StatusBar,
} from 'react-native';
import {MovieReviewScreenProps} from '../types/screentypes';

import {Icon} from 'react-native-paper';
import {Controller, SubmitHandler, useForm} from 'react-hook-form';
import {maxLength, minValue} from '../utils/validators';
import {useSpinner} from '../context/SpinnerContext';
// Removed external colors import to use local THEME matching the image
// import { colors } from '../constant/color'; 
import { addReview } from '../services/ReviewService';
import { showToast, checkErrorFetchingData, getPosterImage, formatMinutesToHours, getClientImage, getRelativeTimeFromNow } from '../utils/function';

// THEME CONSTANTS EXTRACTED FROM IMAGE
const THEME = {
  background: '#13141F', // Dark blue-black background
  primaryRed: '#F54B64', // Coral red
  cardBg: '#20212D',     // Slightly lighter for cards
  inputBg: '#2A2C3A',    // Input field background
  textWhite: '#FFFFFF',
  textGray: '#8F9BB3',   // Muted blue-gray text
  starGold: '#FFD700',   // Gold for stars
};

interface FormData {
  rating: number;
  comment: string;
  movieId: number;
}

const MovieReviewScreen: React.FC<MovieReviewScreenProps> = ({
  route,
  navigation,
}) => {
  const movie = useMemo(() => {
    return route.params;
  }, [route.params]);

  const {
    control,
    formState: {errors, isSubmitting},
    handleSubmit,
    watch,
    setValue,
  } = useForm<FormData>({
    defaultValues: {
      comment: '',
      rating: 0,
      movieId: movie.movieId,
    },
  });

  const {showSpinner, hideSpinner} = useSpinner();

  const onSubmit: SubmitHandler<FormData> = useCallback(
    async data => {
      try {
        showSpinner();
        const responseData = await addReview(data);
        if (responseData.code === 1000) {
          showToast({
            type: 'success',
            text1: responseData.result,
          });
          navigation.navigate('MovieDetailScreen', {
            movieId: movie.movieId,
          });
        }
      } catch (error) {
        checkErrorFetchingData({
          error: error,
          title: 'Error Submitting Review',
        });
      } finally {
        hideSpinner();
      }
    },
    [movie],
  );

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={THEME.background} />
      
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon source="chevron-left" size={28} color={THEME.textWhite} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          Review Film
        </Text>
        <View style={styles.placeholder} />
      </View>

      {/* Movie Info Card */}
      <View style={styles.movieCard}>
        <View style={styles.movieInfo}>
          <View style={styles.poster}>
             <Image
                source={{uri: getPosterImage(movie.posterURL)}}
                style={styles.posterImage}
                resizeMode="cover"
              />
          </View>
          <View style={styles.movieDetails}>
            <Text
              style={styles.movieTitle}
              ellipsizeMode="tail"
              numberOfLines={2}>
              {movie.title}
            </Text>
            <Text style={styles.movieMeta}>
              {movie.genres.map(eachGenre => eachGenre.name).join(', ')}
            </Text>
            <Text style={styles.movieMeta}>
              Duration: {formatMinutesToHours(movie.duration)}
            </Text>
          </View>
        </View>
      </View>

      {/* Rating Stars Section */}
      <View style={styles.ratingSection}>
        {errors.rating && (
          <Text style={styles.error}>{errors.rating.message}</Text>
        )}
        <View style={styles.starContainer}>
          <Controller
            control={control}
            name="rating"
            rules={{
              ...minValue(1, 'Rating must be at least 1 star'),
            }}
            render={({field}) => (
              <>
                {[1, 2, 3, 4, 5].map(star => (
                  <TouchableOpacity
                    key={star}
                    onPress={() =>
                      setValue('rating', star === field.value ? 0 : star)
                    }
                    style={styles.starButton}>
                    <Icon 
                        source={field.value >= star ? "star" : "star-outline"} 
                        size={32} 
                        color={field.value >= star ? THEME.starGold : THEME.textGray} 
                    />
                  </TouchableOpacity>
                ))}
              </>
            )}
          />
        </View>
        {watch('rating') > 0 && (
          <Text style={styles.ratingText}>
            {watch('rating')} / 5 stars
          </Text>
        )}
      </View>

      {/* Comment Section */}
      <View style={styles.commentSection}>
        <Text style={styles.sectionTitle}>
          Your Feedback
        </Text>
        <View style={styles.commentContainer}>
          {errors.comment && (
            <Text style={styles.error}>{errors.comment.message}</Text>
          )}
          <Controller
            control={control}
            name="comment"
            rules={{
              ...maxLength(500, 'Comment must be less than 500 characters'),
            }}
            render={({field}) => (
              <TextInput
                placeholder="Share your thoughts on the movie..."
                placeholderTextColor={THEME.textGray}
                keyboardType="default"
                multiline
                value={field.value}
                textAlignVertical="top"
                onChangeText={field.onChange}
                autoCapitalize="sentences"
                autoCorrect={false}
                maxLength={500}
                style={styles.commentInput}
              />
            )}
          />
          <View style={styles.characterCount}>
            <Text style={styles.characterCountText}>
              {watch('comment').length}/500
            </Text>
          </View>
        </View>
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        onPress={handleSubmit(onSubmit)}
        disabled={isSubmitting}
        style={[
          styles.submitButton,
          {
            backgroundColor:
              watch('rating') > 0 && watch('comment').trim()
                ? THEME.primaryRed
                : THEME.cardBg, // Dimmed state
            opacity: watch('rating') > 0 && watch('comment').trim() ? 1 : 0.6,
          },
        ]}>
        <Text style={styles.submitButtonText}>
            <Icon source="send" size={18} color="white" />
            {'  '}Submit Review
        </Text>
      </TouchableOpacity>

      {/* Recent Reviews List */}
      <View style={styles.recentReviews}>
        <Text style={styles.sectionTitle}>
          Recent Reviews
        </Text>
        {movie.reviews.map((eachReview, index) => (
          <View
            key={index}
            style={styles.reviewItem}>
            <View style={styles.reviewHeader}>
              <Image
                source={{uri: getClientImage(eachReview.client.avatar)}}
                resizeMode="cover"
                style={styles.avatar}
              />

              <View style={styles.reviewInfo}>
                <View style={styles.reviewTopRow}>
                  <Text style={styles.userName}>
                    {eachReview.client.name}
                  </Text>
                  <View style={styles.reviewStars}>
                    <Icon source="star" size={12} color={THEME.starGold} />
                    <Text style={styles.reviewScore}>{eachReview.rating}/5</Text>
                  </View>
                </View>
                <Text style={styles.reviewComment}>
                  {eachReview.comment}
                </Text>
                <Text style={styles.reviewDate}>
                  {getRelativeTimeFromNow(eachReview.createdAt)}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: THEME.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    marginBottom: 10,
  },
  backButton: {
    padding: 8,
    backgroundColor: THEME.cardBg,
    borderRadius: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: THEME.textWhite,
  },
  placeholder: {
    width: 44, // Balance the back button width
  },
  movieCard: {
    backgroundColor: THEME.cardBg,
    borderRadius: 20,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  movieInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  poster: {
    marginRight: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  posterImage: {
    width: 80,
    height: 120,
    borderRadius: 12,
    backgroundColor: '#000',
  },
  movieDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: THEME.textWhite,
    letterSpacing: 0.5,
  },
  movieMeta: {
    fontSize: 13,
    marginBottom: 4,
    color: THEME.textGray,
    fontWeight: '500',
  },
  ratingSection: {
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: THEME.cardBg,
    padding: 20,
    borderRadius: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    color: THEME.textWhite,
  },
  starContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
    marginVertical: 10,
  },
  starButton: {
    padding: 2,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 10,
    color: THEME.primaryRed,
  },
  commentSection: {
    marginBottom: 24,
  },
  commentContainer: {
    backgroundColor: THEME.inputBg,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  commentInput: {
    height: 120,
    fontSize: 15,
    textAlignVertical: 'top',
    color: THEME.textWhite,
    lineHeight: 22,
  },
  characterCount: {
    alignItems: 'flex-end',
    marginTop: 8,
  },
  characterCountText: {
    fontSize: 12,
    color: THEME.textGray,
  },
  submitButton: {
    borderRadius: 30, // Pill shape
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 40,
    shadowColor: THEME.primaryRed,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  recentReviews: {
    marginBottom: 40,
  },
  reviewItem: {
    backgroundColor: THEME.cardBg,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: '#333',
  },
  reviewInfo: {
    flex: 1,
  },
  reviewTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  userName: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.textWhite,
    marginRight: 8,
  },
  reviewStars: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  reviewScore: {
    color: THEME.textWhite,
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  reviewComment: {
    fontSize: 13,
    marginBottom: 8,
    lineHeight: 20,
    color: '#D1D5DB', // Slightly lighter than gray
  },
  reviewDate: {
    fontSize: 11,
    color: THEME.textGray,
    textAlign: 'right',
  },
  error: {
    color: '#FF453A', // System red for errors
    marginBottom: 10,
    fontSize: 13,
    textAlign: 'center',
  },
});

export default MovieReviewScreen;