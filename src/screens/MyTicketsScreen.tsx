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
import {colors} from '../constants/colors';
import {MyTicketsScreenProps} from '../types/screentypes';
import {SafeAreaView} from 'react-native-safe-area-context';
import {MyTicketProps} from '../types/ticket';
import {useSpinner} from '../context/SpinnerContext';
import {useFocusEffect} from '@react-navigation/native';
import {checkErrorFetchingData, showToast} from '../utils/functions';
import {getAllTickets} from '../api/services/ticket.service';
import {TicketCard} from '../components/TicketCart';

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
      <StatusBar barStyle="light-content" backgroundColor={colors.dark} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon source="chevron-left" size={30} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Tickets</Text>
        <View style={{width: 24}} />
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
            Cooming
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
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.dark,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.white,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.mediumGray,
    marginHorizontal: 20,
    borderRadius: 25,
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.lightGray,
  },
  activeTabText: {
    color: colors.white,
  },
  ticketsList: {
    flex: 1,
  },
  ticketsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  upcomingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dark,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  upcomingText: {
    fontSize: 12,
    color: colors.primary,
    marginLeft: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.white,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: colors.lightGray,
    textAlign: 'center',
  },
});

export default MyTicketsScreen;
