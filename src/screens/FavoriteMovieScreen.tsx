/* eslint-disable react-hooks/exhaustive-deps */
import {useCallback, useState} from 'react';
import {FavoriteScreenProps} from '../types/screentypes';
import {MovieListProps} from '../types/movie';
import {useSpinner} from '../context/SpinnerContext';

import {SafeAreaView} from 'react-native-safe-area-context';
import {ScrollView, StatusBar, StyleSheet, Text, View, Dimensions, TouchableOpacity, Image} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {getFavoriteMovies} from '../services/MovieService';
import {checkErrorFetchingData, getPosterImage} from '../utils/function';
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

// THEME CONSTANTS
const THEME = {
  background: '#10111D',
  cardBg: '#1F2130',
  accent: '#F74346',
  textWhite: '#FFFFFF',
  textGray: '#8F90A6',
  textPlaceholder: '#5C5E6F',
  error: '#F74346',
};

export const FavoriteMovieScreen: React.FC<FavoriteScreenProps> = ({
  navigation,
}) => {
  const [movies, setMovies] = useState<MovieListProps[]>([]);
  const {showSpinner, hideSpinner} = useSpinner();

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchFavoriteMovies = async () => {
        try {
          showSpinner();
          const responseData = await getFavoriteMovies();
          if (responseData.code === 1000 && isActive) {
            setMovies(responseData.result);
          }
        } catch (error) {
          checkErrorFetchingData({
            error,
            title: 'Error getting favorite movies',
          });
        } finally {
          hideSpinner();
        }
      };

      fetchFavoriteMovies();

      return () => {
        isActive = false;
      };
    }, []),
  );

  const isListEmpty = movies.length === 0;

  const renderMovieCard = (movie: MovieListProps, index: number) => {
    const isEven = index % 2 === 0;
    return (
      <TouchableOpacity
        key={movie.movieId}
        style={[
          styles.movieCard,
          isEven ? styles.movieCardLeft : styles.movieCardRight,
        ]}
        onPress={() =>
          navigation.navigate('HomeStack', {
            screen: 'MovieDetailScreen',
            params: {
              movieId: movie.movieId,
            },
          })
        }>
        <View style={styles.movieImageContainer}>
          <Image
            source={{uri: getPosterImage(movie.posterURL)}}
            style={styles.movieImage}
            resizeMode="cover"
          />
          <View style={styles.movieOverlay} />
          <View style={styles.heartBadge}>
            <Icon name="heart" size={16} color={THEME.accent} />
          </View>
        </View>
        <View style={styles.movieInfo}>
          <Text style={styles.movieTitle} numberOfLines={2}>
            {movie.title}
          </Text>
          <View style={styles.movieMeta}>
            <Icon name="star" size={12} color="#FFD700" />
            <Text style={styles.movieRating}>{movie.rating}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={THEME.background} barStyle="light-content" />
      
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.iconCircle}>
              <Icon name="heart" size={28} color={THEME.accent} />
            </View>
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerTitle}>My Favorites</Text>
              <Text style={styles.headerSubtitle}>
                {movies.length} {movies.length === 1 ? 'movie' : 'movies'}
              </Text>
            </View>
          </View>
        </View>

        {isListEmpty ? (
          <View style={styles.emptyStateContainer}>
            <View style={styles.emptyIconWrapper}>
              <View style={styles.emptyIconCircle}>
                <Icon name="heart-outline" size={64} color={THEME.textPlaceholder} />
              </View>
              <View style={styles.emptyGlow} />
            </View>
            <Text style={styles.emptyTitle}>No Favorites Yet</Text>
            <Text style={styles.emptySubtitle}>
              Start building your collection by adding movies you love!
            </Text>
            <TouchableOpacity 
              style={styles.exploreButton}
              onPress={() => navigation.navigate('HomeStack', { screen: 'HomeScreen' } as any)}
            >
              <Icon name="film-outline" size={20} color="#FFF" />
              <Text style={styles.exploreButtonText}>Explore Movies</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView 
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.gridContainer}>
              {movies.map((movie, index) => renderMovieCard(movie, index))}
            </View>
          </ScrollView>
        )}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.background,
  },
  safeArea: {
    flex: 1,
  },

  // Header
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(247, 67, 70, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: 'rgba(247, 67, 70, 0.25)',
  },
  headerTextContainer: {
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: THEME.textWhite,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: THEME.textGray,
    fontWeight: '500',
  },

  // Grid Layout
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
  },
  movieCard: {
    width: (width - 52) / 2,
    marginBottom: 20,
    backgroundColor: THEME.cardBg,
    borderRadius: 20,
    overflow: 'hidden',
  },
  movieCardLeft: {
    marginRight: 12,
  },
  movieCardRight: {
    marginLeft: 0,
  },
  movieImageContainer: {
    width: '100%',
    height: 240,
    position: 'relative',
  },
  movieImage: {
    width: '100%',
    height: '100%',
  },
  movieOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  heartBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(247, 67, 70, 0.5)',
  },
  movieInfo: {
    padding: 14,
  },
  movieTitle: {
    color: THEME.textWhite,
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
    lineHeight: 20,
  },
  movieMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  movieRating: {
    color: THEME.textGray,
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 6,
  },

  // Empty State
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    marginTop: -40,
  },
  emptyIconWrapper: {
    position: 'relative',
    marginBottom: 32,
  },
  emptyIconCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    zIndex: 2,
  },
  emptyGlow: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    bottom: 10,
    borderRadius: 60,
    backgroundColor: THEME.accent,
    opacity: 0.08,
    zIndex: 1,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: THEME.textWhite,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 15,
    color: THEME.textGray,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  exploreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.accent,
    paddingHorizontal: 28,
    paddingVertical: 16,
    borderRadius: 28,
    gap: 10,
    shadowColor: THEME.accent,
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  exploreButtonText: {
    color: THEME.textWhite,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});