/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  StatusBar,
} from 'react-native';
import {ProfileScreenProps} from '../types/screentypes';
import {SafeAreaView} from 'react-native-safe-area-context';

import {navigate} from '../utils/navigation';
import { useFocusEffect } from '@react-navigation/native';
import { Icon } from 'react-native-paper';
import RankBadge from '../components/RankBadge';
import { colors, getRankColor } from '../constant/color';
import { useSpinner } from '../context/SpinnerContext';
import { logout } from '../services/AuthService';
import { getClient } from '../services/ClientService';
import { ClientProfileProps } from '../types/client';
import { checkErrorFetchingData, getClientImage } from '../utils/function';

const ProfileScreen: React.FC<ProfileScreenProps> = ({navigation}) => {
  const [client, setClient] = useState<ClientProfileProps | null>(null);

  const {showSpinner, hideSpinner} = useSpinner();

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      const fetchClientProfile = async () => {
        try {
          showSpinner();
          const responseData = await getClient();
          if (responseData.code === 1000 && isActive) {
            setClient({
              ...responseData.result,
              doB: new Date(responseData.result.doB),
            });
          }
        } catch (error) {
          checkErrorFetchingData({
            error: error,
            title: 'Error getting client profile',
          });
        } finally {
          hideSpinner();
        }
      };

      fetchClientProfile();

      return () => {
        isActive = false;
      };
    }, []),
  );

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: colors.dark}]}>
      <StatusBar backgroundColor={colors.dark} barStyle="light-content" />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        <View
          style={[styles.profileHeader, {backgroundColor: colors.mediumGray}]}>
          <View style={styles.avatarContainer}>
            <Image
              source={{uri: getClientImage(client?.avatar || '')}}
              style={[styles.avatar, {borderColor: colors.primary}]}
            />
            <View style={styles.rankContainer}>
              <RankBadge rankName={client?.rank.name || ''} />
            </View>
          </View>

          <View style={styles.userInfo}>
            <Text style={[styles.userName, {color: colors.white}]}>
              {client?.name}
            </Text>
            <View style={styles.pointsContainer}>
              <Text style={[styles.pointsLabel, {color: colors.lightGray}]}>
                Loyal Points
              </Text>
              <Text
                style={[
                  styles.pointsValue,
                  {color: getRankColor(client?.rank.name || '')},
                ]}>
                {client?.loyalPoints.toLocaleString('vi-VN')}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, {color: colors.white}]}>
            Profile
          </Text>

          <TouchableOpacity
            onPress={() => {
              if (client) {
                navigation.navigate('EditProfileScreen', {
                  clientId: client.clientId,
                  address: client.address,
                  avatarObject: {
                    uri: getClientImage(client.avatar),
                    fileName: '',
                    type: '',
                  },
                  city: client.city,
                  doB: client.doB,
                  email: client.email,
                  genre: client.genre,
                  name: client.name,
                  phoneNumber: client.phoneNumber,
                });
              }
            }}
            style={[styles.actionButton, {backgroundColor: colors.mediumGray}]}
            activeOpacity={0.7}>
            <Icon source="pencil" size={24} color={colors.primary} />
            <Text style={[styles.actionText, {color: colors.white}]}>Edit</Text>
            <Icon source="chevron-right" size={24} color={colors.lightGray} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              if (client) {
                navigation.navigate('ChangePasswordScreen', {
                  email: client.email,
                });
              }
            }}
            style={[styles.actionButton, {backgroundColor: colors.mediumGray}]}
            activeOpacity={0.7}>
            <Icon source="security" size={24} color={colors.primary} />
            <Text style={[styles.actionText, {color: colors.white}]}>
              Change Password
            </Text>
            <Icon source="chevron-right" size={24} color={colors.lightGray} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, {color: colors.white}]}>
            Booking
          </Text>

          <TouchableOpacity
            style={[styles.actionButton, {backgroundColor: colors.mediumGray}]}
            activeOpacity={0.7}
            onPress={() => {
              navigate('MainTabs', {
                screen: 'HomeStack',
                params: {
                  screen: 'CinemaListScreen',
                },
              });
            }}>
            <Icon source="theater" size={24} color={colors.primary} />
            <Text style={[styles.actionText, {color: colors.white}]}>
              By Cinemas
            </Text>
            <Icon source="chevron-right" size={24} color={colors.lightGray} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, {backgroundColor: colors.mediumGray}]}
            activeOpacity={0.7}
            onPress={() => {
              navigate('MainTabs', {
                screen: 'HomeStack',
                params: {
                  screen: 'MovieListScreen',
                  params: {
                    searchValue: '',
                  },
                },
              });
            }}>
            <Icon source="movie-roll" size={24} color={colors.primary} />
            <Text style={[styles.actionText, {color: colors.white}]}>
              By Films
            </Text>
            <Icon source="chevron-right" size={24} color={colors.lightGray} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, {color: colors.white}]}>Menu</Text>

          <TouchableOpacity
            style={[styles.menuItem, {backgroundColor: colors.mediumGray}]}
            onPress={() =>
              navigate('MainTabs', {
                screen: 'HomeStack',
                params: {
                  screen: 'HomeScreen',
                },
              })
            }
            activeOpacity={0.7}>
            <Icon source="home" size={24} color={colors.primary} />
            <Text style={[styles.menuText, {color: colors.white}]}>Home</Text>
            <Icon source="chevron-right" size={24} color={colors.lightGray} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.menuItem, {backgroundColor: colors.mediumGray}]}
            activeOpacity={0.7}
            onPress={() =>
              navigate('MainTabs', {
                screen: 'HomeStack',
                params: {
                  screen: 'MyTicketsScreen',
                },
              })
            }>
            <Icon source="ticket" size={24} color={colors.primary} />
            <Text style={[styles.menuText, {color: colors.white}]}>
              My Tickets
            </Text>
            <Icon source="chevron-right" size={24} color={colors.lightGray} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.menuItem, {backgroundColor: colors.mediumGray}]}
            onPress={() =>
              navigation.navigate('CouponListScreen', {
                clientEmail: client?.email || '',
              })
            }
            activeOpacity={0.7}>
            <Icon source="gift" size={24} color={colors.primary} />
            <Text style={[styles.menuText, {color: colors.white}]}>
              Coupons
            </Text>
            <Icon source="chevron-right" size={24} color={colors.lightGray} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => logout()}
          style={[styles.logoutButton, {borderColor: colors.primary}]}
          activeOpacity={0.7}>
          <Icon source="logout" size={24} color={colors.primary} />
          <Text style={[styles.logoutText, {color: colors.primary}]}>
            Logout
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 15,
    marginTop: 20,
    marginBottom: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
  },
  rankContainer: {
    position: 'absolute',
    bottom: -8,
    right: -8,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  pointsContainer: {
    flexDirection: 'column',
  },
  pointsLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  pointsValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 10,
  },
  demoSection: {
    padding: 20,
    borderRadius: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
    marginLeft: 15,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  menuText: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
    marginLeft: 15,
  },
  rankButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  rankButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 2,
    minWidth: 80,
    alignItems: 'center',
    flex: 1,
    maxWidth: '22%',
  },
  rankButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: 20,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default ProfileScreen;
