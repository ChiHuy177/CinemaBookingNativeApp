/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
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
// Kept getRankColor logic, removed 'colors' object to use local THEME
import { getRankColor } from '../constant/color';
import { useSpinner } from '../context/SpinnerContext';
import { logout } from '../services/AuthService';
import { getClient } from '../services/ClientService';
import { ClientProfileProps } from '../types/client';
import { checkErrorFetchingData, getClientImage } from '../utils/function';

// THEME CONSTANTS EXTRACTED FROM IMAGE
const THEME = {
  background: '#13141F', // Dark blue-black background
  primaryRed: '#F54B64', // Coral red
  cardBg: '#20212D',     // Slightly lighter for cards
  textWhite: '#FFFFFF',
  textGray: '#8F9BB3',   // Muted blue-gray text
  borderColor: 'rgba(255,255,255,0.1)',
};

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
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={THEME.background} barStyle="light-content" />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        
        {/* User Info Card */}
        <View
          style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Image
              source={{uri: getClientImage(client?.avatar || '')}}
              style={styles.avatar}
            />
            <View style={styles.rankContainer}>
              <RankBadge rankName={client?.rank.name || ''} />
            </View>
          </View>

          <View style={styles.userInfo}>
            <Text style={styles.userName}>
              {client?.name}
            </Text>
            <View style={styles.pointsContainer}>
              <Text style={styles.pointsLabel}>
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

        {/* Profile Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
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
            style={styles.actionButton}
            activeOpacity={0.7}>
            <Icon source="pencil" size={24} color={THEME.primaryRed} />
            <Text style={styles.actionText}>Edit Profile</Text>
            <Icon source="chevron-right" size={24} color={THEME.textGray} />
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => {
              if (client) {
                navigation.navigate('ChangePasswordScreen', {
                  email: client.email,
                });
              }
            }}
            style={styles.actionButton}
            activeOpacity={0.7}>
            <Icon source="lock" size={24} color={THEME.primaryRed} />
            <Text style={styles.actionText}>
              Change Password
            </Text>
            <Icon source="chevron-right" size={24} color={THEME.textGray} />
          </TouchableOpacity>
        </View>

        {/* Booking Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Booking
          </Text>

          <TouchableOpacity
            style={styles.actionButton}
            activeOpacity={0.7}
            onPress={() => {
              navigate('MainTabs', {
                screen: 'HomeStack',
                params: {
                  screen: 'CinemaListScreen',
                },
              });
            }}>
            <Icon source="theater" size={24} color={THEME.primaryRed} />
            <Text style={styles.actionText}>
              By Cinemas
            </Text>
            <Icon source="chevron-right" size={24} color={THEME.textGray} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
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
            <Icon source="film" size={24} color={THEME.primaryRed} />
            <Text style={styles.actionText}>
              By Films
            </Text>
            <Icon source="chevron-right" size={24} color={THEME.textGray} />
          </TouchableOpacity>
        </View>

        {/* Menu Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Menu</Text>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() =>
              navigate('MainTabs', {
                screen: 'HomeStack',
                params: {
                  screen: 'HomeScreen',
                },
              })
            }
            activeOpacity={0.7}>
            <Icon source="home" size={24} color={THEME.primaryRed} />
            <Text style={styles.menuText}>Home</Text>
            <Icon source="chevron-right" size={24} color={THEME.textGray} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={() =>
              navigate('MainTabs', {
                screen: 'HomeStack',
                params: {
                  screen: 'MyTicketsScreen',
                },
              })
            }>
            <Icon source="ticket" size={24} color={THEME.primaryRed} />
            <Text style={styles.menuText}>
              My Tickets
            </Text>
            <Icon source="chevron-right" size={24} color={THEME.textGray} />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() =>
              navigation.navigate('CouponListScreen', {
                clientEmail: client?.email || '',
              })
            }
            activeOpacity={0.7}>
            <Icon source="gift" size={24} color={THEME.primaryRed} />
            <Text style={styles.menuText}>
              Coupons
            </Text>
            <Icon source="chevron-right" size={24} color={THEME.textGray} />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          onPress={() => logout()}
          style={styles.logoutButton}
          activeOpacity={0.7}>
          <Icon source="logout" size={24} color={THEME.primaryRed} />
          <Text style={styles.logoutText}>
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
    backgroundColor: THEME.background,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 20,
    marginTop: 20,
    marginBottom: 25,
    backgroundColor: THEME.cardBg,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: THEME.primaryRed,
    backgroundColor: '#000',
  },
  rankContainer: {
    position: 'absolute',
    bottom: -5,
    right: -5,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    color: THEME.textWhite,
    letterSpacing: 0.5,
  },
  pointsContainer: {
    flexDirection: 'column',
  },
  pointsLabel: {
    fontSize: 13,
    marginBottom: 4,
    color: THEME.textGray,
    fontWeight: '500',
  },
  pointsValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: THEME.textWhite,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    backgroundColor: THEME.cardBg,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
    marginLeft: 15,
    color: THEME.textWhite,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    backgroundColor: THEME.cardBg,
  },
  menuText: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
    marginLeft: 15,
    color: THEME.textWhite,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: THEME.primaryRed,
    marginBottom: 40,
    marginTop: 10,
    backgroundColor: 'transparent',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
    color: THEME.primaryRed,
  },
});

export default ProfileScreen;