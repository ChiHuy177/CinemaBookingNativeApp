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
import Icon from 'react-native-vector-icons/Ionicons'; // Switched to Ionicons

import {navigate} from '../utils/navigation';
import {useFocusEffect} from '@react-navigation/native';
import RankBadge from '../components/RankBadge';
import {getRankColor} from '../constant/color';
import {useSpinner} from '../context/SpinnerContext';
import {logout} from '../services/AuthService';
import {getClient} from '../services/ClientService';
import {ClientProfileProps} from '../types/client';
import {checkErrorFetchingData, getClientImage} from '../utils/function';

// --- CINEMATIC DARK THEME CONFIGURATION ---
const THEME = {
  background: '#10111D', // Deep Cinematic Blue/Black
  cardBg: '#1C1D2E', // Slightly lighter panel
  primaryRed: '#FF3B30', // Neon/Cinematic Red
  textWhite: '#FFFFFF',
  textGray: '#A0A0B0',
  textDarkGray: '#5C5D6F',
  glass: 'rgba(255, 255, 255, 0.08)',
  border: 'rgba(255, 255, 255, 0.05)',
  shadowColor: '#FF3B30',
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

      {/* Header Title */}
      <View style={styles.header}>
          <Text style={styles.headerTitle}>My Profile</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 40}}>
        
        {/* User Info Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarWrapper}>
            <Image
              source={{uri: getClientImage(client?.avatar || '')}}
              style={styles.avatar}
            />
            <View style={styles.rankBadgeWrapper}>
              <RankBadge rankName={client?.rank.name || ''} />
            </View>
          </View>

          <View style={styles.userInfo}>
            <Text style={styles.userName}>
              {client?.name}
            </Text>
            <Text style={styles.userEmail}>{client?.email}</Text>
            
            <View style={styles.pointsWrapper}>
              <Icon name="star" size={14} color={getRankColor(client?.rank.name || '')} />
              <Text
                style={[
                  styles.pointsValue,
                  {color: getRankColor(client?.rank.name || '')},
                ]}>
                {' '}{client?.loyalPoints.toLocaleString('vi-VN')} Points
              </Text>
            </View>
          </View>
          {/* Card Glow Effect */}
          <View style={styles.cardGlow} />
        </View>

        {/* Account Settings Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Account Settings</Text>

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
            style={styles.menuItem}
            activeOpacity={0.7}>
            <View style={[styles.iconBox, {backgroundColor: 'rgba(52, 199, 89, 0.1)'}]}>
                <Icon name="create-outline" size={20} color="#34C759" />
            </View>
            <Text style={styles.menuText}>Edit Profile</Text>
            <Icon name="chevron-forward" size={20} color={THEME.textDarkGray} />
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => {
              if (client) {
                navigation.navigate('ChangePasswordScreen', {
                  email: client.email,
                });
              }
            }}
            style={styles.menuItem}
            activeOpacity={0.7}>
            <View style={[styles.iconBox, {backgroundColor: 'rgba(255, 149, 0, 0.1)'}]}>
                <Icon name="lock-closed-outline" size={20} color="#FF9500" />
            </View>
            <Text style={styles.menuText}>Change Password</Text>
            <Icon name="chevron-forward" size={20} color={THEME.textDarkGray} />
          </TouchableOpacity>
        </View>

        {/* Quick Links Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Quick Access</Text>

          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={() => {
              navigate('MainTabs', {
                screen: 'HomeStack',
                params: {
                  screen: 'CinemaListScreen',
                },
              });
            }}>
             <View style={[styles.iconBox, {backgroundColor: 'rgba(0, 122, 255, 0.1)'}]}>
                <Icon name="location-outline" size={20} color="#007AFF" />
            </View>
            <Text style={styles.menuText}>Browse Cinemas</Text>
            <Icon name="chevron-forward" size={20} color={THEME.textDarkGray} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
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
             <View style={[styles.iconBox, {backgroundColor: 'rgba(175, 82, 222, 0.1)'}]}>
                <Icon name="film-outline" size={20} color="#AF52DE" />
            </View>
            <Text style={styles.menuText}>Browse Movies</Text>
            <Icon name="chevron-forward" size={20} color={THEME.textDarkGray} />
          </TouchableOpacity>
        </View>

        {/* Menu Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>My Activity</Text>

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
             <View style={[styles.iconBox, {backgroundColor: 'rgba(255, 45, 85, 0.1)'}]}>
                <Icon name="home-outline" size={20} color="#FF2D55" />
            </View>
            <Text style={styles.menuText}>Home Dashboard</Text>
            <Icon name="chevron-forward" size={20} color={THEME.textDarkGray} />
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
             <View style={[styles.iconBox, {backgroundColor: 'rgba(255, 59, 48, 0.1)'}]}>
                <Icon name="ticket-outline" size={20} color="#FF3B30" />
            </View>
            <Text style={styles.menuText}>My Tickets</Text>
            <Icon name="chevron-forward" size={20} color={THEME.textDarkGray} />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() =>
              navigation.navigate('CouponListScreen', {
                clientEmail: client?.email || '',
              })
            }
            activeOpacity={0.7}>
             <View style={[styles.iconBox, {backgroundColor: 'rgba(255, 214, 10, 0.1)'}]}>
                <Icon name="gift-outline" size={20} color="#FFD60A" />
            </View>
            <Text style={styles.menuText}>My Coupons</Text>
            <Icon name="chevron-forward" size={20} color={THEME.textDarkGray} />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          onPress={() => logout()}
          style={styles.logoutButton}
          activeOpacity={0.7}>
          <Icon name="log-out-outline" size={24} color={THEME.primaryRed} />
          <Text style={styles.logoutText}>Log Out</Text>
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
  header: {
      paddingHorizontal: 20,
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  headerTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: THEME.textWhite,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  
  // Profile Card
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 24,
    marginTop: 20,
    marginBottom: 30,
    backgroundColor: THEME.cardBg,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  cardGlow: {
      position: 'absolute',
      top: -20,
      right: -20,
      width: 100,
      height: 100,
      backgroundColor: THEME.primaryRed,
      opacity: 0.1,
      borderRadius: 50,
      zIndex: -1,
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: '#000',
  },
  rankBadgeWrapper: {
    position: 'absolute',
    bottom: -6,
    right: -6,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  userInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
    color: THEME.textWhite,
  },
  userEmail: {
      fontSize: 12,
      color: THEME.textGray,
      marginBottom: 10,
  },
  pointsWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  pointsValue: {
    fontSize: 13,
    fontWeight: 'bold',
  },

  // Sections
  sectionContainer: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 15,
    color: THEME.textDarkGray,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  
  // Menu Item
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    backgroundColor: THEME.cardBg,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  iconBox: {
      width: 36,
      height: 36,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 15,
  },
  menuText: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
    color: THEME.textWhite,
  },

  // Logout
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 59, 48, 0.3)',
    marginBottom: 20,
    marginTop: 10,
    backgroundColor: 'rgba(255, 59, 48, 0.05)',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
    color: THEME.primaryRed,
  },
});

export default ProfileScreen;