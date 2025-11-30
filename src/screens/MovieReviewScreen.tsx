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
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {MovieReviewScreenProps} from '../types/screentypes';
import Icon from 'react-native-vector-icons/Ionicons'; // Switched to Ionicons

import {Controller, SubmitHandler, useForm} from 'react-hook-form';
import {maxLength, minValue} from '../utils/validators';
import {useSpinner} from '../context/SpinnerContext';
import {addReview} from '../services/ReviewService';
import {
  showToast,
  checkErrorFetchingData,
  getPosterImage,
  formatMinutesToHours,
  getClientImage,
  getRelativeTimeFromNow,
} from '../utils/function';

// --- CINEMATIC DARK THEME CONFIGURATION ---
const THEME = {
  background: '#10111D', // Deep Cinematic Blue/Black
  cardBg: '#1C1D2E', // Slightly lighter panel
  primaryRed: '#FF3B30', // Neon/Cinematic Red
  inputBg: 'rgba(255, 255, 255, 0.05)', // Glassy input
  textWhite: '#FFFFFF',
  textGray: '#A0A0B0',
  textDarkGray: '#5C5D6F',
  starGold: '#FFD700',
  glass: 'rgba(255, 255, 255, 0.08)',
  shadowColor: '#FF3B30', // Red Glow
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
            text1: 'Review Submitted',
            text2: responseData.result || 'Thank you for your feedback!',
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
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <StatusBar
          barStyle="light-content"
          backgroundColor={THEME.background}
        />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.glassButton}
            onPress={() => navigation.goBack()}>
            <Icon name="chevron-back" size={24} color={THEME.textWhite} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Write a Review</Text>
          <View style={{width: 40}} /> 
        </View>

        {/* Movie Summary Card */}
        <View style={styles.movieCard}>
          <Image
            source={{uri: getPosterImage(movie.posterURL)}}
            style={styles.posterImage}
            resizeMode="cover"
          />
          <View style={styles.movieDetails}>
            <Text style={styles.movieTitle} numberOfLines={2}>
              {movie.title}
            </Text>
            <View style={styles.metaRow}>
                <Icon name="film-outline" size={12} color={THEME.primaryRed} style={{marginRight: 4}} />
                <Text style={styles.movieMeta} numberOfLines={1}>
                {movie.genres.map(g => g.name).join(', ')}
                </Text>
            </View>
            <View style={styles.metaRow}>
                <Icon name="time-outline" size={12} color={THEME.primaryRed} style={{marginRight: 4}} />
                <Text style={styles.movieMeta}>
                {formatMinutesToHours(movie.duration)}
                </Text>
            </View>
          </View>
        </View>

        {/* Rating Section */}
        <View style={styles.ratingContainer}>
            <Text style={styles.sectionTitle}>How was the movie?</Text>
            {errors.rating && (
                <Text style={styles.errorText}>{errors.rating.message}</Text>
            )}
            
            <View style={styles.starRow}>
                <Controller
                control={control}
                name="rating"
                rules={{...minValue(1, 'Please select a rating')}}
                render={({field}) => (
                    <>
                    {[1, 2, 3, 4, 5].map(star => (
                        <TouchableOpacity
                        key={star}
                        activeOpacity={0.7}
                        onPress={() => setValue('rating', star === field.value ? 0 : star)}
                        style={styles.starWrapper}>
                        <Icon
                            name={field.value >= star ? 'star' : 'star-outline'}
                            size={36}
                            color={field.value >= star ? THEME.starGold : THEME.textDarkGray}
                            style={field.value >= star ? styles.glowingStar : undefined}
                        />
                        </TouchableOpacity>
                    ))}
                    </>
                )}
                />
            </View>
            
            <Text style={styles.ratingLabel}>
                {watch('rating') > 0 ? `${watch('rating')}.0 Excellent` : 'Tap to Rate'}
            </Text>
        </View>

        {/* Comment Input */}
        <View style={styles.inputSection}>
          <Text style={styles.sectionTitle}>Your Review</Text>
          {errors.comment && (
            <Text style={styles.errorText}>{errors.comment.message}</Text>
          )}
          
          <View style={styles.inputWrapper}>
            <Controller
                control={control}
                name="comment"
                rules={{
                ...maxLength(500, 'Comment cannot exceed 500 characters'),
                }}
                render={({field}) => (
                <TextInput
                    placeholder="Share your thoughts on the plot, acting, and visuals..."
                    placeholderTextColor={THEME.textDarkGray}
                    multiline
                    value={field.value}
                    onChangeText={field.onChange}
                    textAlignVertical="top"
                    style={styles.textInput}
                    maxLength={500}
                />
                )}
            />
            <Text style={styles.charCount}>
                {watch('comment').length}/500
            </Text>
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          style={[
            styles.submitButton,
            {
              opacity:
                watch('rating') > 0 && watch('comment').trim() ? 1 : 0.5,
              shadowOpacity: 
                watch('rating') > 0 && watch('comment').trim() ? 0.4 : 0,
            },
          ]}>
          <Text style={styles.submitText}>Post Review</Text>
          <Icon name="paper-plane" size={18} color="#FFF" style={{marginLeft: 8}} />
        </TouchableOpacity>

        {/* Recent Reviews (Context) */}
        {movie.reviews.length > 0 && (
            <View style={styles.recentSection}>
                <View style={styles.recentHeader}>
                    <Text style={styles.sectionTitle}>Recent Reviews</Text>
                    <Icon name="chatbubbles-outline" size={18} color={THEME.textGray} />
                </View>
                
                {movie.reviews.map((eachReview, index) => (
                    <View key={index} style={styles.reviewCard}>
                        <View style={styles.reviewHeader}>
                            <Image
                                source={{uri: getClientImage(eachReview.client.avatar)}}
                                style={styles.avatar}
                            />
                            <View style={{flex: 1}}>
                                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                    <Text style={styles.reviewerName}>{eachReview.client.name}</Text>
                                    <View style={styles.miniRating}>
                                        <Icon name="star" size={10} color={THEME.starGold} />
                                        <Text style={styles.miniRatingText}>{eachReview.rating}</Text>
                                    </View>
                                </View>
                                <Text style={styles.reviewDate}>
                                    {getRelativeTimeFromNow(eachReview.createdAt)}
                                </Text>
                            </View>
                        </View>
                        <Text style={styles.reviewBody}>{eachReview.comment}</Text>
                    </View>
                ))}
            </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.background,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    marginBottom: 10,
  },
  glassButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: THEME.glass,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: THEME.textWhite,
    letterSpacing: 0.5,
  },
  
  // Movie Card
  movieCard: {
    flexDirection: 'row',
    backgroundColor: THEME.cardBg,
    borderRadius: 16,
    padding: 12,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  posterImage: {
    width: 70,
    height: 105,
    borderRadius: 8,
    backgroundColor: '#000',
  },
  movieDetails: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  movieTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: THEME.textWhite,
    marginBottom: 8,
  },
  metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 4,
  },
  movieMeta: {
    fontSize: 12,
    color: THEME.textGray,
  },

  // Rating
  ratingContainer: {
      alignItems: 'center',
      marginBottom: 30,
  },
  sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: THEME.textWhite,
      marginBottom: 10,
      alignSelf: 'flex-start',
  },
  starRow: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 10,
      marginTop: 5,
  },
  starWrapper: {
      padding: 5,
  },
  glowingStar: {
      textShadowColor: 'rgba(255, 215, 0, 0.5)',
      textShadowOffset: {width: 0, height: 0},
      textShadowRadius: 10,
  },
  ratingLabel: {
      color: THEME.textGray,
      fontSize: 14,
      marginTop: 5,
  },
  errorText: {
      color: THEME.primaryRed,
      fontSize: 12,
      marginBottom: 5,
  },

  // Input
  inputSection: {
      marginBottom: 30,
  },
  inputWrapper: {
      backgroundColor: THEME.inputBg,
      borderRadius: 16,
      padding: 15,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.1)',
  },
  textInput: {
      height: 120,
      color: THEME.textWhite,
      fontSize: 14,
      lineHeight: 22,
  },
  charCount: {
      color: THEME.textDarkGray,
      fontSize: 11,
      alignSelf: 'flex-end',
      marginTop: 8,
  },

  // Button
  submitButton: {
      flexDirection: 'row',
      backgroundColor: THEME.primaryRed,
      height: 56,
      borderRadius: 28,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 40,
      shadowColor: THEME.shadowColor,
      shadowOffset: {width: 0, height: 8},
      shadowRadius: 16,
      elevation: 8,
  },
  submitText: {
      color: '#FFF',
      fontSize: 16,
      fontWeight: 'bold',
      letterSpacing: 1,
  },

  // Reviews List
  recentSection: {
      marginBottom: 40,
  },
  recentHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 15,
  },
  reviewCard: {
      backgroundColor: THEME.cardBg,
      borderRadius: 12,
      padding: 15,
      marginBottom: 12,
  },
  reviewHeader: {
      flexDirection: 'row',
      marginBottom: 10,
  },
  avatar: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: '#333',
      marginRight: 10,
  },
  reviewerName: {
      color: THEME.textWhite,
      fontSize: 13,
      fontWeight: '600',
  },
  miniRating: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(255,255,255,0.05)',
      paddingHorizontal: 5,
      paddingVertical: 2,
      borderRadius: 4,
  },
  miniRatingText: {
      color: THEME.textWhite,
      fontSize: 10,
      fontWeight: 'bold',
      marginLeft: 3,
  },
  reviewDate: {
      color: THEME.textDarkGray,
      fontSize: 10,
      marginTop: 2,
  },
  reviewBody: {
      color: THEME.textGray,
      fontSize: 13,
      lineHeight: 18,
  }
});

export default MovieReviewScreen;