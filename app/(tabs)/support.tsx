import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ChevronDown, ChevronUp, Phone, Mail, Search, MessageCircle, ArrowRight } from 'lucide-react-native';
import { colors } from '@/constants/Colors';

// FAQ data
const faqData = [
  {
    id: '1',
    question: 'How do subscriptions work?',
    answer: 'Subscriptions give you a fixed number of kilometers at a discounted rate. You can choose daily, weekly, or monthly plans for both bikes and cars. Once you subscribe, you can take unlimited rides within the subscription period, up to the included distance limit. Additional distance is charged at regular per-kilometer rates.',
  },
  {
    id: '2',
    question: 'What happens if my driver cancels?',
    answer: 'If your driver cancels, our system will automatically find you another driver nearby. You\'ll receive a notification with the new driver\'s details. If no drivers are available, you can cancel the ride without any cancellation fee.',
  },
  {
    id: '3',
    question: 'How do I update my payment methods?',
    answer: 'You can update your payment methods in the Profile section. Tap on "Profile" > "Payment Methods" > "Add Payment Method". We support credit/debit cards, UPI, and popular digital wallets like Google Pay, PhonePe, and Paytm.',
  },
  {
    id: '4',
    question: 'What if I need to cancel my ride?',
    answer: 'You can cancel your ride anytime before it starts. However, cancellations made after a driver has been assigned may incur a small fee to compensate the driver for their time. The exact fee depends on how close the driver is to your pickup location.',
  },
  {
    id: '5',
    question: 'How is my environmental impact calculated?',
    answer: 'We calculate your environmental impact by comparing the CO2 emissions of electric vehicles to conventional fuel vehicles. On average, a regular car emits about 120g of CO2 per kilometer, while our electric vehicles produce zero direct emissions. The difference is your CO2 savings, which we convert into tree equivalents (1 tree absorbs about 20kg of CO2 per year).',
  },
  {
    id: '6',
    question: 'Can I schedule rides in advance?',
    answer: 'Yes, you can schedule rides up to 7 days in advance. Just select the "Schedule" option when booking a ride, and choose your preferred date and time. We\'ll ensure a driver is ready at your selected time.',
  },
  {
    id: '7',
    question: 'What safety measures are in place?',
    answer: 'We prioritize your safety with features like driver verification, real-time ride tracking, SOS button for emergencies, share ride details with trusted contacts, and a 24/7 support team. All our drivers undergo thorough background checks and vehicle inspections.',
  },
  {
    id: '8',
    question: 'How do I use my referral code?',
    answer: 'Share your unique referral code with friends and family. When they sign up and complete their first ride using your code, both of you will receive 5km worth of ride credits. You can find your code in the Profile section under "Refer & Earn".',
  },
];

// Quick help options
const quickHelpOptions = [
  { id: '1', title: 'Report an issue with my ride', icon: 'MessageCircle' },
  { id: '2', title: 'Payment problem', icon: 'CreditCard' },
  { id: '3', title: 'Driver behavior', icon: 'User' },
  { id: '4', title: 'Lost item', icon: 'Search' },
  { id: '5', title: 'Account security', icon: 'Shield' },
];

// Support contact details
const supportContacts = {
  phone: '+91 1800 123 4567',
  email: 'support@ecoride.in',
  hours: '24/7 Customer Support',
};

// Recent support tickets
const recentTickets = [
  {
    id: '1',
    title: 'Payment failed but amount deducted',
    status: 'In Progress',
    date: '10 Jun 2025',
    lastUpdate: '2 hours ago',
  },
  {
    id: '2',
    title: 'Driver took a longer route',
    status: 'Resolved',
    date: '5 Jun 2025',
    lastUpdate: '3 days ago',
  },
];

