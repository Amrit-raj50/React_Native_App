import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ThemeContext } from '../../context/ThemeContext';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function ProfileScreen() {
  const { colors } = useContext(ThemeContext);

  const studentData = {
    name: 'Amrit Raj',
    id: 'SUK250054CE047',
    email: 'amrit.raj@example.com',
    course: 'Computer Engineering',
    semester: '6th Semester',
    joinDate: 'Aug 2023',
    completedSurveys: 24,
    rating: 4.8,
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
      <View style={styles.headerContainer}>
        <View style={[styles.coverPhoto, { backgroundColor: colors.primary + '20' }]} />
        
        <View style={styles.profileInfoContainer}>
          <View style={[styles.avatarContainer, { borderColor: colors.background, backgroundColor: colors.card }]}>
            <Ionicons name="person" size={50} color={colors.primary} />
          </View>
          
          <Text style={[styles.nameText, { color: colors.text }]}>{studentData.name}</Text>
          <Text style={[styles.idText, { color: colors.primary }]}>{studentData.id}</Text>
          
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.text }]}>{studentData.completedSurveys}</Text>
              <Text style={[styles.statLabel, { color: colors.subText }]}>Surveys</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.text }]}>{studentData.rating}</Text>
              <Text style={[styles.statLabel, { color: colors.subText }]}>Rating</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.contentContainer}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Personal Information</Text>
        
        <View style={[styles.infoCard, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
          <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
            <View style={[styles.iconBox, { backgroundColor: colors.secondary + '20' }]}>
              <Ionicons name="mail" size={20} color={colors.secondary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: colors.subText }]}>Email Address</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>{studentData.email}</Text>
            </View>
          </View>

          <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
            <View style={[styles.iconBox, { backgroundColor: '#FF767520' }]}>
              <Ionicons name="school" size={20} color="#FF7675" />
            </View>
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: colors.subText }]}>Course</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>{studentData.course}</Text>
            </View>
          </View>

          <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
            <View style={[styles.iconBox, { backgroundColor: '#0984E320' }]}>
              <Ionicons name="book" size={20} color="#0984E3" />
            </View>
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: colors.subText }]}>Semester</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>{studentData.semester}</Text>
            </View>
          </View>

          <View style={[styles.infoRow, styles.lastRow]}>
            <View style={[styles.iconBox, { backgroundColor: '#00B89420' }]}>
              <Ionicons name="calendar" size={20} color="#00B894" />
            </View>
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: colors.subText }]}>Joined Date</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>{studentData.joinDate}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={[styles.editButton, { backgroundColor: colors.primary, shadowColor: colors.primary }]}>
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  coverPhoto: {
    width: '100%',
    height: 120,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  profileInfoContainer: {
    alignItems: 'center',
    marginTop: -50,
    width: '100%',
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    marginBottom: 15,
  },
  nameText: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 5,
  },
  idText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  statDivider: {
    width: 1,
    height: 40,
    marginHorizontal: 15,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 15,
  },
  infoCard: {
    borderRadius: 24,
    padding: 10,
    marginBottom: 30,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  editButton: {
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 6,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 1,
  },
});
