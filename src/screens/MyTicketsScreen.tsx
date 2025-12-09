/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import { MyTicketsScreenProps } from '../types/screentypes';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MyTicketProps } from '../types/ticket';
import { useSpinner } from '../context/SpinnerContext';
import { useFocusEffect } from '@react-navigation/native';

import { TicketCard } from '../components/TicketCart';
import { getAllTickets } from '../services/TicketService';
import { showToast, checkErrorFetchingData } from '../utils/function';

const { width } = Dimensions.get('window');

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
  activeTabShadow: '#F74346',
};

const MyTicketsScreen: React.FC<MyTicketsScreenProps> = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'coming' | 'past'>('all');
  const [tickets, setTickets] = useState<MyTicketProps[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<MyTicketProps[]>([]);

  const { showSpinner, hideSpinner } = useSpinner();

  const handlePickTab = useCallback(
    (tab: 'all' | 'coming' | 'past') => {
      const today = new Date();
      if (tab === 'all') {
        setActiveTab('all');
        setFilteredTickets(tickets);
      } else if (tab === 'coming') {
        setActiveTab('coming');
        setFilteredTickets(
          tickets.filter(
            eachTicket => new Date(eachTicket.showingTime.startTime) >= today,
          ),
        );
      } else {
        setActiveTab('past');
        setFilteredTickets(
          tickets.filter(
            eachTicket => new Date(eachTicket.showingTime.startTime) < today,
          ),
        );
      }
    },
    [tickets],
  );

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function fetchTickets() {
        try {
          showSpinner();
          const responseData = await getAllTickets();
          if (responseData.code === 1000 && isActive) {
            setTickets(responseData.result);
            if (activeTab === 'all') {
              setFilteredTickets(responseData.result);
            } else {
              setFilteredTickets(responseData.result);
              setActiveTab('all');
            }
          } else {
            showToast({
              type: 'error',
              text1: 'Error',
              text2: responseData.message,
            });
          }
        } catch (error) {
          checkErrorFetchingData({
            error: error,
            title: 'Error fetching tickets',
          });
        } finally {
          hideSpinner();
        }
      }
      fetchTickets();

      return () => {
        isActive = false;
      };
    }, []),
  );

  const getTabCount = (tab: 'all' | 'coming' | 'past') => {
    const today = new Date();
    if (tab === 'all') return tickets.length;
    if (tab === 'coming') {
      return tickets.filter(
        ticket => new Date(ticket.showingTime.startTime) >= today,
      ).length;
    }
    return tickets.filter(
      ticket => new Date(ticket.showingTime.startTime) < today,
    ).length;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={THEME.background} />

      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="chevron-back" size={24} color={THEME.textWhite} />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>My Tickets</Text>
            <Text style={styles.headerSubtitle}>
              {tickets.length} {tickets.length === 1 ? 'ticket' : 'tickets'}
            </Text>
          </View>
          <View style={styles.headerRight}>
            <View style={styles.ticketIconCircle}>
              <Icon name="ticket" size={20} color={THEME.primaryRed} />
            </View>
          </View>
        </View>

        {/* Modern Tab Bar */}
        <View style={styles.tabSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabScrollContainer}
          >
            <TouchableOpacity
              style={[
                styles.tabCard,
                activeTab === 'all' && styles.tabCardActive,
              ]}
              activeOpacity={0.8}
              onPress={() => handlePickTab('all')}
            >
              <View
                style={[
                  styles.tabIconWrapper,
                  activeTab === 'all' && styles.tabIconWrapperActive,
                ]}
              >
                <Icon
                  name="grid"
                  size={18}
                  color={activeTab === 'all' ? THEME.textWhite : THEME.textGray}
                />
              </View>
              <View style={styles.tabTextContainer}>
                <Text
                  style={[
                    styles.tabLabel,
                    activeTab === 'all' && styles.tabLabelActive,
                  ]}
                >
                  All Tickets
                </Text>
                <Text
                  style={[
                    styles.tabCount,
                    activeTab === 'all' && styles.tabCountActive,
                  ]}
                >
                  {getTabCount('all')}
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tabCard,
                activeTab === 'coming' && styles.tabCardActive,
              ]}
              activeOpacity={0.8}
              onPress={() => handlePickTab('coming')}
            >
              <View
                style={[
                  styles.tabIconWrapper,
                  activeTab === 'coming' && styles.tabIconWrapperActive,
                ]}
              >
                <Icon
                  name="time"
                  size={18}
                  color={
                    activeTab === 'coming' ? THEME.textWhite : THEME.textGray
                  }
                />
              </View>
              <View style={styles.tabTextContainer}>
                <Text
                  style={[
                    styles.tabLabel,
                    activeTab === 'coming' && styles.tabLabelActive,
                  ]}
                >
                  Upcoming
                </Text>
                <Text
                  style={[
                    styles.tabCount,
                    activeTab === 'coming' && styles.tabCountActive,
                  ]}
                >
                  {getTabCount('coming')}
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tabCard,
                activeTab === 'past' && styles.tabCardActive,
              ]}
              activeOpacity={0.8}
              onPress={() => handlePickTab('past')}
            >
              <View
                style={[
                  styles.tabIconWrapper,
                  activeTab === 'past' && styles.tabIconWrapperActive,
                ]}
              >
                <Icon
                  name="checkmark-done"
                  size={18}
                  color={
                    activeTab === 'past' ? THEME.textWhite : THEME.textGray
                  }
                />
              </View>
              <View style={styles.tabTextContainer}>
                <Text
                  style={[
                    styles.tabLabel,
                    activeTab === 'past' && styles.tabLabelActive,
                  ]}
                >
                  History
                </Text>
                <Text
                  style={[
                    styles.tabCount,
                    activeTab === 'past' && styles.tabCountActive,
                  ]}
                >
                  {getTabCount('past')}
                </Text>
              </View>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Tickets List */}
        <ScrollView
          style={styles.ticketsList}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.ticketsContainer}
        >
          {filteredTickets.map(ticket => (
            <View key={ticket.ticketId} style={styles.ticketWrapper}>
              <TicketCard ticket={ticket} navigation={navigation} />
            </View>
          ))}

          {filteredTickets.length === 0 && (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconContainer}>
                <Icon
                  name="ticket-outline"
                  size={64}
                  color={THEME.textDarkGray}
                />
                <View style={styles.emptyGlow} />
              </View>
              <Text style={styles.emptyTitle}>No Tickets Found</Text>
              <Text style={styles.emptySubtitle}>
                {activeTab === 'all'
                  ? "You haven't booked any movies yet."
                  : activeTab === 'coming'
                  ? 'No upcoming shows at the moment.'
                  : 'Your ticket history is empty.'}
              </Text>
              <TouchableOpacity
                style={styles.browseButton}
                onPress={() => navigation.navigate('HomeScreen')}
              >
                <Icon name="film-outline" size={18} color="#FFF" />
                <Text style={styles.browseButtonText}>Browse Movies</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: THEME.border,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: THEME.glass,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.border,
  },
  headerContent: {
    flex: 1,
    marginLeft: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: THEME.textWhite,
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 13,
    color: THEME.textGray,
    fontWeight: '500',
  },
  headerRight: {
    marginLeft: 12,
  },
  ticketIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(247, 67, 70, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(247, 67, 70, 0.2)',
  },

  // Tabs
  tabSection: {
    paddingVertical: 20,
  },
  tabScrollContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  tabCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.cardBg,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: THEME.border,
    minWidth: 140,
  },
  tabCardActive: {
    backgroundColor: THEME.primaryRed,
    borderColor: THEME.primaryRed,
    shadowColor: THEME.primaryRed,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  tabIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  tabIconWrapperActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  tabTextContainer: {
    flex: 1,
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: THEME.textGray,
    marginBottom: 2,
  },
  tabLabelActive: {
    color: THEME.textWhite,
  },
  tabCount: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME.textWhite,
  },
  tabCountActive: {
    color: THEME.textWhite,
  },

  // Tickets List
  ticketsList: {
    flex: 1,
  },
  ticketsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  ticketWrapper: {
    marginBottom: 16,
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: THEME.cardBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    position: 'relative',
    borderWidth: 2,
    borderColor: THEME.border,
  },
  emptyGlow: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: THEME.primaryRed,
    opacity: 0.1,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: THEME.textWhite,
    marginBottom: 10,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: THEME.textGray,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  browseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.primaryRed,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 24,
    gap: 8,
    shadowColor: THEME.primaryRed,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  browseButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: THEME.textWhite,
    letterSpacing: 0.3,
  },
});

export default MyTicketsScreen;
