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
} from 'react-native';
import {Icon} from 'react-native-paper';

import {MyTicketsScreenProps} from '../types/screentypes';
import {SafeAreaView} from 'react-native-safe-area-context';
import {MyTicketProps} from '../types/ticket';
import {useSpinner} from '../context/SpinnerContext';
import {useFocusEffect} from '@react-navigation/native';

import {TicketCard} from '../components/TicketCart';
// import { colors } from '../constant/color'; // Replaced with local THEME
import { getAllTickets } from '../services/TicketService';
import { showToast, checkErrorFetchingData } from '../utils/function';

// THEME CONSTANTS EXTRACTED FROM IMAGE
const THEME = {
  background: '#13141F', // Dark blue-black background
  primaryRed: '#F54B64', // Coral red
  cardBg: '#20212D',     // Slightly lighter for cards/tabs
  textWhite: '#FFFFFF',
  textGray: '#8F9BB3',   // Muted blue-gray text
  tabInactive: 'transparent',
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
            setFilteredTickets(responseData.result);
          } else {
            showToast({
              type: 'error',
              text1: responseData.message,
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

      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon source="chevron-left" size={28} color={THEME.textWhite} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Tickets</Text>
        <View style={{width: 40}} />
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'all' && styles.activeTab]}
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
          onPress={() => handlePickTab('coming')}>
          <Text
            style={[
              styles.tabText,
              activeTab === 'coming' && styles.activeTabText,
            ]}>
            Coming
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'past' && styles.activeTab]}
          onPress={() => handlePickTab('past')}>
          <Text
            style={[
              styles.tabText,
              activeTab === 'past' && styles.activeTabText,
            ]}>
            Past
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.ticketsList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.ticketsContainer}>
        {filteredTickets.map(ticket => (
          <TicketCard
            key={ticket.ticketId}
            ticket={ticket}
            navigation={navigation}
          />
        ))}

        {filteredTickets.length === 0 && (
            <View style={styles.emptyState}>
                <Icon source="ticket-outline" size={60} color={THEME.cardBg} />
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: THEME.background,
  },
  backButton: {
    padding: 6,
    borderRadius: 10,
    backgroundColor: THEME.cardBg,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: THEME.textWhite,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: THEME.cardBg, // Dark card background for tab container
    marginHorizontal: 20,
    borderRadius: 30, // Pill shape
    padding: 5,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 25, // Inner pill shape
  },
  activeTab: {
    backgroundColor: THEME.primaryRed, // Coral Red
    shadowColor: THEME.primaryRed,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME.textGray,
  },
  activeTabText: {
    color: THEME.textWhite,
    fontWeight: 'bold',
  },
  ticketsList: {
    flex: 1,
  },
  ticketsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  // Kept logic for these styles even if unused in provided snippet, updated colors
  upcomingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.cardBg,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  upcomingText: {
    fontSize: 12,
    color: THEME.primaryRed,
    marginLeft: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    marginTop: 20,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: THEME.textWhite,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: THEME.textGray,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});

export default MyTicketsScreen;