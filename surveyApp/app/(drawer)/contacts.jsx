import React, { useState, useEffect, useContext } from 'react';
import { 
  View, Text, StyleSheet, FlatList, TextInput, 
  TouchableOpacity, ActivityIndicator, Alert, RefreshControl
} from 'react-native';
import * as Contacts from 'expo-contacts';
import * as Clipboard from 'expo-clipboard';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { ThemeContext } from '../../context/ThemeContext';

export default function ContactsScreen() {
  const router = useRouter();
  const { colors } = useContext(ThemeContext);
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);

  const fetchContacts = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === 'granted') {
        setPermissionGranted(true);
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.PhoneNumbers],
          sort: Contacts.SortTypes.FirstName,
        });

        if (data.length > 0) {
          setContacts(data);
          setFilteredContacts(data);
        } else {
          setContacts([]);
          setFilteredContacts([]);
        }
      } else {
        setPermissionGranted(false);
      }
    } catch (_error) {
      Alert.alert("Error", "Failed to fetch contacts");
    } finally {
      if (isRefresh) setRefreshing(false);
      else setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query) {
      const filtered = contacts.filter((c) => {
        const name = `${c.firstName || ''} ${c.lastName || ''}`.toLowerCase();
        return name.includes(query.toLowerCase());
      });
      setFilteredContacts(filtered);
    } else {
      setFilteredContacts(contacts);
    }
  };

  const copyToClipboard = async (number) => {
    await Clipboard.setStringAsync(number);
    Alert.alert("Copied", "Contact number copied to clipboard!");
  };

  const renderContact = ({ item }) => {
    const name = `${item.firstName || ''} ${item.lastName || ''}`.trim() || 'Unknown Contact';
    const initial = name ? name.charAt(0).toUpperCase() : '?';
    const phone = item.phoneNumbers && item.phoneNumbers.length > 0 ? item.phoneNumbers[0].number : 'No Number';

    return (
      <View style={[styles.contactCard, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
        <View style={[styles.avatar, { backgroundColor: colors.primary + '20' }]}>
          <Text style={[styles.avatarText, { color: colors.primary }]}>{initial}</Text>
        </View>
        <View style={styles.contactInfo}>
          <Text style={[styles.contactName, { color: colors.text }]} numberOfLines={1}>{name}</Text>
          <Text style={[styles.contactPhone, { color: colors.subText }]}>{phone}</Text>
        </View>
        <TouchableOpacity 
          style={[
            styles.copyButton, 
            { backgroundColor: phone === 'No Number' ? colors.border : colors.secondary + '20' },
            phone === 'No Number' && styles.disabledButton
          ]}
          onPress={() => copyToClipboard(phone)}
          disabled={phone === 'No Number'}
        >
          <Ionicons name="copy" size={20} color={phone === 'No Number' ? colors.subText : colors.secondary} />
        </TouchableOpacity>
      </View>
    );
  };

  if (!permissionGranted && !loading) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background }]}>
        <View style={[styles.permissionIconBg, { backgroundColor: colors.card }]}>
          <Ionicons name="people-outline" size={60} color={colors.subText} />
        </View>
        <Text style={[styles.permissionText, { color: colors.text }]}>We need permission to access your contacts.</Text>
        <TouchableOpacity style={[styles.primaryButton, { backgroundColor: colors.primary, shadowColor: colors.primary }]} onPress={() => fetchContacts()}>
          <Text style={styles.primaryButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.push('/(tabs)')} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Contacts</Text>
      </View>
      <View style={[styles.searchContainer, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
        <Ionicons name="search" size={20} color={colors.placeholder} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search Contacts"
          placeholderTextColor={colors.placeholder}
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      <Text style={[styles.counterText, { color: colors.subText }]}>
        Showing {filteredContacts.length} {filteredContacts.length === 1 ? 'contact' : 'contacts'}
      </Text>

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredContacts}
          keyExtractor={(item) => item.id}
          renderItem={renderContact}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => fetchContacts(true)} tintColor={colors.primary} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={[styles.permissionIconBg, { backgroundColor: colors.card }]}>
                <Ionicons name="sad-outline" size={60} color={colors.subText} />
              </View>
              <Text style={[styles.emptyText, { color: colors.subText }]}>No contacts found</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginTop: 15,
  },
  backButton: {
    marginRight: 15,
    padding: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionIconBg: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
  },
  permissionText: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 20,
    fontWeight: '500',
    paddingHorizontal: 20,
  },
  primaryButton: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 6,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 15,
    marginBottom: 20,
    borderRadius: 16,
    paddingHorizontal: 15,
    borderWidth: 1,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },
  counterText: {
    marginHorizontal: 15,
    marginBottom: 15,
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  listContainer: {
    paddingBottom: 20,
    paddingHorizontal: 15,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 20,
    marginBottom: 12,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 5,
  },
  contactPhone: {
    fontSize: 14,
    fontWeight: '500',
  },
  copyButton: {
    padding: 12,
    borderRadius: 14,
  },
  disabledButton: {
    opacity: 0.5,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },
  emptyText: {
    marginTop: 15,
    fontSize: 16,
    fontWeight: '600',
  }
});