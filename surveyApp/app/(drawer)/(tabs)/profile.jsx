import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function ProfileScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>AR</Text>
        </View>
        <Text style={styles.name}>Amrit Raj</Text>
        <Text style={styles.studentId}>SUK250054CE047</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons name="mail-outline" size={20} color="#7F8FA6" style={styles.icon} />
            <Text style={styles.infoText}>amrit.raj@example.com</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={20} color="#7F8FA6" style={styles.icon} />
            <Text style={styles.infoText}>+91 98765 43210</Text>
          </View>
          <View style={[styles.infoRow, styles.lastRow]}>
            <Ionicons name="location-outline" size={20} color="#7F8FA6" style={styles.icon} />
            <Text style={styles.infoText}>Bangalore, India</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App Preferences</Text>
        <TouchableOpacity style={styles.actionCard}>
          <View style={styles.actionLeft}>
            <Ionicons name="notifications-outline" size={22} color="#2F3640" style={styles.icon} />
            <Text style={styles.actionText}>Notifications</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#DCDDE1" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionCard}>
          <View style={styles.actionLeft}>
            <Ionicons name="lock-closed-outline" size={22} color="#2F3640" style={styles.icon} />
            <Text style={styles.actionText}>Privacy & Security</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#DCDDE1" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionCard}>
          <View style={styles.actionLeft}>
            <Ionicons name="help-circle-outline" size={22} color="#2F3640" style={styles.icon} />
            <Text style={styles.actionText}>Help & Support</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#DCDDE1" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton}>
        <Ionicons name="log-out-outline" size={22} color="#E15F41" style={styles.icon} />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E9ED',
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#2E86DE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#2E86DE',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  avatarText: {
    fontSize: 40,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2F3640',
    marginBottom: 5,
  },
  studentId: {
    fontSize: 16,
    color: '#7F8FA6',
    fontWeight: '600',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#718093',
    marginBottom: 15,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F6FA',
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  icon: {
    marginRight: 15,
  },
  infoText: {
    fontSize: 16,
    color: '#2F3640',
    flex: 1,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    fontSize: 16,
    color: '#2F3640',
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 40,
    padding: 15,
    borderRadius: 15,
    shadowColor: '#E15F41',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#FFEAA7',
  },
  logoutText: {
    fontSize: 18,
    color: '#E15F41',
    fontWeight: 'bold',
  },
});