/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {SearchScreenProps} from '../types/screentypes';
import {Controller, SubmitHandler, useForm} from 'react-hook-form';
import {Icon} from 'react-native-paper';
import {required} from '../utils/validators';

// THEME CONSTANTS EXTRACTED FROM IMAGE
const THEME = {
  background: '#13141F', // Dark blue-black background
  primaryRed: '#F54B64', // Coral red
  cardBg: '#20212D',     // Slightly lighter for cards/buttons
  inputBg: '#2A2C3A',    // Input background
  textWhite: '#FFFFFF',
  textGray: '#8F9BB3',   // Muted blue-gray text
  borderColor: 'rgba(255,255,255,0.08)',
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
    navigation.navigate('MovieListScreen', {
      searchValue: data.searchText,
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={THEME.background} barStyle="light-content" />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon source="chevron-left" size={28} color={THEME.textWhite} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Search</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <View style={styles.iconContainer}>
             <Icon source="magnify" size={24} color={THEME.textGray} />
          </View>
          
          <Controller
            control={control}
            name="searchText"
            rules={{
              ...required('Search text is required'),
            }}
            render={({field}) => (
              <TextInput
                placeholder="Search by name or genre"
                placeholderTextColor={THEME.textGray}
                value={field.value}
                onChangeText={field.onChange}
                style={styles.searchInput}
                autoCapitalize="none"
                autoCorrect={false}
              />
            )}
          />
          {watch('searchText').length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => setValue('searchText', '')}>
              <Icon source="close-circle" size={20} color={THEME.textGray} />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={styles.searchButton}
          disabled={isSubmitting}
          onPress={handleSubmit(onSubmit)}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {errors.searchText && (
        <Text style={[styles.error, styles.errorContainer]}>
          {errors.searchText.message}
        </Text>
      )}
    </SafeAreaView>
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
    paddingVertical: 10,
    marginBottom: 10,
  },
  backButton: {
    padding: 6,
    borderRadius: 10,
    backgroundColor: THEME.cardBg,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: THEME.textWhite,
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',
    gap: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.inputBg,
    borderRadius: 16,
    paddingHorizontal: 12,
    height: 52, // Fixed height for consistency
    borderWidth: 1,
    borderColor: THEME.borderColor,
  },
  iconContainer: {
      marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: THEME.textWhite,
    padding: 0, // Reset padding
  },
  clearButton: {
    padding: 4,
  },
  searchButton: {
    backgroundColor: THEME.primaryRed,
    paddingHorizontal: 20,
    height: 52, // Match input height
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    shadowColor: THEME.primaryRed,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  error: {
    color: '#FF453A',
    marginBottom: 10,
    fontSize: 13,
  },
  errorContainer: {
    marginLeft: 24,
    marginTop: 5,
  },
});