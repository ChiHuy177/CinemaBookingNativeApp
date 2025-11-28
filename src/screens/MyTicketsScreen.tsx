/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  // Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Switched to Ionicons

import {MyTicketsScreenProps} from '../types/screentypes';
import {SafeAreaView} from 'react-native-safe-area-context';
import {MyTicketProps} from '../types/ticket';
import {useSpinner} from '../context/SpinnerContext';
import {useFocusEffect} from '@react-navigation/native';

import {TicketCard} from '../components/TicketCart';
import {getAllTickets} from '../services/TicketService';
import {showToast, checkErrorFetchingData} from '../utils/function';

// const {width} = Dimensions.get('window');

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
  activeTabShadow: '#FF3B30',
};

const MyTicketsScreen: React.FC<MyTicketsScreenProps> = ({navigation}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'coming' | 'past'>('all');
  const [tickets, setTickets] = useState<MyTicketProps[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<MyTicketProps[]>([]);

  const {showSpinner, hideSpinner} = useSpinner();

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
            // Re-apply filter based on current active tab
            if (activeTab === 'all') {
                 setFilteredTickets(responseData.result);
            } else {
                 // Trigger the filter logic again or just default to all for safety on refresh
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={THEME.background} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.glassButton}
          onPress={() => navigation.goBack()}>
          <Icon name="chevron-back" size={24} color={THEME.textWhite} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Tickets</Text>
        <View style={{width: 40}} /> 
      </View>

      {/* Custom Tab Bar */}
      <View style={styles.tabWrapper}>
        <View style={styles.tabContainer}>
            <TouchableOpacity
            style={[styles.tab, activeTab === 'all' && styles.activeTab]}
            activeOpacity={0.7}
            onPress={() => handlePickTab('all')}>
            <Text
                style={[
                styles.tabText,
                activeTab === 'all' && styles.activeTabText,
                ]}>
                All
            </Text>
            </TouchableOpacity>

            <TouchableOpacity
            style={[styles.tab, activeTab === 'coming' && styles.activeTab]}
            activeOpacity={0.7}
            onPress={() => handlePickTab('coming')}>
            <Text
                style={[
                styles.tabText,
                activeTab === 'coming' && styles.activeTabText,
                ]}>
                Upcoming
            </Text>
            </TouchableOpacity>

            <TouchableOpacity
            style={[styles.tab, activeTab === 'past' && styles.activeTab]}
            activeOpacity={0.7}
            onPress={() => handlePickTab('past')}>
            <Text
                style={[
                styles.tabText,
                activeTab === 'past' && styles.activeTabText,
                ]}>
                History
            </Text>
            </TouchableOpacity>
        </View>
      </View>

      {/* Content List */}
      <ScrollView
        style={styles.ticketsList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.ticketsContainer}>
        
        {filteredTickets.map(ticket => (
          <View key={ticket.ticketId} style={styles.ticketWrapper}>
            <TicketCard
              ticket={ticket}
              navigation={navigation}
            />
          </View>
        ))}

        {filteredTickets.length === 0 && (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
                <Icon name="ticket-outline" size={50} color={THEME.textDarkGray} />
                <View style={styles.emptyIconGlow} />
            </View>
            <Text style={styles.emptyStateText}>No tickets found</Text>
            <Text style={styles.emptyStateSubtext}>
               You haven't booked any movies in this category yet.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.background,
  },
  
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: THEME.background,
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
    borderColor: THEME.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: THEME.textWhite,
    letterSpacing: 0.5,
  },

  // Tabs
  tabWrapper: {
      paddingHorizontal: 20,
      marginBottom: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: THEME.cardBg,
    borderRadius: 25,
    padding: 5,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: THEME.primaryRed,
    shadowColor: THEME.activeTabShadow,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: THEME.textGray,
  },
  activeTabText: {
    color: '#FFF',
    fontWeight: 'bold',
  },

  // List
  ticketsList: {
    flex: 1,
  },
  ticketsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  ticketWrapper: {
      marginBottom: 15,
      // Note: TicketCard internal styling should handle the card look, 
      // but if not, we assume it fits the theme or you might need to style the component itself.
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyIconContainer: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: THEME.cardBg,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
      position: 'relative',
      borderWidth: 1,
      borderColor: THEME.border,
  },
  emptyIconGlow: {
      position: 'absolute',
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: THEME.primaryRed,
      opacity: 0.1,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: THEME.textWhite,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: THEME.textGray,
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 20,
  },
});

export default MyTicketsScreen;