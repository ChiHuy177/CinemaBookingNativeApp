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
  Dimensions,
} from 'react-native';
import {ProfileScreenProps} from '../types/screentypes';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

import {navigate} from '../utils/navigation';
import {useFocusEffect} from '@react-navigation/native';
import RankBadge from '../components/RankBadge';
import {getRankColor} from '../constant/color';
import {useSpinner} from '../context/SpinnerContext';
import {logout} from '../services/AuthService';
import {getClient} from '../services/ClientService';
import {ClientProfileProps} from '../types/client';
import {checkErrorFetchingData, getClientImage} from '../utils/function';

const {width} = Dimensions.get('window');

// THEME CONFIGURATION
const THEME = {
  background: '#10111D',
  cardBg: '#1C1D2E',
  primaryRed: '#F74346',
  textWhite: '#FFFFFF',
  textGray: '#A0A0B0',
  textDarkGray: '#5C5D6F',
  glass: 'rgba(255, 255, 255, 0.08)',
  border: 'rgba(255, 255, 255, 0.05)',
  shadowColor: '#F74346',
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
    <View style={styles.container}>
      <StatusBar backgroundColor={THEME.background} barStyle="light-content" />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 40}}>
        
        {/* Hero Profile Card */}
        <View style={styles.heroCard}>
          <View style={styles.heroGradient} />
          
          <SafeAreaView style={styles.heroContent}>
            {/* Avatar Section */}
            <View style={styles.avatarSection}>
              <View style={styles.avatarWrapper}>
                <Image
                  source={{uri: getClientImage(client?.avatar || '')}}
                  style={styles.avatar}
                />
                <View style={styles.rankBadgeWrapper}>
                  <RankBadge rankName={client?.rank.name || ''} />
                </View>
              </View>
              
              <View style={styles.userTextInfo}>
                <Text style={styles.userName}>{client?.name}</Text>
                <Text style={styles.userEmail}>{client?.email}</Text>
              </View>
            </View>

            {/* Points Card */}
            <View style={styles.pointsCard}>
              <View style={styles.pointsIconCircle}>
                <Icon name="star" size={24} color={getRankColor(client?.rank.name || '')} />
              </View>
              <View style={styles.pointsInfo}>
                <Text style={styles.pointsLabel}>Loyalty Points</Text>
                <Text style={[styles.pointsValue, {color: getRankColor(client?.rank.name || '')}]}>
                  {client?.loyalPoints.toLocaleString('vi-VN')}
                </Text>
              </View>
              <View style={styles.pointsGlow} />
            </View>
          </SafeAreaView>
        </View>

        <View style={styles.contentContainer}>
          {/* Quick Actions Grid */}
          <View style={styles.quickActionsGrid}>
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
              style={styles.quickActionCard}
              activeOpacity={0.8}>
              <View style={[styles.quickActionIcon, {backgroundColor: 'rgba(52, 199, 89, 0.15)'}]}>
                <Icon name="create-outline" size={24} color="#34C759" />
              </View>
              <Text style={styles.quickActionText}>Edit Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                if (client) {
                  navigation.navigate('ChangePasswordScreen', {
                    email: client.email,
                  });
                }
              }}
              style={styles.quickActionCard}
              activeOpacity={0.8}>
              <View style={[styles.quickActionIcon, {backgroundColor: 'rgba(255, 149, 0, 0.15)'}]}>
                <Icon name="lock-closed-outline" size={24} color="#FF9500" />
              </View>
              <Text style={styles.quickActionText}>Password</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionCard}
              activeOpacity={0.8}
              onPress={() =>
                navigation.navigate('CouponListScreen', {
                  clientEmail: client?.email || '',
                })
              }>
              <View style={[styles.quickActionIcon, {backgroundColor: 'rgba(255, 214, 10, 0.15)'}]}>
                <Icon name="gift-outline" size={24} color="#FFD60A" />
              </View>
              <Text style={styles.quickActionText}>Coupons</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionCard}
              activeOpacity={0.8}
              onPress={() =>
                navigate('MainTabs', {
                  screen: 'HomeStack',
                  params: {
                    screen: 'MyTicketsScreen',
                  },
                })
              }>
              <View style={[styles.quickActionIcon, {backgroundColor: 'rgba(247, 67, 70, 0.15)'}]}>
                <Icon name="ticket-outline" size={24} color={THEME.primaryRed} />
              </View>
              <Text style={styles.quickActionText}>Tickets</Text>
            </TouchableOpacity>
          </View>

          {/* Browse Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Browse</Text>
            
            <TouchableOpacity
              style={styles.menuCard}
              activeOpacity={0.7}
              onPress={() => {
                navigate('MainTabs', {
                  screen: 'HomeStack',
                  params: {
                    screen: 'CinemaListScreen',
                  },
                });
              }}>
              <View style={[styles.menuIconBox, {backgroundColor: 'rgba(0, 122, 255, 0.1)'}]}>
                <Icon name="location-outline" size={22} color="#007AFF" />
              </View>
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuTitle}>Cinemas Near You</Text>
                <Text style={styles.menuSubtitle}>Find theaters and showtimes</Text>
              </View>
              <Icon name="chevron-forward" size={20} color={THEME.textDarkGray} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuCard}
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
              <View style={[styles.menuIconBox, {backgroundColor: 'rgba(175, 82, 222, 0.1)'}]}>
                <Icon name="film-outline" size={22} color="#AF52DE" />
              </View>
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuTitle}>All Movies</Text>
                <Text style={styles.menuSubtitle}>Explore our collection</Text>
              </View>
              <Icon name="chevron-forward" size={20} color={THEME.textDarkGray} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuCard}
              onPress={() =>
                navigate('MainTabs', {
                  screen: 'HomeStack',
                  params: {
                    screen: 'HomeScreen',
                  },
                })
              }
              activeOpacity={0.7}>
              <View style={[styles.menuIconBox, {backgroundColor: 'rgba(255, 45, 85, 0.1)'}]}>
                <Icon name="home-outline" size={22} color="#FF2D55" />
              </View>
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuTitle}>Home Dashboard</Text>
                <Text style={styles.menuSubtitle}>Featured & trending</Text>
              </View>
              <Icon name="chevron-forward" size={20} color={THEME.textDarkGray} />
            </TouchableOpacity>
          </View>

          {/* Logout Button */}
          <TouchableOpacity
            onPress={() => logout()}
            style={styles.logoutButton}
            activeOpacity={0.8}>
            <Icon name="log-out-outline" size={22} color={THEME.primaryRed} />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.background,
  },
  scrollView: {
    flex: 1,
  },

  // Hero Card
  heroCard: {
    backgroundColor: THEME.cardBg,
    paddingBottom: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  heroGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 200,
    backgroundColor: THEME.primaryRed,
    opacity: 0.1,
  },
  heroContent: {
    paddingTop: 20,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    backgroundColor: '#000',
  },
  rankBadgeWrapper: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  userTextInfo: {
    alignItems: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: THEME.textWhite,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: THEME.textGray,
  },
  pointsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    position: 'relative',
    overflow: 'hidden',
  },
  pointsIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  pointsInfo: {
    flex: 1,
  },
  pointsLabel: {
    fontSize: 12,
    color: THEME.textGray,
    fontWeight: '500',
    marginBottom: 4,
  },
  pointsValue: {
    fontSize: 22,
    fontWeight: '700',
  },
  pointsGlow: {
    position: 'absolute',
    right: -30,
    top: -30,
    width: 100,
    height: 100,
    backgroundColor: THEME.primaryRed,
    opacity: 0.1,
    borderRadius: 50,
  },

  // Content Container
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },

  // Quick Actions Grid
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 32,
    gap: 12,
  },
  quickActionCard: {
    width: (width - 52) / 2,
    backgroundColor: THEME.cardBg,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.border,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME.textWhite,
    textAlign: 'center',
  },

  // Section
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: THEME.textWhite,
    marginBottom: 16,
  },

  // Menu Card
  menuCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.cardBg,
    padding: 16,
    borderRadius: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  menuIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME.textWhite,
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 12,
    color: THEME.textGray,
  },

  // Logout
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(247, 67, 70, 0.08)',
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(247, 67, 70, 0.2)',
    marginTop: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 10,
    color: THEME.primaryRed,
  },
});

export default ProfileScreen;