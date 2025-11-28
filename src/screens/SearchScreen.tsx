/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {SearchScreenProps} from '../types/screentypes';
import {Controller, SubmitHandler, useForm} from 'react-hook-form';
import Icon from 'react-native-vector-icons/Ionicons'; // Switched to Ionicons
import {required} from '../utils/validators';

// --- CINEMATIC DARK THEME CONFIGURATION ---
const THEME = {
  background: '#10111D', // Deep Cinematic Blue/Black
  cardBg: '#1C1D2E', // Slightly lighter panel
  primaryRed: '#FF3B30', // Neon/Cinematic Red
  inputBg: 'rgba(255, 255, 255, 0.05)', // Glassy input
  textWhite: '#FFFFFF',
  textGray: '#A0A0B0',
  textDarkGray: '#5C5D6F',
  glass: 'rgba(255, 255, 255, 0.08)',
  border: 'rgba(255, 255, 255, 0.05)',
  shadowColor: '#FF3B30',
};

interface FormData {
  searchText: string;
}

export const SearchScreen: React.FC<SearchScreenProps> = ({navigation}) => {
  const {
    control,
    formState: {isSubmitting, errors},
    handleSubmit,
    watch,
    setValue,
  } = useForm<FormData>({defaultValues: {searchText: ''}});

  const onSubmit: SubmitHandler<FormData> = useCallback(async data => {
    Keyboard.dismiss();
    navigation.navigate('MovieListScreen', {
      searchValue: data.searchText,
    });
  }, []);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <StatusBar
          backgroundColor={THEME.background}
          barStyle="light-content"
        />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.glassButton}
            onPress={() => navigation.goBack()}>
            <Icon name="chevron-back" size={24} color={THEME.textWhite} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Search Movies</Text>
          <View style={{width: 40}} /> 
        </View>

        {/* Search Section */}
        <View style={styles.contentContainer}>
          <View style={styles.searchRow}>
            <View style={styles.inputWrapper}>
              <Icon
                name="search-outline"
                size={22}
                color={THEME.textGray}
                style={styles.searchIcon}
              />
              <Controller
                control={control}
                name="searchText"
                rules={{
                  ...required('Please enter a movie name'),
                }}
                render={({field}) => (
                  <TextInput
                    placeholder="Find movies, genres..."
                    placeholderTextColor={THEME.textDarkGray}
                    value={field.value}
                    onChangeText={field.onChange}
                    style={styles.searchInput}
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="search"
                    onSubmitEditing={handleSubmit(onSubmit)}
                  />
                )}
              />
              {watch('searchText').length > 0 && (
                <TouchableOpacity
                  style={styles.clearButton}
                  onPress={() => setValue('searchText', '')}>
                  <Icon
                    name="close-circle"
                    size={20}
                    color={THEME.textDarkGray}
                  />
                </TouchableOpacity>
              )}
            </View>

            <TouchableOpacity
              style={styles.searchButton}
              disabled={isSubmitting}
              activeOpacity={0.8}
              onPress={handleSubmit(onSubmit)}>
              <Icon name="arrow-forward" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>

          {errors.searchText && (
            <View style={styles.errorContainer}>
               <Icon name="alert-circle-outline" size={16} color={THEME.primaryRed} />
               <Text style={styles.errorText}>{errors.searchText.message}</Text>
            </View>
          )}

          {/* Optional: Visual filler for empty search state */}
          <View style={styles.decorationContainer}>
              <View style={styles.iconCircle}>
                  <Icon name="film-outline" size={60} color={THEME.cardBg} />
              </View>
              <Text style={styles.decorationText}>Explore the Cinematic Universe</Text>
          </View>

        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginBottom: 20,
  },
  glassButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: THEME.glass,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: THEME.textWhite,
    letterSpacing: 0.5,
  },
  
  contentContainer: {
    paddingHorizontal: 20,
    flex: 1,
  },
  
  // Search Row
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.inputBg,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: THEME.textWhite,
    paddingVertical: 0,
  },
  clearButton: {
    padding: 5,
  },
  
  // Search Button
  searchButton: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: THEME.primaryRed,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: THEME.shadowColor,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  
  // Error
  errorContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 10,
      marginLeft: 5,
  },
  errorText: {
    color: THEME.primaryRed,
    fontSize: 13,
    marginLeft: 6,
    fontWeight: '500',
  },

  // Decoration (Empty State)
  decorationContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      opacity: 0.5,
      marginTop: -40, // Offset slightly up
  },
  iconCircle: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: 'rgba(255,255,255,0.03)',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.05)',
  },
  decorationText: {
      color: THEME.textGray,
      fontSize: 14,
      letterSpacing: 1,
      textTransform: 'uppercase',
  }
});