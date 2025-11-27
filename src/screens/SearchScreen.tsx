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
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon source="chevron-left" size={30} color="#FF8133" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Search</Text>
        <View style={styles.placeholder} />
      </View>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <Controller
            control={control}
            name="searchText"
            rules={{
              ...required('Search text is required'),
            }}
            render={({field}) => (
              <TextInput
                placeholder="Search by name or genre"
                placeholderTextColor="#C5C5C5"
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
              <Text style={styles.clearIcon}>×</Text>
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
    backgroundColor: '#2f2f2f',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FF8133',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  placeholder: {
    width: 32,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    gap: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3D3D3D',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
    color: '#C5C5C5',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
    padding: 0,
  },
  clearButton: {
    padding: 4,
  },
  clearIcon: {
    fontSize: 20,
    color: '#C5C5C5',
  },
  searchButton: {
    backgroundColor: '#FF8133',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  error: {color: 'red', marginBottom: 10},
  errorContainer: {
    marginLeft: 20,
  },
});
