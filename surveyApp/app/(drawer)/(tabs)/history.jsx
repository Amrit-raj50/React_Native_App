import React, { useState, useEffect, useCallback, useContext } from 'react';
import { 
  View, Text, StyleSheet, FlatList, TextInput, 
  TouchableOpacity, Alert, Modal, ScrollView, Image 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect } from 'expo-router';
import { ThemeContext } from '../../../context/ThemeContext';
import Animated, { FadeInRight, ZoomIn } from 'react-native-reanimated';

export default function HistoryScreen() {
  const { isDarkMode, colors } = useContext(ThemeContext);
  const [surveys, setSurveys] = useState([]);
  const [filteredSurveys, setFilteredSurveys] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState('All');
  const [selectedSurvey, setSelectedSurvey] = useState(null);

  const fetchSurveys = async () => {
    try {
      const data = await AsyncStorage.getItem('surveys');
      const parsed = data ? JSON.parse(data) : [];
      setSurveys(parsed.reverse()); // Newest first
    } catch (error) {
      Alert.alert('Error', 'Failed to load surveys');
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchSurveys();
    }, [])
  );

  useEffect(() => {
    let result = surveys;

    if (searchQuery) {
      result = result.filter(s => 
        (s.siteName && s.siteName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (s.clientName && s.clientName.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (filterPriority !== 'All') {
      result = result.filter(s => s.priority === filterPriority);
    }

    setFilteredSurveys(result);
  }, [surveys, searchQuery, filterPriority]);

  const deleteSurvey = (id) => {
    Alert.alert(
      "Delete Survey",
      "Are you sure you want to delete this survey?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: async () => {
            const updatedSurveys = surveys.filter(s => s.id !== id);
            await AsyncStorage.setItem('surveys', JSON.stringify(updatedSurveys));
            setSurveys(updatedSurveys);
            if (selectedSurvey?.id === id) setSelectedSurvey(null);
          }
        }
      ]
    );
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return colors.danger;
      case 'Medium': return '#F5A623';
      case 'Low': return colors.secondary;
      default: return colors.subText;
    }
  };

  const renderSurvey = ({ item, index }) => (
    <Animated.View entering={FadeInRight.delay(index * 100).duration(400)}>
      <TouchableOpacity 
        style={[styles.surveyCard, { backgroundColor: colors.card, shadowColor: colors.shadow }]} 
        onPress={() => setSelectedSurvey(item)}
      >
      <View style={styles.cardHeader}>
        <Text style={[styles.siteName, { color: colors.text }]} numberOfLines={1}>{item.siteName}</Text>
        <TouchableOpacity onPress={() => deleteSurvey(item.id)}>
          <View style={[styles.deleteIconBg, { backgroundColor: colors.danger + '20' }]}>
            <Ionicons name="trash-outline" size={20} color={colors.danger} />
          </View>
        </TouchableOpacity>
      </View>
      
      <View style={styles.cardBody}>
        {item.photoUri ? (
          <Image source={{ uri: item.photoUri }} style={styles.cardPhoto} />
        ) : null}
        <View style={styles.cardContent}>
          <Text style={[styles.clientName, { color: colors.subText }]}>Client: {item.clientName}</Text>
        </View>
      </View>
      
      <View style={[styles.cardFooter, { borderTopColor: colors.border }]}>
        <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(item.priority) + '20' }]}>
          <Text style={[styles.priorityText, { color: getPriorityColor(item.priority) }]}>{item.priority}</Text>
        </View>
        <Text style={[styles.dateText, { color: colors.subText }]}>{item.date}</Text>
      </View>
    </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.headerTitle, { color: colors.text }]}>Survey History</Text>
      
      <View style={[styles.searchContainer, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
        <Ionicons name="search" size={20} color={colors.placeholder} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search by site or client..."
          placeholderTextColor={colors.placeholder}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.filterContainer}>
        {['All', 'Low', 'Medium', 'High'].map(p => (
          <TouchableOpacity 
            key={p} 
            style={[
              styles.filterBadge, 
              { backgroundColor: colors.card, borderColor: colors.border },
              filterPriority === p && { backgroundColor: colors.primary, borderColor: colors.primary }
            ]}
            onPress={() => setFilterPriority(p)}
          >
            <Text 
              style={[
                styles.filterText, 
                { color: colors.subText },
                filterPriority === p && { color: '#FFFFFF' }
              ]}
            >
              {p}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredSurveys}
        keyExtractor={item => item.id}
        renderItem={renderSurvey}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Animated.View entering={ZoomIn.duration(500)} style={styles.emptyContainer}>
            <View style={[styles.emptyIconBg, { backgroundColor: colors.card }]}>
              <Ionicons name="document-text-outline" size={60} color={colors.subText} />
            </View>
            <Text style={[styles.emptyText, { color: colors.subText }]}>No surveys found</Text>
          </Animated.View>
        }
      />

      {/* Detail Modal */}
      {selectedSurvey && (
        <Modal visible={!!selectedSurvey} animationType="slide" transparent={true}>
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Survey Details</Text>
              
              <ScrollView style={styles.detailScroll} showsVerticalScrollIndicator={false}>
                {selectedSurvey.photoUri ? (
                  <Image source={{ uri: selectedSurvey.photoUri }} style={styles.detailPhoto} />
                ) : null}
                <View style={[styles.detailRow, { borderBottomColor: colors.border }]}>
                  <Text style={[styles.detailLabel, { color: colors.subText }]}>Site Name:</Text>
                  <Text style={[styles.detailValue, { color: colors.text }]}>{selectedSurvey.siteName}</Text>
                </View>
                <View style={[styles.detailRow, { borderBottomColor: colors.border }]}>
                  <Text style={[styles.detailLabel, { color: colors.subText }]}>Client:</Text>
                  <Text style={[styles.detailValue, { color: colors.text }]}>{selectedSurvey.clientName}</Text>
                </View>
                <View style={[styles.detailRow, { borderBottomColor: colors.border }]}>
                  <Text style={[styles.detailLabel, { color: colors.subText }]}>Contact:</Text>
                  <Text style={[styles.detailValue, { color: colors.text }]}>{selectedSurvey.contactNumber || 'N/A'}</Text>
                </View>
                <View style={[styles.detailRow, { borderBottomColor: colors.border }]}>
                  <Text style={[styles.detailLabel, { color: colors.subText }]}>Priority:</Text>
                  <Text style={[styles.detailValue, { color: getPriorityColor(selectedSurvey.priority) }]}>
                    {selectedSurvey.priority}
                  </Text>
                </View>
                <View style={[styles.detailRow, { borderBottomColor: colors.border }]}>
                  <Text style={[styles.detailLabel, { color: colors.subText }]}>Date:</Text>
                  <Text style={[styles.detailValue, { color: colors.text }]}>{selectedSurvey.date}</Text>
                </View>
                <View style={styles.detailRowColumn}>
                  <Text style={[styles.detailLabel, { color: colors.subText }]}>Notes:</Text>
                  <Text style={[styles.detailValueNotes, { color: colors.text }]}>{selectedSurvey.description}</Text>
                </View>
              </ScrollView>

              <TouchableOpacity 
                style={[styles.closeButton, { backgroundColor: colors.primary }]} 
                onPress={() => setSelectedSurvey(null)}
              >
                <Text style={styles.closeButtonText}>Close Details</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 20,
    letterSpacing: -0.5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 15,
    borderWidth: 1,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  filterBadge: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  filterText: {
    fontWeight: '700',
    fontSize: 13,
  },
  listContainer: {
    paddingBottom: 20,
  },
  surveyCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  siteName: {
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
    marginRight: 15,
  },
  deleteIconBg: {
    padding: 8,
    borderRadius: 10,
  },
  clientName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 15,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    paddingTop: 15,
  },
  priorityBadge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  dateText: {
    fontSize: 13,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },
  emptyIconBg: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    borderRadius: 24,
    padding: 25,
    maxHeight: '85%',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 20,
    textAlign: 'center',
  },
  detailScroll: {
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 12,
    borderBottomWidth: 1,
    paddingBottom: 12,
  },
  detailRowColumn: {
    marginBottom: 10,
  },
  detailLabel: {
    fontSize: 15,
    fontWeight: '700',
    width: 100,
  },
  detailValue: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  detailValueNotes: {
    fontSize: 16,
    marginTop: 8,
    lineHeight: 24,
  },
  closeButton: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardBody: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
  },
  cardPhoto: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginRight: 15,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
  },
  detailPhoto: {
    width: '100%',
    height: 180,
    borderRadius: 16,
    marginBottom: 20,
    resizeMode: 'cover',
  }
});