export default function SupportScreen() {
  const [expandedFaqId, setExpandedFaqId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredFaqs, setFilteredFaqs] = useState(faqData);
  
  const toggleFaq = (id) => {
    if (expandedFaqId === id) {
      setExpandedFaqId(null);
    } else {
      setExpandedFaqId(id);
    }
  };
  
  const handleSearch = (text) => {
    setSearchQuery(text);
    
    if (text.trim() === '') {
      setFilteredFaqs(faqData);
    } else {
      const filtered = faqData.filter(
        (faq) =>
          faq.question.toLowerCase().includes(text.toLowerCase()) ||
          faq.answer.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredFaqs(filtered);
    }
  };
  
  const renderQuickHelpItem = ({ item }) => (
    <TouchableOpacity style={styles.quickHelpItem}>
      <View style={styles.quickHelpIcon}>
        {renderIcon(item.icon)}
      </View>
      <Text style={styles.quickHelpTitle}>{item.title}</Text>
      <ArrowRight size={16} color="#757575" />
    </TouchableOpacity>
  );
  
  const renderIcon = (iconName) => {
    switch (iconName) {
      case 'MessageCircle':
        return <MessageCircle size={20} color={colors.primary} />;
      case 'CreditCard':
        return <CreditCard size={20} color={colors.primary} />;
      case 'User':
        return <User size={20} color={colors.primary} />;
      case 'Search':
        return <Search size={20} color={colors.primary} />;
      case 'Shield':
        return <Shield size={20} color={colors.primary} />;
      default:
        return <MessageCircle size={20} color={colors.primary} />;
    }
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Help & Support</Text>
      </View>
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.mainContainer}
      >
        <ScrollView style={styles.scrollContainer}>
          <View style={styles.searchContainer}>
            <Search size={20} color="#757575" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for help topics"
              value={searchQuery}
              onChangeText={handleSearch}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => handleSearch('')}
              >
                <Text style={styles.clearButtonText}>Clear</Text>
              </TouchableOpacity>
            )}
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Help</Text>
            <FlatList
              data={quickHelpOptions}
              renderItem={renderQuickHelpItem}
              keyExtractor={(item) => item.id}
              showsHorizontalScrollIndicator={false}
              horizontal
              contentContainerStyle={styles.quickHelpContainer}
            />
          </View>
          
          {recentTickets.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Your Recent Tickets</Text>
              
              {recentTickets.map((ticket) => (
                <TouchableOpacity key={ticket.id} style={styles.ticketItem}>
                  <View style={styles.ticketHeader}>
                    <Text style={styles.ticketTitle}>{ticket.title}</Text>
                    <View
                      style={[
                        styles.statusBadge,
                        ticket.status === 'Resolved'
                          ? styles.resolvedBadge
                          : styles.inProgressBadge,
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusText,
                          ticket.status === 'Resolved'
                            ? styles.resolvedText
                            : styles.inProgressText,
                        ]}
                      >
                        {ticket.status}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.ticketFooter}>
                    <Text style={styles.ticketDate}>Created: {ticket.date}</Text>
                    <Text style={styles.ticketUpdate}>
                      Updated: {ticket.lastUpdate}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
              
              <TouchableOpacity style={styles.viewAllButton}>
                <Text style={styles.viewAllButtonText}>View All Tickets</Text>
              </TouchableOpacity>
            </View>
          )}
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
            
            {filteredFaqs.length === 0 ? (
              <View style={styles.noResultsContainer}>
                <Text style={styles.noResultsText}>
                  No results found for "{searchQuery}"
                </Text>
                <TouchableOpacity
                  style={styles.contactSupportButton}
                  onPress={() => {}}
                >
                  <Text style={styles.contactSupportButtonText}>
                    Contact Support
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              filteredFaqs.map((faq) => (
                <View key={faq.id} style={styles.faqItem}>
                  <TouchableOpacity
                    style={styles.faqQuestion}
                    onPress={() => toggleFaq(faq.id)}
                  >
                    <Text style={styles.faqQuestionText}>{faq.question}</Text>
                    {expandedFaqId === faq.id ? (
                      <ChevronUp size={20} color="#757575" />
                    ) : (
                      <ChevronDown size={20} color="#757575" />
                    )}
                  </TouchableOpacity>
                  
                  {expandedFaqId === faq.id && (
                    <Text style={styles.faqAnswer}>{faq.answer}</Text>
                  )}
                </View>
              ))
            )}
          </View>
          
          <View style={styles.contactSection}>
            <Text style={styles.contactTitle}>Still need help?</Text>
            <Text style={styles.contactDescription}>
              Our support team is available 24/7 to assist you with any issues.
            </Text>
            
            <View style={styles.contactButtons}>
              <TouchableOpacity style={styles.contactButton}>
                <Phone size={20} color="#FFFFFF" />
                <Text style={styles.contactButtonText}>Call Support</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.contactButton}>
                <Mail size={20} color="#FFFFFF" />
                <Text style={styles.contactButtonText}>Email Support</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.contactDetails}>
              <Text style={styles.contactDetailsText}>
                <Text style={styles.contactLabel}>Phone: </Text>
                {supportContacts.phone}
              </Text>
              <Text style={styles.contactDetailsText}>
                <Text style={styles.contactLabel}>Email: </Text>
                {supportContacts.email}
              </Text>
              <Text style={styles.contactDetailsText}>
                <Text style={styles.contactLabel}>Hours: </Text>
                {supportContacts.hours}
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Mock components for icons that aren't imported
function CreditCard({ size, color }) {
  return <View style={{ width: size, height: size, backgroundColor: color, borderRadius: size / 4 }} />;
}

function User({ size, color }) {
  return <View style={{ width: size, height: size, backgroundColor: color, borderRadius: size / 2 }} />;
}

function Shield({ size, color }) {
  return <View style={{ width: size, height: size, backgroundColor: color, borderRadius: size / 4 }} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#212121',
  },
  mainContainer: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#212121',
    height: 40,
  },
  clearButton: {
    paddingHorizontal: 8,
  },
  clearButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: colors.primary,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#212121',
    marginBottom: 16,
  },
  quickHelpContainer: {
    paddingRight: 16,
  },
  quickHelpItem: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    marginRight: 12,
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 160,
  },
  quickHelpIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  quickHelpTitle: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#212121',
    marginRight: 8,
  },
  ticketItem: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  ticketTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#212121',
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  resolvedBadge: {
    backgroundColor: '#E8F5E9',
  },
  inProgressBadge: {
    backgroundColor: '#E3F2FD',
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  resolvedText: {
    color: colors.primary,
  },
  inProgressText: {
    color: colors.secondary,
  },
  ticketFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ticketDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#757575',
  },
  ticketUpdate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#757575',
  },
  viewAllButton: {
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  viewAllButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: colors.primary,
  },
  faqItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingBottom: 12,
    marginBottom: 12,
  },
  faqQuestion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestionText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#212121',
    flex: 1,
    marginRight: 8,
  },
  faqAnswer: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#757575',
    marginTop: 8,
    lineHeight: 20,
  },
  noResultsContainer: {
    alignItems: 'center',
    padding: 16,
  },
  noResultsText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#757575',
    marginBottom: 16,
    textAlign: 'center',
  },
  contactSupportButton: {
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  contactSupportButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  contactSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 24,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'center',
  },
  contactTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#212121',
    marginBottom: 8,
  },
  contactDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#757575',
    textAlign: 'center',
    marginBottom: 16,
  },
  contactButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flex: 1,
    marginHorizontal: 8,
  },
  contactButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  contactDetails: {
    width: '100%',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 16,
  },
  contactDetailsText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#212121',
    marginBottom: 8,
  },
  contactLabel: {
    fontFamily: 'Inter-Medium',
  },
});