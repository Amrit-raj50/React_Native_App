import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useCallback, useContext } from 'react';
import { ThemeContext } from "../../../context/ThemeContext";

export default function Dashboard() {
  const router = useRouter();
  const { isDarkMode, colors } = useContext(ThemeContext);
  const [stats, setStats] = useState({ todayCount: 0, totalCount: 0 });
  const [recentSurveys, setRecentSurveys] = useState([]);

  const loadDashboardData = async () => {
    try {
      const data = await AsyncStorage.getItem('surveys');
      const surveys = data ? JSON.parse(data) : [];
      
      const totalCount = surveys.length;
      
      const today = new Date().toLocaleDateString();
      const todayCount = surveys.filter(s => s.date === today).length;

      setStats({ todayCount, totalCount });

      // Get last 2 surveys
      const recent = surveys.slice(-2).reverse();
      setRecentSurveys(recent);
    } catch (error) {
      console.log('Failed to load dashboard data');
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadDashboardData();
    }, [])
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Welcome Section */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Welcome Back!</Text>
        <Text style={[styles.subtitle, { color: colors.subText }]}>Manage your field surveys efficiently.</Text>
      </View>

      {/* Student Details */}
      <View style={[styles.studentCard, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
        <View style={styles.studentHeader}>
          <View style={[styles.avatarIcon, { backgroundColor: colors.primary + '20' }]}>
            <Ionicons name="person" size={24} color={colors.primary} />
          </View>
          <View style={styles.studentInfo}>
            <Text style={[styles.studentName, { color: colors.text }]}>Amrit Raj</Text>
            <Text style={[styles.studentId, { color: colors.subText }]}>SUK250054CE047</Text>
          </View>
        </View>
        <View style={[styles.statsContainer, { borderTopColor: colors.border }]}>
          <View style={styles.statBox}>
            <Text style={[styles.statLabel, { color: colors.subText }]}>Today's Surveys</Text>
            <Text style={[styles.statValue, { color: colors.primary }]}>{stats.todayCount}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statLabel, { color: colors.subText }]}>Total Count</Text>
            <Text style={[styles.statValue, { color: colors.primary }]}>{stats.totalCount}</Text>
          </View>
        </View>
      </View>

      <Text style={[styles.sectionHeading, { color: colors.text }]}>Quick Actions</Text>
      <View style={styles.quickActionsContainer}>
        <TouchableOpacity 
          style={[styles.actionCard, { backgroundColor: colors.card, shadowColor: colors.shadow }]} 
          onPress={() => router.push("/camera")}
        >
          <View style={[styles.actionIconContainer, { backgroundColor: '#FF767520' }]}>
            <Ionicons name="camera" size={32} color="#FF7675" />
          </View>
          <Text style={[styles.actionText, { color: colors.text }]}>Camera</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionCard, { backgroundColor: colors.card, shadowColor: colors.shadow }]} 
          onPress={() => router.push("/location")}
        >
          <View style={[styles.actionIconContainer, { backgroundColor: '#00B89420' }]}>
            <Ionicons name="location" size={32} color="#00B894" />
          </View>
          <Text style={[styles.actionText, { color: colors.text }]}>Location</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionCard, { backgroundColor: colors.card, shadowColor: colors.shadow }]} 
          onPress={() => router.push("/contacts")}
        >
          <View style={[styles.actionIconContainer, { backgroundColor: '#0984E320' }]}>
            <Ionicons name="people" size={32} color="#0984E3" />
          </View>
          <Text style={[styles.actionText, { color: colors.text }]}>Contacts</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionCard, { backgroundColor: colors.card, shadowColor: colors.shadow }]} 
          onPress={() => router.push("/(tabs)/survey")}
        >
          <View style={[styles.actionIconContainer, { backgroundColor: colors.primary + '20' }]}>
            <Ionicons name="add" size={32} color={colors.primary} />
          </View>
          <Text style={[styles.actionText, { color: colors.text }]}>New Survey</Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.sectionHeading, { color: colors.text }]}>Recent Survey Summary</Text>
      <View style={[styles.summaryCard, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
        {recentSurveys.length > 0 ? (
          recentSurveys.map((survey, index) => (
            <View 
              key={survey.id} 
              style={[
                styles.summaryRow, 
                { borderBottomColor: colors.border },
                index === recentSurveys.length - 1 && { borderBottomWidth: 0 }
              ]}
            >
              <Text style={[styles.summaryLabel, { color: colors.text }]} numberOfLines={1}>
                {survey.siteName || 'Unnamed Site'}
              </Text>
              <View style={[styles.statusBadge, { backgroundColor: colors.secondary + '20' }]}>
                <Text style={[styles.summaryStatus, { color: colors.secondary }]}>Completed</Text>
              </View>
            </View>
          ))
        ) : (
          <View style={[styles.summaryRow, { borderBottomWidth: 0 }]}>
            <Text style={[styles.summaryLabel, { color: colors.subText }]}>No recent surveys</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 25,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    marginTop: 5,
    fontWeight: "500",
  },
  studentCard: {
    borderRadius: 24,
    padding: 20,
    marginBottom: 30,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5,
  },
  studentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  avatarIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  studentInfo: {
    marginLeft: 15,
  },
  studentName: {
    fontSize: 20,
    fontWeight: "bold",
  },
  studentId: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 2,
  },
  statsContainer: {
    flexDirection: "row",
    borderTopWidth: 1,
    paddingTop: 15,
  },
  statBox: {
    flex: 1,
    alignItems: "center",
  },
  statLabel: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 5,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "900",
  },
  sectionHeading: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 15,
    letterSpacing: -0.5,
  },
  quickActionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  actionCard: {
    width: "47%",
    padding: 20,
    borderRadius: 24,
    alignItems: "center",
    marginBottom: 15,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  actionIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  actionText: {
    fontSize: 15,
    fontWeight: "700",
  },
  summaryCard: {
    borderRadius: 24,
    padding: 20,
    marginBottom: 40,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  summaryLabel: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
    marginRight: 10,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  summaryStatus: {
    fontSize: 13,
    fontWeight: "700",
  },
});