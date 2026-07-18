import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ThemeContext } from '../../context/ThemeContext';

export default function ClipboardScreen() {
  const { isDarkMode, colors } = useContext(ThemeContext);
  const [pastedNotes, setPastedNotes] = useState('');

  const copyToClipboard = async (text, label) => {
    await Clipboard.setStringAsync(text);
    Alert.alert("Copied", `${label} copied to clipboard!`);
  };

  const pasteFromClipboard = async () => {
    const text = await Clipboard.getStringAsync();
    if (text) {
      setPastedNotes(text);
      Alert.alert("Pasted", "Notes pasted successfully!");
    } else {
      Alert.alert("Empty", "Clipboard is empty.");
    }
  };

  const clearClipboard = async () => {
    await Clipboard.setStringAsync('');
    setPastedNotes('');
    Alert.alert("Cleared", "Clipboard data has been cleared.");
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Copy Items</Text>
      
      <View style={[styles.actionsContainer, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
        <TouchableOpacity 
          style={[styles.actionButton, { borderBottomColor: colors.border }]} 
          onPress={() => copyToClipboard('SURV-2026-001', 'Survey ID')}
        >
          <View style={[styles.iconBox, { backgroundColor: colors.primary + '20' }]}>
            <Ionicons name="pricetag" size={20} color={colors.primary} />
          </View>
          <Text style={[styles.actionText, { color: colors.text }]}>Copy Survey ID</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, { borderBottomColor: colors.border }]} 
          onPress={() => copyToClipboard('+1 234 567 8900', 'Contact Number')}
        >
          <View style={[styles.iconBox, { backgroundColor: colors.secondary + '20' }]}>
            <Ionicons name="call" size={20} color={colors.secondary} />
          </View>
          <Text style={[styles.actionText, { color: colors.text }]}>Copy Contact Number</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, { borderBottomWidth: 0 }]} 
          onPress={() => copyToClipboard('Lat: 37.7749, Lon: -122.4194', 'Location')}
        >
          <View style={[styles.iconBox, { backgroundColor: '#FF767520' }]}>
            <Ionicons name="location" size={20} color="#FF7675" />
          </View>
          <Text style={[styles.actionText, { color: colors.text }]}>Copy Location</Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>Paste Notes</Text>
      <View style={[styles.pasteContainer, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
        <TextInput
          style={[
            styles.textInput, 
            { backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.border }
          ]}
          placeholder="Paste your notes here..."
          placeholderTextColor={colors.placeholder}
          value={pastedNotes}
          onChangeText={setPastedNotes}
          multiline
        />
        <TouchableOpacity 
          style={[styles.pasteButton, { backgroundColor: colors.primary, shadowColor: colors.primary }]} 
          onPress={pasteFromClipboard}
        >
          <Ionicons name="clipboard" size={20} color="#FFFFFF" />
          <Text style={styles.pasteButtonText}>Paste from Clipboard</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={[styles.clearButton, { backgroundColor: colors.danger, shadowColor: colors.danger }]} 
        onPress={clearClipboard}
      >
        <Ionicons name="trash" size={20} color="#FFFFFF" />
        <Text style={styles.clearButtonText}>Clear Clipboard Data</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 15,
    marginTop: 10,
    letterSpacing: -0.5,
  },
  actionsContainer: {
    borderRadius: 24,
    padding: 10,
    marginBottom: 25,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '600',
  },
  pasteContainer: {
    borderRadius: 24,
    padding: 20,
    marginBottom: 25,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  textInput: {
    height: 120,
    textAlignVertical: 'top',
    fontSize: 16,
    marginBottom: 20,
    borderRadius: 16,
    borderWidth: 1,
    padding: 15,
  },
  pasteButton: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  pasteButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  clearButton: {
    flexDirection: 'row',
    padding: 18,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  clearButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});