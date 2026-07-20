import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { ThemeContext } from '../../context/ThemeContext';

export default function SettingsScreen() {
  const { isDarkMode, toggleTheme, colors } = useContext(ThemeContext);
  const [notifications, setNotifications] = useState(true);
  const [locationTracking, setLocationTracking] = useState(true);
  const [dataSync, setDataSync] = useState(true);

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.subText }]}>General</Text>
        
        <Animated.View entering={FadeInUp.delay(100).duration(400)} style={[styles.settingCard, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
          <View style={[styles.settingRow, { borderBottomColor: colors.border }]}>
            <View style={styles.settingInfo}>
              <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
                <Ionicons name="notifications" size={20} color={colors.primary} />
              </View>
              <Text style={[styles.settingText, { color: colors.text }]}>Enable Notifications</Text>
            </View>
            <Switch 
              value={notifications} 
              onValueChange={setNotifications} 
              trackColor={{ false: colors.border, true: colors.secondary }}
              thumbColor="#FFFFFF"
            />
          </View>
          
          <View style={[styles.settingRow, { borderBottomColor: colors.border }]}>
            <View style={styles.settingInfo}>
              <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
                <Ionicons name="moon" size={20} color={colors.primary} />
              </View>
              <Text style={[styles.settingText, { color: colors.text }]}>Dark Mode</Text>
            </View>
            <Switch 
              value={isDarkMode} 
              onValueChange={toggleTheme} 
              trackColor={{ false: colors.border, true: colors.secondary }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={[styles.settingRow, { borderBottomColor: colors.border }]}>
            <View style={styles.settingInfo}>
              <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
                <Ionicons name="location" size={20} color={colors.primary} />
              </View>
              <Text style={[styles.settingText, { color: colors.text }]}>Location Tracking</Text>
            </View>
            <Switch 
              value={locationTracking} 
              onValueChange={setLocationTracking} 
              trackColor={{ false: colors.border, true: colors.secondary }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={[styles.settingRow, styles.lastRow]}>
            <View style={styles.settingInfo}>
              <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
                <Ionicons name="sync" size={20} color={colors.primary} />
              </View>
              <Text style={[styles.settingText, { color: colors.text }]}>Background Sync</Text>
            </View>
            <Switch 
              value={dataSync} 
              onValueChange={setDataSync} 
              trackColor={{ false: colors.border, true: colors.secondary }}
              thumbColor="#FFFFFF"
            />
          </View>
        </Animated.View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.subText }]}>About & Legal</Text>
        <Animated.View entering={FadeInUp.delay(200).duration(400)}>
          <TouchableOpacity style={[styles.actionCard, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
            <Text style={[styles.actionText, { color: colors.text }]}>Terms of Service</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.subText} />
          </TouchableOpacity>
        </Animated.View>
        <Animated.View entering={FadeInUp.delay(300).duration(400)}>
          <TouchableOpacity style={[styles.actionCard, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
            <Text style={[styles.actionText, { color: colors.text }]}>Privacy Policy</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.subText} />
          </TouchableOpacity>
        </Animated.View>
        <Animated.View entering={FadeInUp.delay(400).duration(400)} style={[styles.actionCard, styles.versionCard]}>
          <Text style={[styles.versionLabel, { color: colors.subText }]}>App Version</Text>
          <Text style={[styles.versionValue, { color: colors.primary }]}>2.0.0 (Premium Build)</Text>
        </Animated.View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    padding: 20,
    paddingBottom: 5,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 15,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginLeft: 5,
  },
  settingCard: {
    borderRadius: 20,
    padding: 10,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  settingText: {
    fontSize: 16,
    fontWeight: '600',
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderRadius: 20,
    marginBottom: 12,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '600',
  },
  versionCard: {
    backgroundColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
    paddingHorizontal: 10,
    marginTop: 10,
  },
  versionLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  versionValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});