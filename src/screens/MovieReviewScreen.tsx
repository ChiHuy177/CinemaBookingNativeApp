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
} from 'react-native';
import {MovieReviewScreenProps} from '../types/screentypes';

import {Icon} from 'react-native-paper';
import {Controller, SubmitHandler, useForm} from 'react-hook-form';
import {maxLength, minValue} from '../utils/validators';
import {useSpinner} from '../context/SpinnerContext';
import { colors } from '../constant/color';
import { addReview } from '../services/ReviewService';
import { showToast, checkErrorFetchingData, getPosterImage, formatMinutesToHours, getClientImage, getRelativeTimeFromNow } from '../utils/function';


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
    <ScrollView style={[styles.container, {backgroundColor: colors.dark}]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon source="chevron-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, {color: colors.white}]}>
          Review Film
        </Text>
        <View style={styles.placeholder} />
      </View>

      <View style={[styles.movieCard, {backgroundColor: colors.mediumGray}]}>
        <View style={styles.movieInfo}>
          <View style={[styles.poster, {backgroundColor: colors.lightGray}]}>
            <Text style={[styles.posterText, {color: colors.dark}]}>
              <Image
                source={{uri: getPosterImage(movie.posterURL)}}
                style={styles.posterImage}
                resizeMode="cover"
              />
            </Text>
          </View>
          <View style={styles.movieDetails}>
            <Text
              style={[styles.movieTitle, {color: colors.white}]}
              ellipsizeMode="tail"
              numberOfLines={2}>
              {movie.title}
            </Text>
            <Text style={[styles.movieMeta, {color: colors.lightGray}]}>
              Genres: {movie.genres.map(eachGenre => eachGenre.name).join(', ')}
            </Text>
            <Text style={[styles.movieMeta, {color: colors.lightGray}]}>
              Duration: {formatMinutesToHours(movie.duration)}
            </Text>
          </View>
        </View>
      </View>

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
                    <Text
                      style={[
                        styles.starIcon,
                        {
                          color:
                            field.value >= star
                              ? colors.primary
                              : colors.lightGray,
                        },
                      ]}>
                      ★
                    </Text>
                  </TouchableOpacity>
                ))}
              </>
            )}
          />
        </View>
        {watch('rating') > 0 && (
          <Text style={[styles.ratingText, {color: colors.primary}]}>
            {watch('rating')} / 5 stars
          </Text>
        )}
      </View>

      <View style={styles.commentSection}>
        <Text style={[styles.sectionTitle, {color: colors.white}]}>
          Your Feedback
        </Text>
        <View
          style={[
            styles.commentContainer,
            {backgroundColor: colors.mediumGray},
          ]}>
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
                placeholder="Enter your comment here..."
                placeholderTextColor={colors.lightGray}
                keyboardType="email-address"
                multiline
                value={field.value}
                textAlignVertical="top"
                onChangeText={field.onChange}
                autoCapitalize="none"
                autoCorrect={false}
                maxLength={500}
                style={[styles.commentInput, {color: colors.white}]}
              />
            )}
          />
          <View style={styles.characterCount}>
            <Text
              style={[styles.characterCountText, {color: colors.lightGray}]}>
              {watch('comment').length}/500
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        onPress={handleSubmit(onSubmit)}
        disabled={isSubmitting}
        style={[
          styles.submitButton,
          {
            backgroundColor:
              watch('rating') > 0 && watch('comment').trim()
                ? colors.primary
                : colors.lightGray,
            opacity: watch('rating') > 0 && watch('comment').trim() ? 1 : 0.5,
          },
        ]}>
        <Text style={styles.submitButtonText}>
          <Icon source="send" size={20} color="white" /> {'   '}Send
        </Text>
      </TouchableOpacity>

      <View style={styles.recentReviews}>
        <Text style={[styles.sectionTitle, {color: colors.white}]}>
          Recent Reviews
        </Text>
        {movie.reviews.map(eachReview => (
          <View
            style={[styles.reviewItem, {backgroundColor: colors.mediumGray}]}>
            <View style={styles.reviewHeader}>
              <Image
                source={{uri: getClientImage(eachReview.client.avatar)}}
                resizeMode="cover"
                style={[styles.avatar]}
              />

              <View style={styles.reviewInfo}>
                <View style={styles.reviewTopRow}>
                  <Text style={[styles.userName, {color: colors.white}]}>
                    {eachReview.client.name}
                  </Text>
                  <View style={styles.reviewStars}>
                    {[1, 2, 3, 4, 5].map(star => (
                      <Text
                        key={star}
                        style={[
                          styles.smallStar,
                          {
                            color:
                              star <= eachReview.rating
                                ? colors.primary
                                : colors.lightGray,
                          },
                        ]}>
                        ★
                      </Text>
                    ))}
                  </View>
                </View>
                <Text style={[styles.reviewComment, {color: colors.lightGray}]}>
                  {eachReview.comment}
                </Text>
                <Text style={[styles.reviewDate, {color: colors.lightGray}]}>
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
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingTop: 50,
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 40,
  },
  movieCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  movieInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  poster: {
    width: 80,
    height: 112,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  posterText: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
  },
  posterImage: {
    width: 120,
    height: 180,
    borderRadius: 8,
  },
  movieDetails: {
    flex: 1,
  },
  movieTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  movieMeta: {
    fontSize: 14,
    marginBottom: 2,
  },
  ratingSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  starContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginVertical: 16,
  },
  starButton: {
    padding: 8,
  },
  starIcon: {
    fontSize: 32,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
  commentSection: {
    marginBottom: 24,
  },
  commentContainer: {
    borderRadius: 12,
    padding: 16,
  },
  commentInput: {
    height: 120,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  characterCount: {
    alignItems: 'flex-end',
    marginTop: 8,
  },
  characterCountText: {
    fontSize: 12,
  },
  submitButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 32,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  recentReviews: {
    marginBottom: 32,
  },
  reviewItem: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  reviewInfo: {
    flex: 1,
  },
  reviewTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 8,
  },
  reviewStars: {
    flexDirection: 'row',
  },
  smallStar: {
    fontSize: 12,
  },
  reviewComment: {
    fontSize: 14,
    marginBottom: 4,
    lineHeight: 20,
  },
  reviewDate: {
    fontSize: 12,
  },
  error: {color: 'red', marginBottom: 10},
});

export default MovieReviewScreen;
