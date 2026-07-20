import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import * as Clipboard from 'expo-clipboard';
import Ionicons from '@expo/vector-icons/Ionicons';
import Animated, { FadeInUp, ZoomIn } from 'react-native-reanimated';
import { useRouter } from 'expo-router';

export default function LocationScreen() {
  const router = useRouter();
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);

  const fetchWeather = async (lat, lon) => {
    setWeatherLoading(true);
    try {
      const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
      const data = await res.json();
      if (data && data.current_weather) {
        setWeather(data.current_weather);
      }
    } catch (e) {
      console.log('Failed to fetch weather', e);
    } finally {
      setWeatherLoading(false);
    }
  };

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
      await fetchWeather(loc.coords.latitude, loc.coords.longitude);
    } catch (_error) {
      setErrorMsg('Failed to fetch location');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocation();
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.push('/(tabs)')} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="#2F3640" />
        </TouchableOpacity>
        <Text style={styles.title}>Current Location</Text>
      </View>
      
      <Animated.View entering={FadeInUp.delay(100).duration(500)} style={styles.card}>
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
      </Animated.View>

      <Text style={styles.title}>Current Weather</Text>
      <Animated.View entering={FadeInUp.delay(300).duration(500)} style={styles.card}>
        {loading || weatherLoading ? (
          <ActivityIndicator size="large" color="#2E86DE" />
        ) : weather ? (
          <View style={styles.detailsContainer}>
            <View style={styles.row}>
              <Text style={styles.label}>Temperature:</Text>
              <Text style={styles.value}>{weather.temperature}°C</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Wind Speed:</Text>
              <Text style={styles.value}>{weather.windspeed} km/h</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Conditions Code:</Text>
              <Text style={styles.value}>{weather.weathercode}</Text>
            </View>
          </View>
        ) : (
          <Text style={styles.text}>Weather data not available</Text>
        )}
      </Animated.View>

      <Animated.View entering={ZoomIn.delay(500).duration(500)} style={styles.actions}>
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
      </Animated.View>
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    justifyContent: 'center',
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    padding: 4,
    zIndex: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2F3640',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    minHeight: 120,
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