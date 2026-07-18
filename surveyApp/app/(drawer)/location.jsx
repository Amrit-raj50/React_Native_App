import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import * as Clipboard from 'expo-clipboard';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function LocationScreen() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchLocation = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        setLoading(false);
        return;
      }

      let loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setLocation(loc);
    } catch (error) {
      setErrorMsg('Failed to fetch location');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  const copyToClipboard = async () => {
    if (location) {
      const locString = `Lat: ${location.coords.latitude.toFixed(6)}, Lon: ${location.coords.longitude.toFixed(6)}`;
      await Clipboard.setStringAsync(locString);
      Alert.alert("Copied", "Location copied to clipboard!");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Current Location</Text>
      
      <View style={styles.card}>
        {loading ? (
          <ActivityIndicator size="large" color="#2E86DE" />
        ) : errorMsg ? (
          <Text style={styles.errorText}>{errorMsg}</Text>
        ) : location ? (
          <View style={styles.detailsContainer}>
            <View style={styles.row}>
              <Text style={styles.label}>Latitude:</Text>
              <Text style={styles.value}>{location.coords.latitude.toFixed(6)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Longitude:</Text>
              <Text style={styles.value}>{location.coords.longitude.toFixed(6)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Accuracy:</Text>
              <Text style={styles.value}>{location.coords.accuracy?.toFixed(2)} meters</Text>
            </View>
          </View>
        ) : (
          <Text style={styles.text}>Location not available</Text>
        )}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.button} onPress={fetchLocation}>
          <Ionicons name="refresh" size={20} color="#fff" />
          <Text style={styles.buttonText}>Refresh</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.copyButton, !location && styles.disabledButton]} 
          onPress={copyToClipboard}
          disabled={!location}
        >
          <Ionicons name="copy" size={20} color="#fff" />
          <Text style={styles.buttonText}>Copy</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F6FA',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2F3640',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    minHeight: 150,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 20,
  },
  detailsContainer: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f2f6',
  },
  label: {
    fontSize: 16,
    color: '#718093',
    fontWeight: '500',
  },
  value: {
    fontSize: 16,
    color: '#2F3640',
    fontWeight: 'bold',
  },
  errorText: {
    color: '#e84118',
    fontSize: 16,
  },
  text: {
    color: '#718093',
    fontSize: 16,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#2E86DE',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  copyButton: {
    backgroundColor: '#4CD137',
  },
  disabledButton: {
    backgroundColor: '#A4B0BE',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});